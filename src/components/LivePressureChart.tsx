"use client"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useEffect, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function LivePressureChart() {
  const [data, setData] = useState<number[]>([20, 35, 50, 40, 65, 80])

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const next = [...d, Math.min(100, Math.max(0, Math.round(d[d.length - 1] + (Math.random() * 20 - 10)))))]
        return next.slice(-12)
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <Line
      data={{
        labels: data.map((_, i) => `${i}m`),
        datasets: [
          {
            label: 'Pressão Ofensiva',
            data,
            borderColor: '#111827',
            backgroundColor: 'rgba(17,24,39,0.15)'
          }
        ]
      }}
      options={{
        responsive: true,
        animation: { duration: 500 },
        scales: { y: { min: 0, max: 100 } }
      }}
    />
  )
}


