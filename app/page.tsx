'use client'

import { useMemo, useState } from 'react'

const trends = [
  { rank: 1, title: 'Tamil Nadu election 2026', channel: 'The Federal Tamil', category: 'News', views: '2.4M', growth: 245, time: '18 min ago', signal: 'Exploding' },
  { rank: 2, title: 'India vs England — final moments', channel: 'Cricbuzz', category: 'Sports', views: '1.8M', growth: 182, time: '31 min ago', signal: 'Rising' },
  { rank: 3, title: 'Chennai rain: what happens next?', channel: 'Thanthi TV', category: 'News', views: '1.2M', growth: 156, time: '44 min ago', signal: 'Rising' },
  { rank: 4, title: 'New iPhone Air first look', channel: 'Tech Tamil', category: 'Tech', views: '864K', growth: 128, time: '1 hr ago', signal: 'Rising' },
  { rank: 5, title: 'Budget explained in 10 minutes', channel: 'The Federal', category: 'Business', views: '742K', growth: 104, time: '1 hr ago', signal: 'Growing' },
]

const keywords = [
  ['#TamilNadu', '+245%'], ['#Chennai', '+182%'], ['#Election2026', '+156%'], ['#IndiaCricket', '+141%'], ['#Budget', '+104%'], ['#Tech', '+82%']
]

export default function Home() {
  const [region, setRegion] = useState('India')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => trends.filter(t =>
    (category === 'All' || t.category === category) &&
    t.title.toLowerCase().includes(query.toLowerCase())
  ), [category, query])

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">F</span><div><strong>THE FEDERAL</strong><small>YOUTUBE TRENDS</small></div></div>
        <div className="header-actions"><span className="live"><i /> LIVE DATA</span><span className="updated">Updated 2 min ago</span><div className="avatar">VC</div></div>
      </header>

      <section className="hero">
        <div><p className="eyebrow">EDITORIAL INTELLIGENCE</p><h1>Know what&apos;s rising <em>before it peaks.</em></h1><p className="sub">Track YouTube momentum, discover emerging stories, and turn attention into timely content opportunities.</p></div>
        <div className="hero-stat"><span>Trending topics</span><b>1,284</b><small>↑ 18.6% today</small></div>
      </section>

      <nav className="filters">
        {['India', 'Global', 'Tamil', 'English'].map(x => <button key={x} className={region === x ? 'active' : ''} onClick={() => setRegion(x)}>{x}</button>)}
        <span className="divider" />
        {['All', 'News', 'Sports', 'Tech', 'Business'].map(x => <button key={x} className={category === x ? 'active' : ''} onClick={() => setCategory(x)}>{x}</button>)}
        <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search trends..." /></label>
      </nav>

      <div className="grid">
        <section className="panel trends-panel">
          <div className="panel-head"><div><p className="eyebrow">RIGHT NOW · {region.toUpperCase()}</p><h2>Trending now</h2></div><button className="ghost">View all →</button></div>
          <div className="trend-list">
            {filtered.map(t => <article className="trend" key={t.rank}>
              <div className="rank">{String(t.rank).padStart(2, '0')}</div><div className="thumb"><span>▶</span></div>
              <div className="trend-copy"><div className="trend-title">{t.title}</div><div className="meta">{t.channel} · {t.category} · {t.time}</div></div>
              <div className="metric"><b>{t.views}</b><span>views</span></div><div className="growth"><b>↑ {t.growth}%</b><span>{t.signal}</span></div>
            </article>)}
          </div>
        </section>

        <aside className="panel signal-panel"><div className="panel-head"><div><p className="eyebrow">MOMENTUM</p><h2>Trend velocity</h2></div><span className="period">24H</span></div>
          <div className="chart"><div className="ylabels"><span>300%</span><span>200%</span><span>100%</span><span>0</span></div><svg viewBox="0 0 500 220" preserveAspectRatio="none"><path d="M0 194 C45 190 55 174 82 181 S118 160 145 166 S174 130 203 146 S232 105 261 121 S289 82 317 100 S348 45 373 70 S405 27 432 48 S464 12 500 18" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M0 194 C45 190 55 174 82 181 S118 160 145 166 S174 130 203 146 S232 105 261 121 S289 82 317 100 S348 45 373 70 S405 27 432 48 S464 12 500 18 L500 220 L0 220Z" opacity=".08" /></svg></div>
          <div className="chart-foot"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div>
          <div className="insight"><span>✦</span><div><b>Biggest acceleration</b><p>Tamil Nadu election content is gaining <strong>245%</strong> faster than its 6-hour baseline.</p></div></div>
        </aside>

        <section className="panel keyword-panel"><div className="panel-head"><div><p className="eyebrow">SEARCH SIGNALS</p><h2>Rising keywords</h2></div><span className="count">6 tracked</span></div><div className="keywords">{keywords.map(([key, val]) => <div className="keyword" key={key}><span>{key}</span><b>{val}</b><i>↗</i></div>)}</div></section>

        <section className="panel opportunity"><div className="panel-head"><div><p className="eyebrow">EDITORIAL OPPORTUNITIES</p><h2>What should we cover?</h2></div><button className="ghost">Refresh ↻</button></div><div className="idea"><div className="idea-score">92<small>score</small></div><div><span className="tag">FAST MOVING</span><h3>Election 2026: the issues YouTube audiences are searching for</h3><p>High velocity + strong search intent + low coverage gap</p></div><button className="arrow">→</button></div><div className="idea second"><div className="idea-score">87<small>score</small></div><div><span className="tag">COVERAGE GAP</span><h3>Why Chennai&apos;s weather story is accelerating</h3><p>3.2× growth in the last 90 minutes</p></div><button className="arrow">→</button></div></section>
      </div>
      <footer><span>THE FEDERAL · INTERNAL TOOL</span><span>Data refreshes every 5 minutes · Prototype data</span></footer>
    </main>
  )
}
