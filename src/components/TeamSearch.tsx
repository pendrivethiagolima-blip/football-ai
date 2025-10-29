"use client"
import { useEffect, useMemo, useState } from 'react'

export function TeamSearch({ teams, onSelect }: { teams: string[]; onSelect: (team: string) => void }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => teams.filter(t => t.toLowerCase().includes(q.toLowerCase())).slice(0, 10), [q, teams])
  useEffect(() => {
    if (filtered[0]) onSelect(filtered[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="grid gap-2">
      <input className="border border-border rounded px-3 py-2" placeholder="Buscar time" value={q} onChange={(e)=>setQ(e.target.value)} />
      <div className="grid gap-1">
        {filtered.map((t) => (
          <button key={t} className="text-left px-3 py-2 rounded border border-border hover:bg-slate-50" onClick={()=>onSelect(t)}>
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}


