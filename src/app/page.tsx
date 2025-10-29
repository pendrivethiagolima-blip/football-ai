import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Football-IA</h1>
          <Link href="/dashboard" className="px-4 py-2 rounded-md bg-black text-white">Ir para Dashboard</Link>
        </header>
        <section className="grid gap-3">
          <p className="text-slate-600">Análises inteligentes, previsões e recomendações com IA generativa.</p>
          <ul className="grid md:grid-cols-3 gap-3">
            <li className="rounded-lg bg-panel border border-border p-4">Pré-Live com IA</li>
            <li className="rounded-lg bg-panel border border-border p-4">Live em Tempo Real</li>
            <li className="rounded-lg bg-panel border border-border p-4">Análises por Times e Árbitros</li>
          </ul>
        </section>
      </div>
    </main>
  )
}


