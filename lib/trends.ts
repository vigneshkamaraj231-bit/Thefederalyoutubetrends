import { getTrendingVideos, type YouTubeVideo } from './youtube'

export type TrendSnapshot = YouTubeVideo & { capturedAt: string; velocity?: number }

export async function collectSnapshot(regionCode = 'IN') {
  const videos = await getTrendingVideos(regionCode, 50)
  const capturedAt = new Date().toISOString()
  return videos.map((video, index) => ({ ...video, capturedAt, velocity: Math.max(1, 100 - index * 2) }))
}

export function rankByVelocity(current: TrendSnapshot[], previous: TrendSnapshot[]) {
  const previousById = new Map(previous.map(v => [v.id, v]))
  return current.map(v => {
    const old = previousById.get(v.id)
    const viewDelta = old && old.viewCount > 0 ? ((v.viewCount - old.viewCount) / old.viewCount) * 100 : 0
    return { ...v, velocity: Math.round(viewDelta * 10) / 10 }
  }).sort((a, b) => (b.velocity ?? 0) - (a.velocity ?? 0))
}
