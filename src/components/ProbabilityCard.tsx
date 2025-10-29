"use client"

export function ProbabilityCard({ title, value, confidence, tooltip }: { title: string; value: number; confidence?: number; tooltip?: string }) {
  const pct = Math.round(value * 100)
  const over = pct >= 80
  const conf = typeof confidence === 'number' ? Math.max(0, Math.min(1, confidence)) : undefined
  const confPct = conf !== undefined ? Math.round(conf * 100) : undefined
  const badgeColor = confPct === undefined ? 'bg-slate-300' : confPct >= 80 ? 'bg-emerald-600' : confPct >= 60 ? 'bg-amber-500' : 'bg-rose-600'
  const badgeEmoji = confPct === undefined ? '' : confPct >= 80 ? '🟢' : confPct >= 60 ? '🟡' : '🔴'
  const badgeTitle = tooltip || 'Confiança estimada baseada na consistência dos dados e distância do ponto neutro, ajustada pela meta de assertividade.'

  return (
    <div className={`rounded-lg border p-4 ${over ? 'border-emerald-300 bg-emerald-50' : 'border-border bg-panel'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-600">{title}</span>
        <div className="flex items-center gap-2">
          {confPct !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-700" title={badgeTitle} aria-label={badgeTitle}>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${badgeColor}`} />
              <span>{badgeEmoji} {confPct}%</span>
            </span>
          )}
          <span className={`text-sm ${over ? 'text-emerald-700' : 'text-slate-700'}`}>{pct}%</span>
        </div>
      </div>
      <div className="h-2 rounded bg-slate-200 overflow-hidden">
        <div className={`h-full ${over ? 'bg-emerald-600' : 'bg-slate-700'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}


