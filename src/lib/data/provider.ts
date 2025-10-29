import { cacheGet, cacheSet } from '@/lib/cache/redis'
import { getLiveFixtures, getTeamStats, getPlayersByTeam, getRefereesByLeague, getTeamsByLeagueSeason } from '@/lib/external/apiFootball'
import { fdGetMatchesLive, fdGetTeam, fdGetTeamMatches } from '@/lib/external/footballData'
import { fallbackLive, fallbackPlayers, fallbackReferees, fallbackTeamStats } from '@/lib/data/fallback'

// TTLs configuráveis por env com defaults seguros para free tier
const TTL = {
  live: Number(process.env.CACHE_TTL_LIVE ?? 15),
  team: Number(process.env.CACHE_TTL_TEAM ?? 1800),
  players: Number(process.env.CACHE_TTL_PLAYERS ?? 1800),
  referees: Number(process.env.CACHE_TTL_REFEREES ?? 1800),
  ranking: Number(process.env.CACHE_TTL_RANKING ?? 300),
  fallbackShort: 120
}

// 1) Dados ao vivo (prioridade)
export async function fetchLiveDataCached() {
  const key = 'live:data:v1'
  const cached = await cacheGet<any>(key)
  if (cached) return cached
  try {
    const a = await getLiveFixtures()
    const payload = { source: 'api-football', fixtures: a }
    await cacheSet(key, payload, TTL.live)
    return payload
  } catch {}
  try {
    const b = await fdGetMatchesLive()
    const payload = { source: 'football-data', matches: b }
    await cacheSet(key, payload, TTL.live)
    return payload
  } catch {}
  const fb = { source: 'fallback', ...fallbackLive() }
  await cacheSet(key, fb, Math.min(60, TTL.live))
  return fb
}

// 2) Estatísticas de times
export async function fetchTeamStats(teamId: number, season: number, league?: number) {
  const key = `team:stats:${teamId}:${season}:${league ?? 'all'}`
  const cached = await cacheGet<any>(key)
  if (cached) return cached
  try {
    const a = await getTeamStats(teamId, season, league)
    await cacheSet(key, { source: 'api-football', data: a }, TTL.team)
    return { source: 'api-football', data: a }
  } catch {}
  try {
    const t = await fdGetTeam(teamId)
    const m = await fdGetTeamMatches(teamId, 'FINISHED')
    const data = { team: t, matches: m }
    await cacheSet(key, { source: 'football-data', data }, TTL.team)
    return { source: 'football-data', data }
  } catch {}
  const fb = { source: 'fallback', data: fallbackTeamStats(String(teamId)) }
  await cacheSet(key, fb, TTL.fallbackShort)
  return fb
}

// 3) Histórico de jogadores
export async function fetchPlayersByTeam(teamId: number, season: number) {
  const key = `team:players:${teamId}:${season}`
  const cached = await cacheGet<any>(key)
  if (cached) return cached
  try {
    const a = await getPlayersByTeam(teamId, season)
    await cacheSet(key, { source: 'api-football', data: a }, TTL.players)
    return { source: 'api-football', data: a }
  } catch {}
  try {
    const t = await fdGetTeam(teamId)
    await cacheSet(key, { source: 'football-data', data: t?.squad ?? [] }, TTL.players)
    return { source: 'football-data', data: t?.squad ?? [] }
  } catch {}
  const fb = { source: 'fallback', data: fallbackPlayers(String(teamId)) }
  await cacheSet(key, fb, TTL.fallbackShort)
  return fb
}

// 4) Dados de árbitros (ex.: por liga/temporada)
export async function fetchReferees(league: number, season: number) {
  const key = `referees:${league}:${season}`
  const cached = await cacheGet<any>(key)
  if (cached) return cached
  try {
    const a = await getRefereesByLeague(league, season)
    await cacheSet(key, { source: 'api-football', data: a }, TTL.referees)
    return { source: 'api-football', data: a }
  } catch {}
  const fb = { source: 'fallback', data: fallbackReferees() }
  await cacheSet(key, fb, TTL.fallbackShort)
  return fb
}

// Lista de times por liga/temporada (com cache)
export async function fetchTeamsByLeagueCached(league: number, season: number) {
  const key = `league:teams:${league}:${season}`
  const cached = await cacheGet<any>(key)
  if (cached) return cached
  try {
    const a = await getTeamsByLeagueSeason(league, season)
    const teams = a?.response?.map((t: any) => ({ id: t?.team?.id, name: t?.team?.name }))?.filter((t: any) => t?.id)
    const payload = { source: 'api-football', teams }
    await cacheSet(key, payload, TTL.team)
    return payload
  } catch {}
  const fb = { source: 'fallback', teams: [] as { id: number; name: string }[] }
  await cacheSet(key, fb, TTL.fallbackShort)
  return fb
}


