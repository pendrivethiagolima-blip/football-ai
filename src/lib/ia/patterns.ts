export type LiveSample = { shots: number; attacks: number; dangerousAttacks: number; minute: number }

export function detectPressurePattern(samples: LiveSample[]) {
  if (samples.length < 3) return { intensity: 0, trend: 'flat' as const }
  const last = samples.slice(-3)
  const score = last.reduce((s, v, i) => s + (v.dangerousAttacks * 2 + v.attacks + v.shots * 3) * (i + 1), 0)
  const baseline = 10 * last.length
  const intensity = Math.max(0, Math.min(1, (score - baseline) / 100))
  const trend = intensity > 0.8 ? 'surge' : intensity > 0.6 ? 'up' : intensity < 0.3 ? 'down' : 'flat'
  return { intensity, trend }
}


