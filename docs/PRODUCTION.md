# Produção – Football-IA

## Deploy Automático no Vercel
1. Suba o código para um repositório no GitHub (ou GitLab/Bitbucket suportados).
2. No Vercel, clique em "New Project" → importe o repositório.
3. Em Settings → Environment Variables, adicione:
   - `API_FOOTBALL_KEY`
   - `FOOTBALL_DATA_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Adicione um Cron Job para `/api/cron/update` com `*/5 * * * *`.
5. Habilite "Automatically expose System Environment Variables" se aplicável.
6. Salve e faça o primeiro deploy. Commits no `main`/`master` disparam deploy automático.

## Testes em Produção
- Live: acesse `/live` e verifique atualização a cada 5s e ausência de travamentos.
- Pré-Live: `/prelive` – valide ajuste de assertividade e valores.
- Times: `/teams` – informe `teamId`, `season`, `league` e confirme dados.
- Árbitros: `/refs` – selecione liga/season e revise lista.
- Rankings: `/ranking` – alterne Geral/Casa/Fora; marque “Usar times da liga” e pagine.
- Exporte CSV em rankings e abra em planilha.

## Validação de Fallback
- Remova temporariamente chaves no Vercel (Preview Env) e verifique:
  - Páginas exibem avisos de fallback e continuam funcionais.
  - Logs de erro aparecem em Serverless Functions sem quebrar a UX.

## Performance / Cache
- Redis (Upstash) cacheia:
  - Live: 15s
  - Team stats / players / referees: 15–60 min
  - Rankings: 5 min (liga) / 5 min (geral)
- Ajuste TTLs conforme limites de API.

## Escalabilidade
- Separar pipelines pesadas para cron serverless (pré-cálculo de rankings por liga/season) e servir em endpoints.
- Usar filas (Upstash QStash) para processamento assíncrono de enriquecimentos.
- Shardar por liga/season para paralelizar.
- Adicionar controles de taxa (rate limiting) por IP/rota.

## Solução de Problemas
- 429/Rate limit: aumente pageSize de rankings para reduzir chamadas; eleve TTLs.
- Supabase erros de permissão: confirme RLS desabilitado ou políticas corretas para tabelas `analises_ia` e `live_samples`.
- Falhas intermitentes de API: fallback é aplicado; verifique chaves, saldo e status da API.
- Edge/Região: selecione região próxima aos provedores (Vercel Settings → Regions) se necessário.

## Próximos Passos
- Pré-cálculo de rankings automáticos por liga/season em cron.
- Telemetria: adicionar logs estruturados e tracing (OpenTelemetry) nas rotas.
- IA avançada: substituir heurísticas por modelos ONNX/HF em edge quando possível.
