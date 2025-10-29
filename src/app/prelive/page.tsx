"use client"
import { useMemo, useState } from 'react'
import { ProbabilityCard } from '@/components/ProbabilityCard'

export default function PreLivePage() {
  const [accuracy, setAccuracy] = useState<number>(80)

  // Dados mockados e ajustados
  const { goalHT, cornersHT, cardsHT, underHT, confidence } = useMemo(() => {
    const base = { goalHT: 0.72, cornersHT: 0.68, cardsHT: 0.64, underHT: 0.38 }
    const adj = (p: number) => Math.min(0.99, Math.max(0.01, p * (accuracy / 80)))
    const goal = adj(base.goalHT)
    const corn = adj(base.cornersHT)
    const card = adj(base.cardsHT)
    const und = adj(base.underHT)
    // Confiança local (consistente com servidor): distância do 0.5 + meta de assertividade
    const spread = (Math.abs(0.5 - goal) + Math.abs(0.5 - corn) + Math.abs(0.5 - card) + Math.abs(0.5 - und)) / 4
    const conf = Math.max(0.1, Math.min(0.99, 0.7 * spread + 0.3 * (accuracy / 100)))
    return { goalHT: goal, cornersHT: corn, cardsHT: card, underHT: und, confidence: conf }
  }, [accuracy])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <h2 className="text-xl font-semibold">Pré-Live</h2>
        <section className="rounded-lg bg-panel border border-border p-4 grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Sistema de ajuste de porcentagem (meta de assertividade)</p>
              <p className="text-2xl font-semibold">{accuracy}%</p>
            </div>
            <input type="range" min={60} max={95} value={accuracy} onChange={(e)=>setAccuracy(Number(e.target.value))} />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProbabilityCard title="Probabilidade gol HT" value={goalHT} confidence={confidence} />
            <ProbabilityCard title="Probabilidade escanteios HT" value={cornersHT} confidence={confidence} />
            <ProbabilityCard title="Probabilidade cartões HT" value={cardsHT} confidence={confidence} />
            <ProbabilityCard title="Under 1º tempo" value={underHT} confidence={confidence} />
          </div>
          <p className="text-xs text-slate-500">Destaque verde quando >= 80%.</p>
        </section>
      </div>
    </main>
  )
}


