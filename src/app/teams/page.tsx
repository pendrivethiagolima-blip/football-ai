"use client"
import { useEffect, useMemo, useState } from 'react'
import { TeamSearch } from '@/components/TeamSearch'
import { StatTable } from '@/components/StatTable'
import { mockTeams, mockTeamStatsLast10 } from '@/lib/mock/teams'

export default function TeamsPage() {
  const [team, setTeam] = useState<string>('Flamengo')
  const [teamId, setTeamId] = useState<string>('33')
  const [season, setSeason] = useState<string>('2024')
  const [league, setLeague] = useState<string>('71')
  const [realStats, setRealStats] = useState<any | null>(null)
  const [players, setPlayers] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const stats = useMemo(() => mockTeamStatsLast10[team as keyof typeof mockTeamStatsLast10], [team])

  useEffect(() => {
    let cancel = false
    const load = async () => {
      try {
        setError(null)
        const [tRes, pRes] = await Promise.all([
          fetch(`/api/team?teamId=${teamId}&season=${season}&league=${league}`),
          fetch(`/api/player?teamId=${teamId}&season=${season}`)
        ])
        const tJson = await tRes.json()
        const pJson = await pRes.json()
        if (!cancel) {
          setRealStats(tJson?.data ?? null)
          setPlayers(pJson?.data?.data ?? pJson?.data ?? null)
        }
      } catch (e) {
        if (!cancel) setError('Falha ao carregar dados reais. Exibindo fallback.')
      }
    }
    load()
    return () => { cancel = true }
  }, [teamId, season, league])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <h2 className="text-xl font-semibold">Análise por Time</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="rounded-lg bg-panel border border-border p-4">
            <h3 className="font-medium mb-3">Buscar time</h3>
            <TeamSearch teams={mockTeams} onSelect={setTeam} />
            <div className="text-sm text-slate-600 mt-3">Time selecionado: <span className="font-medium">{team}</span></div>
            <div className="grid gap-2 mt-4">
              <input className="border border-border rounded px-3 py-2" value={teamId} onChange={(e)=>setTeamId(e.target.value)} placeholder="Team ID (API-Football/FD)" />
              <div className="grid grid-cols-2 gap-2">
                <input className="border border-border rounded px-3 py-2" value={season} onChange={(e)=>setSeason(e.target.value)} placeholder="Season (ex: 2024)" />
                <input className="border border-border rounded px-3 py-2" value={league} onChange={(e)=>setLeague(e.target.value)} placeholder="League (ex: 71)" />
              </div>
              {error && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">{error}</div>}
            </div>
          </section>
          <section className="lg:col-span-2 grid md:grid-cols-2 gap-4">
            <StatTable title="Mais desarmes (10 jogos)" rows={(stats?.tackles ?? []).map(i=>({ label: i.player, value: i.value }))} />
            <StatTable title="Mais faltas (10 jogos)" rows={(stats?.fouls ?? []).map(i=>({ label: i.player, value: i.value }))} />
            <StatTable title="Mais chutes a gol" rows={(stats?.shotsOnTarget ?? []).map(i=>({ label: i.player, value: i.value }))} />
            <StatTable title="Mais finalizações" rows={(stats?.shotsTotal ?? []).map(i=>({ label: i.player, value: i.value }))} />
            <StatTable title="Mais sofre faltas" rows={(stats?.fouled ?? []).map(i=>({ label: i.player, value: i.value }))} />
            <StatTable title="Mais gols" rows={(stats?.goals ?? []).map(i=>({ label: i.player, value: i.value }))} />
            {realStats && (
              <StatTable title="Resumo real (últimos 10)" rows={[
                { label: 'Fonte', value: String(realStats?.source ?? '') },
                { label: 'Wins', value: realStats?.data?.form?.wins ?? realStats?.data?.last10?.wins ?? '-' },
                { label: 'Goals For', value: realStats?.data?.form?.goalsFor ?? realStats?.data?.last10?.goalsFor ?? '-' },
                { label: 'Goals Against', value: realStats?.data?.form?.goalsAgainst ?? realStats?.data?.last10?.goalsAgainst ?? '-' }
              ]} />
            )}
            {players && (
              <StatTable title="Jogadores (fonte real)" rows={players.slice(0,10).map((p:any)=>({ label: p?.name || p?.player?.name || 'Jogador', value: p?.position || p?.player?.position || '-' }))} />
            )}
          </section>
        </div>
      </div>
    </main>
  )
}


