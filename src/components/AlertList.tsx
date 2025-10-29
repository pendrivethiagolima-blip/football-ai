export function AlertList({ alerts }: { alerts: { message: string; type: 'info' | 'warning' | 'success' }[] }) {
  return (
    <div className="grid gap-2">
      {alerts.map((a, i) => (
        <div key={i} className={`rounded-md border p-3 text-sm ${a.type==='warning'?'bg-amber-50 border-amber-200': a.type==='success'?'bg-emerald-50 border-emerald-200':'bg-slate-50 border-slate-200'}`}>{a.message}</div>
      ))}
    </div>
  )
}


