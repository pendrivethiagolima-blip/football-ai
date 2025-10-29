import { upsertAnalysis } from '@/lib/db/supabase'
import { predictMatchProbabilities } from '@/lib/ia/predictor'

export async function refreshLiveAndPrelivePipelines() {
  // Placeholder: coletar dados de fontes free (mock)
  const matches = [
    { id: 'match-1', data: { homeStrength: 0.7, awayStrength: 0.5, pace: 0.8, aggression: 0.6, recentForm: 0.7 } },
    { id: 'match-2', data: { homeStrength: 0.4, awayStrength: 0.6, pace: 0.5, aggression: 0.4, recentForm: 0.5 } }
  ] as const

  for (const m of matches) {
    const result = await predictMatchProbabilities(m.data as any, 80)
    await upsertAnalysis({ jogo_id: m.id, previsao_ia: result, accuracy: 0.82 })
  }
}


