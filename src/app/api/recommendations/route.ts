import { NextRequest, NextResponse } from 'next/server'
import { generateRecommendations } from '@/lib/ia/recommender'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const recs = await generateRecommendations({ pressure: body?.pressure ?? 50, favoriteLosing: body?.favoriteLosing ?? false })
  return NextResponse.json({ ok: true, recs })
}


