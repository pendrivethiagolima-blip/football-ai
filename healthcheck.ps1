# Simple health monitor loop for production
param(
  [Parameter(Mandatory=$true)][string]$Domain,
  [int]$IntervalSeconds = 60
)

Write-Host "== Health Monitor :: $Domain (every $IntervalSeconds s) ==" -ForegroundColor Cyan

function Ping-Path($path) {
  $url = "$Domain$path"
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

while ($true) {
  $time = Get-Date -Format o
  $checks = @(
    Ping-Path "/api/health",
    Ping-Path "/live",
    Ping-Path "/ranking",
    Ping-Path "/teams"
  )
  Write-Host "[$time]" -NoNewline
  $checks | ForEach-Object { Write-Host "  $($_.Path)=$($_.Status) ($($_.Ms)ms)" }
  Start-Sleep -Seconds $IntervalSeconds
}


