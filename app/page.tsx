'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Trend = {
  id: string
  title: string
  channelTitle: string
  publishedAt: string
  thumbnail: string
  categoryId?: string
  viewCount: number | string
  likeCount: number | string
  commentCount: number | string
  velocity?: number
}

const categoryNames: Record<string, string> = {
  '10': 'Music', '17': 'Sports', '19': 'Travel', '20': 'Gaming', '22': 'People',
  '23': 'Comedy', '24': 'Entertainment', '25': 'News', '26': 'How-to', '27': 'Education',
  '28': 'Tech',
}

const regions = [
  { label: 'India', code: 'IN' },
  { label: 'Global', code: 'US' },
  { label: 'UK', code: 'GB' },
]

function compact(value: number | string) {
  const n = Number(value || 0)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function age(date: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function Home() {
  const [region, setRegion] = useState('IN')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updated, setUpdated] = useState<Date | null>(null)

  const loadTrends = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/trends?region=${region}`, { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to load YouTube trends')
      setTrends(payload.data || [])
      setUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load YouTube trends')
    } finally {
      setLoading(false)
    }
  }, [region])

  useEffect(() => { loadTrends() }, [loadTrends])

  const filtered = useMemo(() => trends.filter(t => {
    const name = categoryNames[t.categoryId || ''] || 'Other'
    return (category === 'All' || name === category) && t.title.toLowerCase().includes(query.toLowerCase())
  }), [trends, category, query])

  const topVelocity = [...trends].sort((a, b) => Number(b.velocity || 0) - Number(a.velocity || 0)).slice(0, 6)
  const categories = ['All', ...Array.from(new Set(trends.map(t => categoryNames[t.categoryId || ''] || 'Other'))).slice(0, 5)]

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">F</span><div><strong>THE FEDERAL</strong><small>YOUTUBE TRENDS</small></div></div>
        <div className="header-actions"><span className="live"><i /> LIVE DATA</span><span className="updated">{updated ? `Updated ${updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Connecting…'}</span><div className="avatar">TF</div></div>
      </header>

      <section className="hero">
        <div><p className="eyebrow">EDITORIAL INTELLIGENCE</p><h1>Know what&apos;s rising <em>before it peaks.</em></h1><p className="sub">Track real YouTube momentum, discover emerging stories, and turn attention into timely content opportunities.</p></div>
        <div className="hero-stat"><span>Videos tracked</span><b>{loading ? '—' : trends.length}</b><small>{error ? 'API not connected' : 'Live YouTube data'}</small></div>
      </section>

      <nav className="filters">
        {regions.map(x => <button key={x.code} className={region === x.code ? 'active' : ''} onClick={() => { setRegion(x.code); setCategory('All') }}>{x.label}</button>)}
        <span className="divider" />
        {categories.map(x => <button key={x} className={category === x ? 'active' : ''} onClick={() => setCategory(x)}>{x}</button>)}
        <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search trends..." /></label>
        <button className="refresh" onClick={loadTrends} disabled={loading}>{loading ? 'Loading…' : '↻ Refresh'}</button>
      </nav>

      {error && <section className="setup-banner"><b>Connect your data sources</b><span>{error}</span><small>Add YOUTUBE_API_KEY and DATABASE_URL in Vercel → Settings → Environment Variables.</small></section>}

      <div className="grid">
        <section className="panel trends-panel">
          <div className="panel-head"><div><p className="eyebrow">RIGHT NOW · {regions.find(r => r.code === region)?.label.toUpperCase()}</p><h2>Trending now</h2></div><span className="count">{filtered.length} videos</span></div>
          <div className="trend-list">
            {loading && Array.from({ length: 6 }).map((_, i) => <div className="skeleton" key={i} />)}
            {!loading && !error && filtered.map((t, index) => {
              const velocity = Number(t.velocity || 0)
              return <article className="trend" key={t.id}>
                <div className="rank">{String(index + 1).padStart(2, '0')}</div>
                <a className="thumb" href={`https://www.youtube.com/watch?v=${t.id}`} target="_blank" rel="noreferrer"><img src={t.thumbnail} alt="" /><span>▶</span></a>
                <div className="trend-copy"><div className="trend-title">{t.title}</div><div className="meta">{t.channelTitle} · {categoryNames[t.categoryId || ''] || 'Other'} · {age(t.publishedAt)}</div></div>
                <div className="metric"><b>{compact(t.viewCount)}</b><span>views</span></div><div className="growth"><b className={velocity >= 0 ? 'positive' : 'negative'}>{velocity ? `${velocity > 0 ? '↑' : '↓'} ${Math.abs(velocity).toFixed(0)}%` : 'NEW'}</b><span>{velocity ? 'velocity' : 'fresh'}</span></div>
              </article>
            })}
            {!loading && !error && filtered.length === 0 && <div className="empty">No matching trends found.</div>}
          </div>
        </section>

        <aside className="panel signal-panel"><div className="panel-head"><div><p className="eyebrow">MOMENTUM</p><h2>Trend velocity</h2></div><span className="period">LIVE</span></div>
          <div className="velocity-list">{topVelocity.length ? topVelocity.map((t, i) => <div className="velocity" key={t.id}><span>{i + 1}</span><div><b>{t.title}</b><small>{t.channelTitle}</small></div><strong>{Number(t.velocity || 0) > 0 ? '+' : ''}{Number(t.velocity || 0).toFixed(0)}%</strong></div>) : <div className="empty">Historical velocity appears after the first snapshots are collected.</div>}</div>
          <div className="insight"><span>✦</span><div><b>How the score works</b><p>Velocity compares the latest stored view count with the previous snapshot. More snapshots make the signal more reliable.</p></div></div>
        </aside>

        <section className="panel keyword-panel"><div className="panel-head"><div><p className="eyebrow">SEARCH SIGNALS</p><h2>Rising keywords</h2></div><span className="count">Derived</span></div><div className="keywords">{topVelocity.slice(0, 6).map(t => <div className="keyword" key={t.id}><span>{t.title.slice(0, 30)}{t.title.length > 30 ? '…' : ''}</span><b>{Number(t.velocity || 0) > 0 ? `+${Number(t.velocity).toFixed(0)}%` : 'NEW'}</b><i>↗</i></div>)}</div></section>

        <section className="panel opportunity"><div className="panel-head"><div><p className="eyebrow">EDITORIAL OPPORTUNITIES</p><h2>What should we cover?</h2></div><span className="count">Prototype scoring</span></div><div className="idea"><div className="idea-score">{topVelocity[0] ? Math.min(99, Math.max(50, Math.round(60 + Number(topVelocity[0].velocity || 0) / 2))) : '—'}<small>score</small></div><div><span className="tag">FAST MOVING</span><h3>{topVelocity[0]?.title || 'Connect YouTube data to generate opportunities'}</h3><p>High velocity topics are surfaced first for editorial review.</p></div><a className="arrow" href={topVelocity[0] ? `https://www.youtube.com/watch?v=${topVelocity[0].id}` : '#'} target="_blank" rel="noreferrer">→</a></div></section>
      </div>
      <footer><span>THE FEDERAL · INTERNAL TOOL</span><span>Live YouTube API · Historical snapshots stored server-side</span></footer>
    </main>
  )
}
