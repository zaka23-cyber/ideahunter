import { useState } from 'react'
import ScoreBadge from './ScoreBadge'
import RevenueProof from './RevenueProof'

const SOURCE_COLORS = {
  reddit:       { bg: 'rgba(255,69,0,0.15)',    color: '#ff4500', border: 'rgba(255,69,0,0.3)' },
  hackernews:   { bg: 'rgba(255,102,0,0.15)',   color: '#ff6600', border: 'rgba(255,102,0,0.3)' },
  producthunt:  { bg: 'rgba(218,85,47,0.15)',   color: '#da552f', border: 'rgba(218,85,47,0.3)' },
  indiehackers: { bg: 'rgba(13,115,119,0.15)',  color: '#0d7377', border: 'rgba(13,115,119,0.3)' },
}

function tagColor(type, value) {
  if (type === 'market_size') {
    if (value === 'large') return { bg: 'rgba(0,208,132,0.1)', color: '#00d084', border: 'rgba(0,208,132,0.2)' }
    if (value === 'medium') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' }
    return { bg: 'rgba(107,107,128,0.1)', color: '#6b6b80', border: 'rgba(107,107,128,0.2)' }
  }
  if (type === 'competition') {
    if (value === 'low') return { bg: 'rgba(0,208,132,0.1)', color: '#00d084', border: 'rgba(0,208,132,0.2)' }
    if (value === 'medium') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' }
    return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' }
  }
  if (type === 'difficulty') {
    if (value === 'easy') return { bg: 'rgba(0,208,132,0.1)', color: '#00d084', border: 'rgba(0,208,132,0.2)' }
    if (value === 'medium') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' }
    return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' }
  }
  return { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' }
}

function Tag({ label, colors }) {
  return (
    <span style={{
      background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`,
      borderRadius: '999px', fontSize: '0.7rem', fontFamily: 'DM Sans, sans-serif',
      padding: '3px 9px', display: 'inline-block',
    }}>
      {label}
    </span>
  )
}

export default function IdeaCard({ idea }) {
  const [hovered, setHovered] = useState(false)
  const isHigh = idea.score >= 80

  const source = idea.source_post?.source || 'reddit'
  const sourceColors = SOURCE_COLORS[source] || SOURCE_COLORS.reddit
  const sourceLabel = idea.source_post?.source_label || idea.source_post?.subreddit || 'unknown'

  const permalink = (() => {
    const p = idea.source_post?.permalink
    if (!p) return idea.source_post?.url || '#'
    return p.startsWith('/') ? `https://reddit.com${p}` : p
  })()

  const cardStyle = {
    background: 'var(--surface)',
    border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
    borderLeft: isHigh ? '2px solid #00d084' : undefined,
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.2s ease',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hovered
      ? `0 8px 32px rgba(0,0,0,0.3)${isHigh ? ', -4px 0 24px rgba(0,208,132,0.1)' : ''}`
      : isHigh
        ? '-4px 0 24px rgba(0,208,132,0.07)'
        : 'none',
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
        <span style={{
          background: sourceColors.bg, color: sourceColors.color,
          border: `1px solid ${sourceColors.border}`, borderRadius: '999px',
          fontSize: '0.7rem', fontFamily: 'DM Sans, sans-serif',
          padding: '3px 10px',
        }}>
          {sourceLabel}
        </span>
        <ScoreBadge score={idea.score} />
      </div>

      {/* Title */}
      <a
        href={idea.source_post?.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
      >
        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '1.05rem', fontWeight: 700,
          color: '#e8e8f0', margin: '0 0 8px', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', transition: 'color 0.15s ease',
        }}
          onMouseEnter={e => e.target.style.color = '#00d084'}
          onMouseLeave={e => e.target.style.color = '#e8e8f0'}
        >
          {idea.title}
        </h3>
      </a>

      {/* Problem */}
      <p style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: '#6b6b80',
        margin: '0 0 16px', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {idea.problem}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />

      {/* Solution */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', fontWeight: 600,
          color: '#00d084', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px',
        }}>
          💡 Solution
        </div>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#9090a8',
          margin: 0, lineHeight: 1.5,
        }}>
          {idea.solution}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
        {idea.market_size && (
          <Tag label={`Market: ${idea.market_size}`} colors={tagColor('market_size', idea.market_size)} />
        )}
        {idea.competition && (
          <Tag label={`Competition: ${idea.competition}`} colors={tagColor('competition', idea.competition)} />
        )}
        {idea.difficulty && (
          <Tag label={`Difficulty: ${idea.difficulty}`} colors={tagColor('difficulty', idea.difficulty)} />
        )}
        {(idea.tags || []).map(tag => (
          <Tag key={tag} label={tag} colors={tagColor('custom', tag)} />
        ))}
      </div>

      {/* Revenue proof */}
      <RevenueProof items={idea.revenue_proof} />

      {/* Footer */}
      <div style={{ marginTop: '14px' }}>
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem',
            color: '#4a4a5a', textDecoration: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => e.target.style.color = '#6b6b80'}
          onMouseLeave={e => e.target.style.color = '#4a4a5a'}
        >
          via {sourceLabel} ↗
        </a>
      </div>
    </div>
  )
}
