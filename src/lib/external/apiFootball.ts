import axios from 'axios'

const API_BASE = 'https://v3.football.api-sports.io'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY || ''
  }
})

export async function getLiveFixtures() {
  const { data } = await api.get('/fixtures', { params: { live: 'all' } })
  return data
}

export async function getTeamStats(teamId: number, season: number, league?: number) {
  const { data } = await api.get('/teams/statistics', { params: { team: teamId, season, league } })
  return data
}

export async function getPlayersByTeam(teamId: number, season: number) {
  const { data } = await api.get('/players', { params: { team: teamId, season } })
  return data
}

export async function getRefereesByLeague(league: number, season: number) {
  const { data } = await api.get('/referees', { params: { league, season } })
  return data
}

export async function getTeamsByLeagueSeason(league: number, season: number) {
  const { data } = await api.get('/teams', { params: { league, season } })
  return data
}


