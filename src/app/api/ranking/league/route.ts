import { NextRequest, NextResponse } from 'next/server'
import { cacheGet, cacheSet } from '@/lib/cache/redis'
import { fetchTeamStats, fetchTeamsByLeagueCached } from '@/lib/data/provider'
import { mockCornersOver, mockGoalsHTOver } from '@/lib/mock/rankings'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scope = (searchParams.get('scope') as 'all'|'home'|'away') || 'all'
  const league = Number(searchParams.get('league') || '71')
  const season = Number(searchParams.get('season') || '2024')
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Math.min(50, Math.max(5, Number(searchParams.get('pageSize') || '10')))
  const cacheKey = `ranking:league:${league}:${season}:${scope}:p${page}:s${pageSize}`

  const cached = await cacheGet<any>(cacheKey)
  if (cached) return NextResponse.json({ ok: true, source: 'cache', ...cached })

  try {
    const teamsRes = await fetchTeamsByLeagueCached(league, season)
    const list = (teamsRes?.teams ?? []) as { id: number; name: string }[]
    const start = (page - 1) * pageSize
    const slice = list.slice(start, start + pageSize)
    const baseCorners = mockCornersOver[scope].slice(0, slice.length)
    const baseGoalsHT = mockGoalsHTOver[scope].slice(0, slice.length)

    const stats = await Promise.all(
      slice.map((t) => fetchTeamStats(t.id, season, league).catch(() => null))
    )

    const adjustBy = (base: number, wins?: number, goalsFor?: number) => {
      const w = typeof wins === 'number' ? wins : 5
      const gf = typeof goalsFor === 'number' ? goalsFor : 10
      return Math.max(0.45, Math.min(0.99, base + (w * 0.002) + (gf * 0.001)))
    }

    const corners = baseCorners.map((row, i) => {
      const st = (stats[i] as any)?.data
      const wins = st?.form?.wins ?? st?.last10?.wins
      const gf = st?.form?.goalsFor ?? st?.last10?.goalsFor
      return { team: slice[i]?.name ?? row.team, pct: adjustBy(row.pct, wins, gf) }
    })
    const goalsHT = baseGoalsHT.map((row, i) => {
      const st = (stats[i] as any)?.data
      const wins = st?.form?.wins ?? st?.last10?.wins
      const gf = st?.form?.goalsFor ?? st?.last10?.goalsFor
      return { team: slice[i]?.name ?? row.team, pct: adjustBy(row.pct, wins, gf) }
    })

    const payload = { source: 'mixed', corners, goalsHT, page, pageSize, total: list.length }
    await cacheSet(cacheKey, payload, 300)
    return NextResponse.json({ ok: true, ...payload })
  } catch (e) {
    const payload = { source: 'fallback', corners: mockCornersOver[scope].slice(0, pageSize), goalsHT: mockGoalsHTOver[scope].slice(0, pageSize), page, pageSize, total: 50 }
    await cacheSet(cacheKey, payload, 120)
    return NextResponse.json({ ok: true, ...payload })
  }
}


