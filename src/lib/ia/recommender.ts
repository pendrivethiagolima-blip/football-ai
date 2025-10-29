type Recommendation = { message: string; type: 'info' | 'warning' | 'success' }

export async function generateRecommendations(liveFeatures: { pressure: number; favoriteLosing?: boolean }) {
  const recs: Recommendation[] = []
  if (liveFeatures.pressure > 75 && liveFeatures.favoriteLosing) {
    recs.push({ message: 'Alerta: favorito perdendo com alta pressão ofensiva. Oportunidade de virada.', type: 'warning' })
  }
  if (liveFeatures.pressure > 65) {
    recs.push({ message: 'Pressão em crescimento: probabilidade de gol nos próximos minutos.', type: 'info' })
  }
  if (recs.length === 0) recs.push({ message: 'Sem sinais fortes no momento. Aguarde melhor oportunidade.', type: 'info' })
  return recs
}


