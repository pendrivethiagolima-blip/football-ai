import { NextRequest, NextResponse } from 'next/server'
import { cacheGet, cacheSet } from '@/lib/cache/redis'
import { mockCornersOver, mockGoalsHTOver } from '@/lib/mock/rankings'
import { fetchTeamStats } from '@/lib/data/provider'

// Esta rota agrega rankings. Estratégia:
// - Se query "teams" (ids) for passada, tenta enriquecer porcentagens a partir de stats reais desses times
// - Caso contrário, retorna fallback mockado, ajustado pelo escopo (all/home/away)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scope = (searchParams.get('scope') as 'all'|'home'|'away') || 'all'
  const league = searchParams.get('league') || '71'
  const season = Number(searchParams.get('season') || '2024')
  const teamsParam = searchParams.get('teams') // ex: "33,34,39"
  const cacheKey = `ranking:${scope}:${league}:${season}:${teamsParam || 'auto'}`

  const cached = await cacheGet<any>(cacheKey)
  if (cached) return NextResponse.json({ ok: true, source: 'cache', ...cached })

  try {
    let corners = mockCornersOver[scope].slice(0, 50)
    let goalsHT = mockGoalsHTOver[scope].slice(0, 50)

    // Se tivermos uma lista de teams, tenta enriquecer percentuais
    if (teamsParam) {
      const teamIds = teamsParam.split(',').map((s) => Number(s.trim())).filter(Boolean).slice(0, 20)
      if (teamIds.length > 0) {
        const stats = await Promise.all(
          teamIds.map((id) =>
            fetchTeamStats(id, season, Number(league)).catch(() => null)
          )
        )

        // Ajuste simples: aplica deltas nos percentuais base conforme wins/goals
        const adjustBy = (base: number, wins?: number, goalsFor?: number) => {
          const w = typeof wins === 'number' ? wins : 5
          const gf = typeof goalsFor === 'number' ? goalsFor : 10
          return Math.max(0.45, Math.min(0.99, base + (w * 0.002) + (gf * 0.001)))
        }

        corners = corners.map((row, i) => {
          const st = stats[i]?.data
          const wins = st?.form?.wins ?? st?.last10?.wins
          const gf = st?.form?.goalsFor ?? st?.last10?.goalsFor
          return { ...row, pct: adjustBy(row.pct, wins, gf) }
        })
        goalsHT = goalsHT.map((row, i) => {
          const st = stats[i]?.data
          const wins = st?.form?.wins ?? st?.last10?.wins
          const gf = st?.form?.goalsFor ?? st?.last10?.goalsFor
          return { ...row, pct: adjustBy(row.pct, wins, gf) }
        })
      }
    }

    const payload = { source: teamsParam ? 'mixed' : 'fallback', corners, goalsHT }
    await cacheSet(cacheKey, payload, 300)
    return NextResponse.json({ ok: true, ...payload })
  } catch (e: any) {
    // fallback final
    const payload = { source: 'fallback', corners: mockCornersOver[scope].slice(0, 50), goalsHT: mockGoalsHTOver[scope].slice(0, 50) }
    await cacheSet(cacheKey, payload, 120)
    return NextResponse.json({ ok: true, ...payload })
  }
}


