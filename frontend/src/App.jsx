import { useState, useEffect, useRef } from 'react'
import IdeaCard from './components/IdeaCard'
import FilterBar from './components/FilterBar'

const SCAN_MESSAGES = [
  'Scanning r/entrepreneur...',
  'Scanning r/SaaS...',
  'Scanning HackerNews...',
  'Scanning ProductHunt...',
  'Scanning IndieHackers...',
  'Analyzing with AI...',
  'Finding revenue proof...',
]

const API = 'http://localhost:8001'

function CrosshairIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

export default function App() {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [scanMsg, setScanMsg] = useState(SCAN_MESSAGES[0])
  const msgIdx = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/ideas`)
      .then(r => r.json())
      .then(d => setIdeas(d.ideas || []))
      .catch(() => {})
  }, [])

  const startScan = async () => {
    setLoading(true)
    msgIdx.current = 0
    setScanMsg(SCAN_MESSAGES[0])
    intervalRef.current = setInterval(() => {
      msgIdx.current = (msgIdx.current + 1) % SCAN_MESSAGES.length
      setScanMsg(SCAN_MESSAGES[msgIdx.current])
    }, 3000)

    try {
      const res = await fetch(`${API}/scan`, { method: 'POST' })
      const data = await res.json()
      setIdeas(data.ideas || [])
    } catch (e) {
      console.error(e)
    } finally {
      clearInterval(intervalRef.current)
      setLoading(false)
    }
  }

  const filtered = ideas.filter(idea => {
    if (filter === 'high') return idea.score >= 80
    if (filter === 'revenue') return idea.revenue_proof?.length > 0
    if (filter === 'lowcomp') return idea.competition === 'low'
    return true
  })

  const highCount = ideas.filter(i => i.score >= 80).length
  const revenueCount = ideas.filter(i => i.revenue_proof?.length > 0).length

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '80px' }}>
        {/* Gradient mesh blobs */}
        <div style={{
          position: 'absolute', top: '-120px', left: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(0,208,132,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '80px 24px 0', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
            <CrosshairIcon />
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
              IdeaHunter
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800, color: '#e8e8f0', margin: '0 0 16px',
            lineHeight: 1.1, letterSpacing: '-0.03em',
          }}>
            Find validated business ideas<br />
            <span style={{ color: '#00d084' }}>across the web</span>
          </h1>

          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.125rem', color: '#6b6b80', margin: '0 0 8px' }}>
            Real problems. Real revenue proof. Updated weekly.
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: '#4a4a5a', marginBottom: '40px' }}>
            Reddit · HackerNews · ProductHunt · IndieHackers + Claude AI analysis
          </p>

          {/* CTA */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px', border: '3px solid rgba(0,208,132,0.2)',
                borderTop: '3px solid #00d084', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#00d084', fontSize: '0.9rem' }}>
                {scanMsg}
              </span>
            </div>
          ) : (
            <button
              onClick={startScan}
              style={{
                background: '#00d084', color: '#050508',
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: '1rem', border: 'none', borderRadius: '999px',
                padding: '14px 36px', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 0 0 rgba(0,208,132,0)',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'scale(1.05)'
                e.target.style.boxShadow = '0 0 32px rgba(0,208,132,0.4)'
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 0 0 0 rgba(0,208,132,0)'
              }}
            >
              Hunt for Ideas →
            </button>
          )}

          {/* Stats row */}
          {ideas.length > 0 && (
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[
                `${ideas.length} ideas`,
                `${revenueCount} with revenue proof`,
                '4 sources',
                `${highCount} high score`,
              ].map((stat, i, arr) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: '#4a4a5a' }}>{stat}</span>
                  {i < arr.length - 1 && <span style={{ color: '#2a2a38', fontSize: '0.8rem' }}>·</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {ideas.length > 0 && (
        <>
          <FilterBar filter={filter} setFilter={setFilter} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.25rem',
                fontWeight: 700, color: '#e8e8f0', margin: 0,
              }}>
                Validated Ideas
              </h2>
              <span style={{
                background: 'rgba(0,208,132,0.12)', color: '#00d084',
                border: '1px solid rgba(0,208,132,0.25)', borderRadius: '999px',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
                padding: '2px 10px',
              }}>
                {filtered.length}
              </span>
            </div>

            <div style={{
              columns: 'auto 380px', columnGap: '20px',
            }}>
              {filtered.map(idea => (
                <div key={idea.id} style={{ breakInside: 'avoid', marginBottom: '20px' }}>
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {ideas.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b6b80' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>
            Click "Hunt for Ideas" to scan Reddit, HackerNews, ProductHunt, and IndieHackers for validated opportunities.
          </p>
        </div>
      )}
    </div>
  )
}
