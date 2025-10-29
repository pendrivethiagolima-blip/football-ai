export function RankingTable({ title, rows, onExport }: { title: string; rows: { team: string; pct: number }[]; onExport?: () => void }) {
  return (
    <div className="rounded-lg bg-panel border border-border">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="font-medium">{title}</div>
        {onExport && <button className="text-xs px-2 py-1 border rounded hover:bg-slate-50" onClick={onExport}>Exportar CSV</button>}
      </div>
      <div className="divide-y">
        {rows.map((r, i) => (
          <div key={i} className="px-4 py-2 flex items-center justify-between text-sm">
            <span>{i+1}. {r.team}</span>
            <span className="font-medium">{Math.round(r.pct*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}


