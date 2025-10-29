import { NextRequest, NextResponse } from 'next/server'
import { fetchReferees } from '@/lib/data/provider'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const league = Number(searchParams.get('league') || '71') // exemplo: Brasileirão A
  const season = Number(searchParams.get('season') || '2024')
  const data = await fetchReferees(league, season)
  return NextResponse.json({ ok: true, data })
}


