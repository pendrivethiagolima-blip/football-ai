# Football-IA – Guia Rápido

## Variáveis de Ambiente (.env.local)

- API_FOOTBALL_KEY: API-FOOTBALL (api-sports.io)
- FOOTBALL_DATA_KEY: football-data.org
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

## Como obter as chaves
- API-FOOTBALL: crie conta em api-sports.io, gere uma API key e copie para `API_FOOTBALL_KEY`.
- football-data.org: crie conta, gere token e copie para `FOOTBALL_DATA_KEY`.
- Supabase: crie projeto, copie URL e anon key para as variáveis correspondentes.
- Upstash Redis: crie database (REST), copie URL e TOKEN.

## Desenvolvimento

- Instalação: `npm install`
- Rodar: `npm run dev`

## Deploy (Vercel)
1. Importe o projeto no Vercel.
2. Adicione as mesmas variáveis de ambiente no Project Settings → Environment Variables.
3. Configure Cron Job para `/api/cron/update` (*/5 * * * *).
4. Deploy.

## Uso básico (URLs)
- Dashboard: `/dashboard`
- Pré-Live: `/prelive`
- Live: `/live`
- Times: `/teams`
- Rankings: `/ranking`
- Árbitros: `/refs`

## Troubleshooting
- Sem dados reais aparecendo:
  - Verifique se as chaves de API foram colocadas no ambiente do Vercel.
  - Tente reduzir a frequência das chamadas se houver rate limit.
- Erros na live:
  - A página `/live` continuará com fallback e o servidor registra `console.error` sem quebrar a UX.
- Supabase não registra:
  - Confirme schema aplicado (`supabase/schema.sql`), especialmente tabelas `analises_ia` e `live_samples`.
- Redis (Upstash) indisponível:
  - A aplicação funciona sem cache (somente perde performance e aumenta chamadas).

## Exportação CSV
- Na página `/ranking`, use o botão "Exportar CSV" em cada ranking para baixar o arquivo com colunas: rank, team, pct, scope, league, season.
