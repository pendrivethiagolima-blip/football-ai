import { NextResponse } from 'next/server'
import { fetchLiveDataCached } from '@/lib/data/provider'
import { insertLiveSample } from '@/lib/db/supabase'

export async function GET() {
  const data = await fetchLiveDataCached()
  // Registrar em background (best-effort, sem quebrar resposta)
  ;(async () => {
    try {
      const jogoId = String(
        data?.fixtures?.response?.[0]?.fixture?.id ||
        data?.matches?.matches?.[0]?.id ||
        data?.matches?.[0]?.id ||
        'mock-live'
      )
      await insertLiveSample({ jogo_id: jogoId, payload: data })
    } catch (e) {
      console.error('live logging error', e)
    }
  })()
  return NextResponse.json({ ok: true, data })
}


