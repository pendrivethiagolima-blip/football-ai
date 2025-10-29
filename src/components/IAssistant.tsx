"use client"

export function IAssistant({ message, type = 'info' }: { message: string; type?: 'info' | 'warning' | 'success' }) {
  const color = type === 'warning' ? 'bg-amber-50 border-amber-200' : type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <p className="text-sm">{message}</p>
    </div>
  )
}


