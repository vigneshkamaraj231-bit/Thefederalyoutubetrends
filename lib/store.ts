import { neon } from '@neondatabase/serverless'
import type { TrendSnapshot } from './trends'

function sql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  return neon(url)
}

export async function ensureSchema() {
  const db = sql()
  await db`CREATE TABLE IF NOT EXISTS trend_snapshots (
    id BIGSERIAL PRIMARY KEY,
    video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_title TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    thumbnail TEXT,
    category_id TEXT,
    view_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    velocity DOUBLE PRECISION,
    region_code TEXT NOT NULL DEFAULT 'IN',
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
  await db`CREATE INDEX IF NOT EXISTS trend_snapshots_video_time ON trend_snapshots(video_id, captured_at DESC)`
  await db`CREATE INDEX IF NOT EXISTS trend_snapshots_region_time ON trend_snapshots(region_code, captured_at DESC)`
}

export async function saveSnapshot(rows: TrendSnapshot[], regionCode = 'IN') {
  const db = sql()
  await ensureSchema()
  for (const row of rows) {
    await db`INSERT INTO trend_snapshots
      (video_id,title,channel_title,published_at,thumbnail,category_id,view_count,like_count,comment_count,velocity,region_code,captured_at)
      VALUES (${row.id},${row.title},${row.channelTitle},${row.publishedAt},${row.thumbnail},${row.categoryId ?? null},${row.viewCount},${row.likeCount},${row.commentCount},${row.velocity ?? null},${regionCode},${row.capturedAt})`
  }
  return rows.length
}

export async function getLatest(regionCode = 'IN') {
  const db = sql()
  await ensureSchema()
  const rows = await db`
    SELECT DISTINCT ON (video_id) video_id AS id,title,channel_title AS "channelTitle",published_at AS "publishedAt",
    thumbnail,category_id AS "categoryId",view_count AS "viewCount",like_count AS "likeCount",comment_count AS "commentCount",
    velocity,captured_at AS "capturedAt"
    FROM trend_snapshots WHERE region_code=${regionCode}
    ORDER BY video_id,captured_at DESC`
  return rows
}

export async function getHistory(hours = 24, regionCode = 'IN') {
  const db = sql()
  await ensureSchema()
  return db`SELECT video_id AS id,title,channel_title AS "channelTitle",published_at AS "publishedAt",thumbnail,
    category_id AS "categoryId",view_count AS "viewCount",like_count AS "likeCount",comment_count AS "commentCount",
    velocity,captured_at AS "capturedAt" FROM trend_snapshots
    WHERE region_code=${regionCode} AND captured_at >= NOW() - (${hours} || ' hours')::interval
    ORDER BY captured_at DESC`
}
