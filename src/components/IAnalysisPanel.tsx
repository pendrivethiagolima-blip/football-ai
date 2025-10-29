"use client"
import { useCallback } from 'react'

export function IAnalysisPanel({
  value,
  onProbabilityChange
}: {
  value: number
  onProbabilityChange: (v: number) => void
}) {
  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => onProbabilityChange(Number(e.target.value)),
    [onProbabilityChange]
  )

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Meta de assertividade</span>
        <span className="font-medium">{value}%</span>
      </div>
      <input type="range" min={50} max={95} value={value} onChange={onChange} className="w-full" />
      <button className="px-3 py-2 rounded-md bg-black text-white text-sm">Aplicar</button>
    </div>
  )
}


