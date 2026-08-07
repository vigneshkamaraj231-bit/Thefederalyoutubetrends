import type { TrendSnapshot } from './trends'

// Persistence adapter boundary. In production, replace these functions with
// Vercel Postgres/Neon queries without changing the API or UI layer.
let latest: TrendSnapshot[] = []
let history: TrendSnapshot[] = []

export async function saveSnapshot(rows: TrendSnapshot[]) {
  latest = rows
  history = [...rows, ...history].slice(0, 5000)
  return rows.length
}

export async function getLatest() {
  return latest
}

export async function getHistory(hours = 24) {
  const cutoff = Date.now() - hours * 60 * 60 * 1000
  return history.filter(row => new Date(row.capturedAt).getTime() >= cutoff)
}
