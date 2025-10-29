Endpoints de cron:

- GET /api/cron/update — Reprocessa dados e grava previsões no Supabase.

No Vercel, crie um Cron Job apontando para este endpoint, por exemplo: */5 * * * *


