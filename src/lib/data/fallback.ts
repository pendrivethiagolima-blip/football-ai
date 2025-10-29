// Fallbacks locais (mocks)
export const fallbackLive = () => ({
  pressure: Math.round(60 + Math.random() * 30),
  ts: Date.now(),
  samples: [
    { minute: 10, shots: 1, attacks: 6, dangerousAttacks: 3 },
    { minute: 12, shots: 2, attacks: 8, dangerousAttacks: 5 },
    { minute: 14, shots: 3, attacks: 11, dangerousAttacks: 7 }
  ]
})

export const fallbackTeamStats = (teamName: string) => ({
  teamName,
  last10: {
    wins: 6,
    draws: 2,
    losses: 2,
    goalsFor: 18,
    goalsAgainst: 9
  }
})

export const fallbackPlayers = (teamName: string) => ([
  { name: 'Jogador A', position: 'FW', goals: 9, assists: 4 },
  { name: 'Jogador B', position: 'MF', goals: 3, assists: 6 }
])

export const fallbackReferees = () => ([
  { name: 'Árbitro X', overCards: 0.6, league: 'BR1' },
  { name: 'Árbitro Y', overCards: 0.52, league: 'BR1' }
])


