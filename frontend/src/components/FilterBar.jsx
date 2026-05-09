const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High Score 🔥' },
  { key: 'revenue', label: 'Revenue Proof 💰' },
  { key: 'lowcomp', label: 'Low Competition' },
]

export default function FilterBar({ filter, setFilter }) {
  return (
    <div style={{
      position: 'sticky', top: 0,
      background: 'rgba(5,5,8,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 0', zIndex: 10,
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
        display: 'flex', gap: '8px', flexWrap: 'wrap',
      }}>
        {FILTERS.map(f => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background: active ? '#00d084' : 'var(--surface-2)',
                color: active ? '#050508' : 'var(--text-muted)',
                fontWeight: active ? 600 : 400,
                border: active ? 'none' : '1px solid var(--border)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (!active) e.target.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={e => { if (!active) e.target.style.borderColor = 'var(--border)' }}
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
