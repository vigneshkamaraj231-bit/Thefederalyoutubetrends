import { getTrendingVideos, type YouTubeVideo } from './youtube'
import { getLatest } from './store'

export type TrendSnapshot = YouTubeVideo & { capturedAt: string; velocity?: number }

export async function collectSnapshot(regionCode = 'IN') {
  const current = await getTrendingVideos(regionCode, 50)
  const previous = await getLatest(regionCode)
  const previousById = new Map(previous.map((v: any) => [v.id, v]))
  const capturedAt = new Date().toISOString()

  return current.map(video => {
    const old = previousById.get(video.id) as any
    const viewDelta = old && Number(old.viewCount) > 0
      ? ((video.viewCount - Number(old.viewCount)) / Number(old.viewCount)) * 100
      : 0
    return { ...video, capturedAt, velocity: Math.round(viewDelta * 10) / 10 }
  }).sort((a, b) => (b.velocity ?? 0) - (a.velocity ?? 0))
}
