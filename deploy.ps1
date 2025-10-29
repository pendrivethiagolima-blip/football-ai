#requires -version 5.1
<#
  Deploy 1-clique para Vercel (produção)
  - Coleta variáveis
  - Valida entradas
  - Verifica Vercel CLI / login
  - Define variáveis no Vercel (production)
  - Executa deploy e captura domínio
  - Faz testes básicos de saúde
  - Exibe checklist pós-deploy
#>

param(
  [string]$ProjectName = "football-ia"
)

function Require-Command($name) {
  $exists = Get-Command $name -ErrorAction SilentlyContinue
  return $null -ne $exists
}

Write-Host "== Football-IA :: Deploy Produção (Vercel) ==" -ForegroundColor Cyan

$ErrorActionPreference = 'Stop'

# Ir para pasta do script (raiz do projeto)
Set-Location -Path $PSScriptRoot

# Verificar Node/npm
if (-not (Require-Command node) -or -not (Require-Command npm)) {
  Write-Error "Node.js e npm são necessários. Instale Node LTS e tente novamente."
}

# Verificar/instalar Vercel CLI
if (-not (Require-Command vercel)) {
  Write-Host "Vercel CLI não encontrado. Instalando globalmente..." -ForegroundColor Yellow
  npm i -g vercel | Out-Null
  if (-not (Require-Command vercel)) { throw "Falha ao instalar Vercel CLI." }
}

# Verificar login Vercel
try {
  vercel whoami | Out-Null
} catch {
  Write-Error "Você precisa estar logado no Vercel. Rode: vercel login e depois reexecute este script."
}

# Coleta de variáveis
$API_FOOTBALL_KEY = Read-Host "API_FOOTBALL_KEY (api-sports.io)"
$FOOTBALL_DATA_KEY = Read-Host "FOOTBALL_DATA_KEY (football-data.org)"
$NEXT_PUBLIC_SUPABASE_URL = Read-Host "NEXT_PUBLIC_SUPABASE_URL"
$NEXT_PUBLIC_SUPABASE_ANON_KEY = Read-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY"
$UPSTASH_REDIS_REST_URL = Read-Host "UPSTASH_REDIS_REST_URL"
$UPSTASH_REDIS_REST_TOKEN = Read-Host "UPSTASH_REDIS_REST_TOKEN"

# Validação
$vars = @{
  API_FOOTBALL_KEY = $API_FOOTBALL_KEY
  FOOTBALL_DATA_KEY = $FOOTBALL_DATA_KEY
  NEXT_PUBLIC_SUPABASE_URL = $NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY = $NEXT_PUBLIC_SUPABASE_ANON_KEY
  UPSTASH_REDIS_REST_URL = $UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN = $UPSTASH_REDIS_REST_TOKEN
}

$missing = $vars.GetEnumerator() | Where-Object { [string]::IsNullOrWhiteSpace($_.Value) } | Select-Object -ExpandProperty Key
if ($missing.Count -gt 0) {
  throw "Variáveis ausentes: $($missing -join ', '). Abortei."
}

# Link do projeto
Write-Host "Vinculando projeto ao Vercel..." -ForegroundColor Cyan
vercel link --yes --project $ProjectName | Out-Null

function Set-VercelEnv($name, $value) {
  $p = Start-Process -FilePath powershell -ArgumentList "-NoProfile","-Command","$value | vercel env add $name production" -NoNewWindow -Wait -PassThru
  if ($p.ExitCode -ne 0) { throw "Falha ao definir variável $name" }
}

Write-Host "Definindo variáveis de ambiente (production)..." -ForegroundColor Cyan
Set-VercelEnv -name "API_FOOTBALL_KEY" -value $API_FOOTBALL_KEY
Set-VercelEnv -name "FOOTBALL_DATA_KEY" -value $FOOTBALL_DATA_KEY
Set-VercelEnv -name "NEXT_PUBLIC_SUPABASE_URL" -value $NEXT_PUBLIC_SUPABASE_URL
Set-VercelEnv -name "NEXT_PUBLIC_SUPABASE_ANON_KEY" -value $NEXT_PUBLIC_SUPABASE_ANON_KEY
Set-VercelEnv -name "UPSTASH_REDIS_REST_URL" -value $UPSTASH_REDIS_REST_URL
Set-VercelEnv -name "UPSTASH_REDIS_REST_TOKEN" -value $UPSTASH_REDIS_REST_TOKEN

# Deploy
Write-Host "Iniciando deploy de produção..." -ForegroundColor Cyan
$deployOutput = vercel --prod --yes 2>&1
Write-Host $deployOutput

# Extrair domínio
$domain = ($deployOutput | Select-String -Pattern "https?://[^\s]+" -AllMatches).Matches | Select-Object -Last 1 | ForEach-Object { $_.Value }
if (-not $domain) { throw "Não foi possível detectar o domínio de produção no output do Vercel." }

Write-Host "Domínio de produção: $domain" -ForegroundColor Green

# Validação básica
function Test-Endpoint($path) {
  $url = "$domain$path"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    [PSCustomObject]@{ Path=$path; Status=$resp.StatusCode; Ms=$sw.ElapsedMilliseconds }
  } catch {
    $sw.Stop()
    [PSCustomObject]@{ Path=$path; Status='ERROR'; Ms=$sw.ElapsedMilliseconds }
  }
}

Write-Host "Testando endpoints..." -ForegroundColor Cyan
$results = @(
  Test-Endpoint "/",
  Test-Endpoint "/live",
  Test-Endpoint "/prelive",
  Test-Endpoint "/teams",
  Test-Endpoint "/ranking",
  Test-Endpoint "/refs"
)
$results | Format-Table -AutoSize

Write-Host "\nChecklist pós-deploy:" -ForegroundColor Cyan
Write-Host " - Variáveis definidas no Vercel (production)" -ForegroundColor Gray
Write-Host " - Cron /api/cron/update configurado (UI: Settings → Cron Jobs)" -ForegroundColor Gray
Write-Host " - Páginas: /live, /prelive, /teams, /ranking, /refs" -ForegroundColor Gray
Write-Host " - Logs em Vercel (Functions) sem erros críticos" -ForegroundColor Gray
Write-Host " - Supabase: tabela live_samples recebendo inserts" -ForegroundColor Gray
Write-Host "\nPronto! Seu sistema está online em: $domain" -ForegroundColor Green


