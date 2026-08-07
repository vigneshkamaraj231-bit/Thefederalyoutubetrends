import { NextRequest } from 'next/server'
import { getLatest, getHistory } from '@/lib/store'
import { getTrendingVideos, searchVideos } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const region = (searchParams.get('region') || 'IN').toUpperCase()
    const q = searchParams.get('q')
    const history = searchParams.get('history') === 'true'

    if (history) return Response.json({ data: await getHistory(Number(searchParams.get('hours') || 24), region) })
    if (q) return Response.json({ data: await searchVideos(q, region) })

    const cached = await getLatest(region)
    if (cached.length) return Response.json({ data: cached, source: 'snapshot' })
    return Response.json({ data: await getTrendingVideos(region), source: 'youtube' })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to load trends' }, { status: 500 })
  }
}
