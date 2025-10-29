import { z } from 'zod'

const MatchDataSchema = z.object({
  homeStrength: z.number().min(0).max(1),
  awayStrength: z.number().min(0).max(1),
  pace: z.number().min(0).max(1),
  aggression: z.number().min(0).max(1),
  recentForm: z.number().min(0).max(1)
})

export type MatchData = z.infer<typeof MatchDataSchema>

export async function predictMatchProbabilities(matchData: MatchData, targetAccuracy: number) {
  const data = MatchDataSchema.parse(matchData)

  // Heurística inicial (placeholder) até carregar modelos reais
  const baseGoalProb = 0.5 * data.pace + 0.3 * data.homeStrength + 0.2 * data.awayStrength
  const baseCardsProb = 0.6 * data.aggression + 0.4 * data.pace
  const baseCornersProb = 0.5 * data.pace + 0.5 * data.recentForm

  const adjust = (p: number) => Math.min(0.99, Math.max(0.01, p * (targetAccuracy / 80)))

  const goalHT = adjust(baseGoalProb)
  const cornersHT = adjust(baseCornersProb)
  const cardsHT = adjust(baseCardsProb)
  const underHT = adjust(1 - Math.max(baseGoalProb, baseCardsProb * 0.5))

  // Confidence score (0-1): mais alto quando entradas são consistentes e longe de 0.5 após ajuste
  const inputs = [data.homeStrength, data.awayStrength, data.pace, data.aggression, data.recentForm]
  const inputConsistency = 1 - (inputs.reduce((s, v) => s + Math.abs(0.5 - v), 0) / inputs.length) // 0..1
  const spread = [goalHT, cornersHT, cardsHT, underHT].reduce((s, v) => s + Math.abs(0.5 - v), 0) / 4
  const targetFactor = Math.min(1, Math.max(0.5, targetAccuracy / 100))
  const confidence = Math.max(0.1, Math.min(0.99, 0.5 * inputConsistency + 0.5 * spread)) * targetFactor

  return { goalHT, cornersHT, cardsHT, underHT, confidence }
}


