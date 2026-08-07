import { NextRequest } from 'next/server'
import { collectSnapshot } from '../../../lib/trends'
import { saveSnapshot } from '../../../lib/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const region = process.env.TRENDS_REGION || 'IN'
    const rows = await collectSnapshot(region)
    const saved = await saveSnapshot(rows, region)
    return Response.json({ ok: true, capturedAt: new Date().toISOString(), region, saved })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Sync failed' }, { status: 500 })
  }
}
