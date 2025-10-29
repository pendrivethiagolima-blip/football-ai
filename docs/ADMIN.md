# Administração e Manutenção – Football-IA

## Parâmetros de Performance
- TTLs de cache (ajuste em Vercel → Env):
  - `CACHE_TTL_LIVE` (default 15s)
  - `CACHE_TTL_TEAM` (default 1800s)
  - `CACHE_TTL_PLAYERS` (default 1800s)
  - `CACHE_TTL_REFEREES` (default 1800s)
  - `CACHE_TTL_RANKING` (default 300s)

## Monitoramento
- Health endpoint: `GET /api/health` (valida Redis, Supabase e presença de chaves). Define `WEBHOOK_URL` para alertas (Slack/Discord/etc.).
- Logs: Vercel → Deployments → View Functions Logs.
- Health script local: `.\u200bhealthcheck.ps1 -Domain https://SEU_DOMINIO`

## Backup e Segurança
- Supabase:
  - Ative backups automáticos (plano) ou exporte periodicamente as tabelas `analises_ia` e `live_samples` via SQL.
  - Restrinja chaves: use `NEXT_PUBLIC_SUPABASE_ANON_KEY` apenas no cliente; mantenha `SUPABASE_SERVICE_ROLE_KEY` fora do cliente (não exposto).
- Upstash Redis:
  - Rotacione `UPSTASH_REDIS_REST_TOKEN` periodicamente.
- Chaves de API:
  - Rotacione `API_FOOTBALL_KEY` e `FOOTBALL_DATA_KEY` conforme política do provedor.

## Recuperação de Desastres
- Infra-as-code: mantenha `.env.example` (valores vazios) e docs deste diretório.
- Processo:
  1) Restaurar variáveis no Vercel e Supabase.
  2) Reaplicar `supabase/schema.sql` se necessário.
  3) Redeploy `vercel --prod`.

## Escalabilidade
- Cron para pré-cálculo de rankings por liga/season.
- Filas assíncronas (Upstash QStash) para enriquecimentos pesados.
- Reduzir taxa de chamadas em horários de pico (aumentar TTLs via env sem redeploy).
- Sharding por liga/season para rodar em paralelo.

## Manutenção de Rotas
- `/api/live`: TTL curto; grava amostras no Supabase (best-effort).
- `/api/analysis`: enriquece matchData com stats se IDs fornecidos.
- `/api/team`, `/api/player`, `/api/referee`: cache médio e fallback.
- `/api/ranking` e `/api/ranking/league`: cache 5 min; paginação na rota de liga.
