import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Football-IA | Análise de Futebol com IA',
  description: 'Sistema revolucionário de análise de futebol com IA generativa',
  manifest: '/manifest.json',
  themeColor: '#ffffff'
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg text-slate-900 antialiased">{children}</body>
    </html>
  )
}


