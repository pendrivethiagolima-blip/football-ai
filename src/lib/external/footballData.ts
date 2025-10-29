import axios from 'axios'

const API_BASE = 'https://api.football-data.org/v4'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_KEY || ''
  }
})

export async function fdGetMatchesLive() {
  const { data } = await api.get('/matches', { params: { status: 'LIVE' } })
  return data
}

export async function fdGetTeam(teamId: number) {
  const { data } = await api.get(`/teams/${teamId}`)
  return data
}

export async function fdGetTeamMatches(teamId: number, status: string = 'FINISHED') {
  const { data } = await api.get(`/teams/${teamId}/matches`, { params: { status } })
  return data
}

export async function fdGetCompetitions() {
  const { data } = await api.get('/competitions')
  return data
}


