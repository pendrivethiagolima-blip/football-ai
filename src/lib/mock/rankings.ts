function genTeams(prefix: string, n: number) {
  return Array.from({ length: n }).map((_, i) => `${prefix} ${i + 1}`)
}

const teamsCorners = genTeams('Time', 50).map((t, i) => ({ team: t, pct: Math.max(0.5, 0.95 - i * 0.007) }))
const teamsGoalsHT = genTeams('Clube', 50).map((t, i) => ({ team: t, pct: Math.max(0.48, 0.93 - i * 0.007) }))

export const mockCornersOver = {
  all: teamsCorners,
  home: teamsCorners.map((t, i) => ({ ...t, pct: Math.min(0.99, t.pct + 0.03) })),
  away: teamsCorners.map((t, i) => ({ ...t, pct: Math.max(0.5, t.pct - 0.03) }))
}

export const mockGoalsHTOver = {
  all: teamsGoalsHT,
  home: teamsGoalsHT.map((t, i) => ({ ...t, pct: Math.min(0.99, t.pct + 0.025) })),
  away: teamsGoalsHT.map((t, i) => ({ ...t, pct: Math.max(0.48, t.pct - 0.025) }))
}


