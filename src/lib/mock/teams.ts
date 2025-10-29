export const mockTeams = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Botafogo', 'Grêmio', 'Internacional', 'Fluminense', 'Vasco', 'Santos'
]

export const mockTeamStatsLast10 = {
  Flamengo: {
    tackles: [{ player: 'Ayrton', value: 28 }, { player: 'Pulgar', value: 24 }],
    fouls: [{ player: 'Gerson', value: 19 }, { player: 'Luiz Araújo', value: 15 }],
    shotsOnTarget: [{ player: 'Pedro', value: 21 }, { player: 'Bruno Henrique', value: 17 }],
    shotsTotal: [{ player: 'Pedro', value: 39 }, { player: 'Arrascaeta', value: 26 }],
    fouled: [{ player: 'Arrascaeta', value: 22 }, { player: 'Bruno Henrique', value: 20 }],
    goals: [{ player: 'Pedro', value: 9 }, { player: 'Bruno Henrique', value: 5 }]
  }
} as const


