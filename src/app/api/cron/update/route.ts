import { NextResponse } from 'next/server'
import { refreshLiveAndPrelivePipelines } from '@/lib/cron'

export async function GET() {
  await refreshLiveAndPrelivePipelines()
  return NextResponse.json({ ok: true })
}


