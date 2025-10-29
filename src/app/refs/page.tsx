"use client"
import { useEffect, useState } from 'react'
import { StatTable } from '@/components/StatTable'

export default function RefsPage() {
  const [league, setLeague] = useState('71')
  const [season, setSeason] = useState('2024')
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    const load = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/referee?league=${league}&season=${season}`)
        const json = await res.json()
        if (!cancel) setData(json?.data)
      } catch (e) {
        if (!cancel) setError('Falha ao carregar árbitros. Exibindo fallback.')
      }
    }
    load()
    return () => { cancel = true }
  }, [league, season])

  const rows = (data?.data?.response || data?.data || []).slice(0, 12).map((r: any) => ({
    label: r?.name || r?.referee?.name || 'Árbitro',
   value: (r?.overCards ?? r?.league) || '-'
  }))

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Árbitros</h2>
          <div className="flex gap-2">
            <input className="border border-border rounded px-3 py-2" value={season} onChange={(e)=>setSeason(e.target.value)} placeholder="Season" />
            <input className="border border-border rounded px-3 py-2" value={league} onChange={(e)=>setLeague(e.target.value)} placeholder="League" />
          </div>
        </div>
        {error && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">{error}</div>}
        <StatTable title="Lista (12)" rows={rows} />
      </div>
    </main>
  )
}



