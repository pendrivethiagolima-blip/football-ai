"use client"
import dynamic from 'next/dynamic'
import { IAssistant } from '@/components/IAssistant'
import { IAnalysisPanel } from '@/components/IAnalysisPanel'
import { useState } from 'react'

const LivePressureChart = dynamic(() => import('@/components/LivePressureChart'), { ssr: false })

export default function DashboardPage() {
  const [prob, setProb] = useState<number>(80)

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-lg bg-panel border border-border p-4">
            <h3 className="font-medium mb-3">Pressão Ofensiva (Live)</h3>
            <LivePressureChart />
          </section>
          <section className="rounded-lg bg-panel border border-border p-4">
            <IAnalysisPanel value={prob} onProbabilityChange={setProb} />
          </section>
        </div>
        <IAssistant message="Recomendo focar no jogo X devido à pressão ofensiva detectada" type="warning" />
      </div>
    </main>
  )
}


