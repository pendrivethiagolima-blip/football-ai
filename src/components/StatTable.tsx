export function StatTable({ title, rows }: { title: string; rows: { label: string; value: number | string }[] }) {
  return (
    <div className="rounded-lg bg-panel border border-border">
      <div className="px-4 py-3 font-medium border-b">{title}</div>
      <div className="divide-y">
        {rows.map((r, i) => (
          <div key={i} className="px-4 py-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">{r.label}</span>
            <span className="font-medium">{typeof r.value === 'number' ? r.value : r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


