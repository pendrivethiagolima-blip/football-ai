import { NextResponse } from 'next/server'
import { cacheSet, cacheGet } from '@/lib/cache/redis'
import { supabase } from '@/lib/db/supabase'
import { notify } from '@/lib/utils/notify'

export async function GET() {
  const report: Record<string, any> = { ts: Date.now() }
  let ok = true
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      await cacheSet('health:ping', 'pong', 10)
      const v = await cacheGet<string>('health:ping')
      report.redis = v === 'pong'
      ok = ok && report.redis
    } else {
      report.redis = 'disabled'
    }
  } catch (e) {
    report.redis = false
    ok = false
  }

  try {
    const { error } = await supabase.from('analises_ia').select('id', { head: true, count: 'exact' }).limit(1)
    report.supabase = !error
    ok = ok && !error
  } catch (e) {
    report.supabase = false
    ok = false
  }

  // Chaves presentes?
  report.apiFootballKey = !!process.env.API_FOOTBALL_KEY
  report.footballDataKey = !!process.env.FOOTBALL_DATA_KEY

  if (!ok) {
    await notify(`Healthcheck FAILED: ${JSON.stringify(report)}`)
    return NextResponse.json({ ok: false, report }, { status: 503 })
  }
  return NextResponse.json({ ok: true, report })
}


