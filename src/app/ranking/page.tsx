"use client"
import { useEffect, useMemo, useState } from 'react'
import { RankingTable } from '@/components/RankingTable'
import { mockCornersOver, mockGoalsHTOver } from '@/lib/mock/rankings'
import { toCSV, downloadCSV } from '@/lib/utils/csv'

export default function RankingPage() {
  const [scope, setScope] = useState<'all'|'home'|'away'>('all')
  const [league, setLeague] = useState<string>('71')
  const [season, setSeason] = useState<string>('2024')
  const [corners, setCorners] = useState<{ team: string; pct: number }[]>([])
  const [goalsHT, setGoalsHT] = useState<{ team: string; pct: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [useLeagueTeams, setUseLeagueTeams] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    let cancel = false
    const load = async () => {
      try {
        setError(null)
        const url = useLeagueTeams
          ? `/api/ranking/league?scope=${scope}&league=${league}&season=${season}&page=${page}&pageSize=${pageSize}`
          : `/api/ranking?scope=${scope}&league=${league}&season=${season}`
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()
        if (!cancel) {
          setCorners(json?.corners ?? mockCornersOver[scope].slice(0,50))
          setGoalsHT(json?.goalsHT ?? mockGoalsHTOver[scope].slice(0,50))
          setTotal(json?.total ?? (useLeagueTeams ? 0 : 50))
        }
      } catch (e) {
        if (!cancel) {
          setCorners(mockCornersOver[scope].slice(0,50))
          setGoalsHT(mockGoalsHTOver[scope].slice(0,50))
          setError('Falha ao carregar rankings. Exibindo fallback.')
        }
      }
    }
    load()
  }, [scope, league, season, useLeagueTeams, page, pageSize])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ranking Global</h2>
          <div className="flex gap-2">
            {(['all','home','away'] as const).map((s)=> (
              <button key={s} className={`px-3 py-2 rounded border ${scope===s?'bg-black text-white border-black':'border-border'}`} onClick={()=>setScope(s)}>
                {s==='all'?'Geral': s==='home'?'Casa':'Fora'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <input className="border border-border rounded px-3 py-2" value={season} onChange={(e)=>setSeason(e.target.value)} placeholder="Season (ex: 2024)" />
          <input className="border border-border rounded px-3 py-2" value={league} onChange={(e)=>setLeague(e.target.value)} placeholder="League (ex: 71)" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useLeagueTeams} onChange={(e)=>{ setUseLeagueTeams(e.target.checked); setPage(1) }} /> Usar times da liga
          </label>
          {useLeagueTeams && (
            <>
              <select className="border border-border rounded px-2 py-2" value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1) }}>
                {[10,20,30,50].map(s=> <option key={s} value={s}>{s}/página</option>)}
              </select>
              <div className="text-xs text-slate-600">Total: {total}</div>
            </>
          )}
        </div>
        {error && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">{error}</div>}
        <div className="grid lg:grid-cols-2 gap-6">
          <RankingTable title="Top 50 - Over Escanteios" rows={corners} onExport={() => {
            const csv = toCSV(corners.map((r, i) => ({ rank: i + 1, team: r.team, pct: Math.round(r.pct*100) + '%', scope, league, season })))
            downloadCSV(`ranking_escanteios_${scope}_${league}_${season}.csv`, csv)
          }} />
          <RankingTable title="Top 50 - Over Gols 1º Tempo" rows={goalsHT} onExport={() => {
            const csv = toCSV(goalsHT.map((r, i) => ({ rank: i + 1, team: r.team, pct: Math.round(r.pct*100) + '%', scope, league, season })))
            downloadCSV(`ranking_golsHT_${scope}_${league}_${season}.csv`, csv)
          }} />
        </div>
        {useLeagueTeams && (
          <div className="flex items-center justify-end gap-2">
            <button className="px-3 py-2 border rounded" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1, p-1))}>Anterior</button>
            <span className="text-sm">Página {page}</span>
            <button className="px-3 py-2 border rounded" disabled={page*pageSize>=total} onClick={()=>setPage((p)=>p+1)}>Próxima</button>
          </div>
        )}
      </div>
    </main>
  )
}


