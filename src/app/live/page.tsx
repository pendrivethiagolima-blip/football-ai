"use client"
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { detectPressurePattern, type LiveSample } from '@/lib/ia/patterns'
import { AlertList } from '@/components/AlertList'

const LivePressureChart = dynamic(() => import('@/components/LivePressureChart'), { ssr: false })

export default function LivePage() {
  const [samples, setSamples] = useState<LiveSample[]>([
    { minute: 10, shots: 1, attacks: 6, dangerousAttacks: 3 },
    { minute: 12, shots: 2, attacks: 8, dangerousAttacks: 5 },
    { minute: 14, shots: 3, attacks: 11, dangerousAttacks: 7 }
  ])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/live', { cache: 'no-store' })
        const json = await res.json()
        const d = json?.data
        // Tentativa de extrair amostras de pressão de diferentes fontes
        const apiFootball = d?.fixtures?.response?.[0]
        const fd = d?.matches?.matches?.[0] || d?.matches?.[0]
        // Se houver métricas específicas, mapear aqui; fallback mantém amostras locais
        if (apiFootball || fd) {
          // simples simulação: reforça última amostra para indicar atualização
          setSamples((s) => {
            const last = s[s.length - 1] ?? { minute: 10, shots: 1, attacks: 6, dangerousAttacks: 3 }
            const next: LiveSample = {
              minute: (last.minute ?? 10) + 2,
              shots: (last.shots ?? 1) + Math.round(Math.random() * 2),
              attacks: (last.attacks ?? 6) + Math.round(Math.random() * 4),
              dangerousAttacks: (last.dangerousAttacks ?? 3) + Math.round(Math.random() * 3)
            }
            return [...s, next].slice(-12)
          })
        }
        setError(null)
      } catch (e: any) {
        console.error('live fetch error', e)
        setError('Falha ao carregar dados ao vivo. Exibindo fallback.')
      }
    }
    fetchLive()
    const id = setInterval(fetchLive, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  const analysis = useMemo(() => detectPressurePattern(samples), [samples])
  const alerts = useMemo(() => {
    const list: { message: string; type: 'info'|'warning'|'success' }[] = []
    if (analysis.intensity > 0.8) list.push({ message: "Alerta: 'amassamento' ofensivo detectado!", type: 'warning' })
    if (analysis.intensity > 0.65) list.push({ message: 'Pressão em alta: chance de gol aumentada.', type: 'info' })
    if (list.length===0) list.push({ message: 'Jogo estável, aguardando sinais mais fortes.', type: 'info' })
    return list
  }, [analysis])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <h2 className="text-xl font-semibold">Live</h2>
        <section className="rounded-lg bg-panel border border-border p-4 grid gap-4">
          <h3 className="font-medium">Gráficos de pressão em tempo real</h3>
          <LivePressureChart />
          {error && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">{error}</div>}
          <div className="text-sm text-slate-600">Intensidade: {(analysis.intensity*100).toFixed(0)}% | Tendência: {analysis.trend}</div>
        </section>
        <section className="rounded-lg bg-panel border border-border p-4 grid gap-3">
          <h3 className="font-medium">Alertas de oportunidades</h3>
          <AlertList alerts={alerts} />
        </section>
      </div>
    </main>
  )
}


