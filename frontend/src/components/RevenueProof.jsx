export default function RevenueProof({ items }) {
  if (!items || items.length === 0) return null

  return (
    <div style={{
      background: 'var(--green-dim)',
      border: '1px solid var(--green-border)',
      borderRadius: '10px',
      padding: '12px 16px',
      marginTop: '16px',
    }}>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: '0.7rem', fontWeight: 700,
        color: '#00d084', textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '10px',
      }}>
        💰 Revenue Validated
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block', cursor: 'pointer', transition: 'opacity 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '6px 0',
              borderTop: i > 0 ? '1px solid rgba(0,208,132,0.1)' : 'none',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
                fontWeight: 500, color: '#00d084', whiteSpace: 'nowrap', minWidth: '80px',
              }}>
                {item.amount}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem',
                  color: '#6b6b80', overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: '#4a4a5a', marginTop: '2px' }}>
                  ▲ {item.upvotes?.toLocaleString()}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
