import { NextRequest, NextResponse } from 'next/server'
import { fetchPlayersByTeam } from '@/lib/data/provider'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const teamId = Number(searchParams.get('teamId'))
  const season = Number(searchParams.get('season') || '2024')
  if (!teamId) return NextResponse.json({ ok: false, error: 'teamId required' }, { status: 400 })
  const data = await fetchPlayersByTeam(teamId, season)
  return NextResponse.json({ ok: true, data })
}


