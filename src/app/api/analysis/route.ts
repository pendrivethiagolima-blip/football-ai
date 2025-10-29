import { NextRequest, NextResponse } from 'next/server'
import { predictMatchProbabilities } from '@/lib/ia/predictor'
import { fetchTeamStats } from '@/lib/data/provider'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { matchData, targetAccuracy = 80, homeTeamId, awayTeamId, season = 2024, league } = body ?? {}

    // opcional: enriquecer matchData com stats reais se tiver IDs
    let enriched = matchData
    if (homeTeamId && awayTeamId) {
      try {
        const [home, away] = await Promise.all([
          fetchTeamStats(Number(homeTeamId), Number(season), league ? Number(league) : undefined),
          fetchTeamStats(Number(awayTeamId), Number(season), league ? Number(league) : undefined)
        ])
        // Ajuste simples de forças baseado em vitórias/GP (fallback friendly)
        const hv = home?.data?.form?.wins ?? home?.data?.last10?.wins ?? 5
        const av = away?.data?.form?.wins ?? away?.data?.last10?.wins ?? 5
        enriched = {
          ...matchData,
          homeStrength: Math.min(1, (matchData?.homeStrength ?? 0.6) * (1 + hv / 20)),
          awayStrength: Math.min(1, (matchData?.awayStrength ?? 0.5) * (1 + av / 20))
        }
      } catch {}
    }

    const result = await predictMatchProbabilities(enriched, targetAccuracy)
    return NextResponse.json({ ok: true, result, confidence: result.confidence })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'error' }, { status: 400 })
  }
}


