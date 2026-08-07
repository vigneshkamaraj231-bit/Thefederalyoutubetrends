const API = 'https://www.googleapis.com/youtube/v3'

export type YouTubeVideo = {
  id: string
  title: string
  channelTitle: string
  publishedAt: string
  thumbnail: string
  categoryId?: string
  viewCount: number
  likeCount: number
  commentCount: number
}

function key() {
  const value = process.env.YOUTUBE_API_KEY
  if (!value) throw new Error('YOUTUBE_API_KEY is not configured')
  return value
}

async function youtube<T>(path: string, params: Record<string, string>) {
  const url = new URL(`${API}/${path}`)
  Object.entries({ ...params, key: key() }).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
  return res.json() as Promise<T>
}

export async function getTrendingVideos(regionCode = 'IN', maxResults = 25) {
  const data = await youtube<{ items: Array<{ id: string; snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails?: { medium?: { url: string } }; categoryId: string }; statistics?: { viewCount?: string; likeCount?: string; commentCount?: string } }> }>('videos', {
    part: 'snippet,statistics', chart: 'mostPopular', regionCode, maxResults: String(maxResults),
  })
  return data.items.map(item => ({
    id: item.id, title: item.snippet.title, channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt, thumbnail: item.snippet.thumbnails?.medium?.url ?? '',
    categoryId: item.snippet.categoryId, viewCount: Number(item.statistics?.viewCount ?? 0),
    likeCount: Number(item.statistics?.likeCount ?? 0), commentCount: Number(item.statistics?.commentCount ?? 0),
  })) satisfies YouTubeVideo[]
}

export async function searchVideos(q: string, regionCode = 'IN', maxResults = 25) {
  const data = await youtube<{ items: Array<{ id: { videoId: string }; snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails?: { medium?: { url: string } } } }> }>('search', {
    part: 'snippet', type: 'video', q, regionCode, maxResults: String(maxResults), order: 'date',
  })
  return data.items.map(item => ({ id: item.id.videoId, title: item.snippet.title, channelTitle: item.snippet.channelTitle, publishedAt: item.snippet.publishedAt, thumbnail: item.snippet.thumbnails?.medium?.url ?? '', viewCount: 0, likeCount: 0, commentCount: 0 }))
}
