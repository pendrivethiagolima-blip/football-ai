import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function upsertAnalysis({ jogo_id, previsao_ia, accuracy }: { jogo_id: string; previsao_ia: unknown; accuracy: number }) {
  const { error } = await supabase.from('analises_ia').upsert({ jogo_id, previsao_ia, accuracy }).select().single()
  if (error) throw error
}

export async function insertLiveSample({ jogo_id, payload }: { jogo_id: string; payload: unknown }) {
  try {
    const { error } = await supabase.from('live_samples').insert({ jogo_id, payload }).select().single()
    if (error) return false
    return true
  } catch {
    return false
  }
}


