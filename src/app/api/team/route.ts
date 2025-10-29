import { NextRequest, NextResponse } from 'next/server'
import { fetchTeamStats } from '@/lib/data/provider'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const teamId = Number(searchParams.get('teamId'))
  const season = Number(searchParams.get('season') || '2024')
  const league = searchParams.get('league') ? Number(searchParams.get('league')) : undefined
  if (!teamId) return NextResponse.json({ ok: false, error: 'teamId required' }, { status: 400 })
  const data = await fetchTeamStats(teamId, season, league)
  return NextResponse.json({ ok: true, data })
}


