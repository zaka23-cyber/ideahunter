export default function ScoreBadge({ score }) {
  let bg, color, border, emoji
  if (score >= 80) {
    bg = 'rgba(0,208,132,0.15)'; color = '#00d084'; border = 'rgba(0,208,132,0.3)'; emoji = '🔥'
  } else if (score >= 60) {
    bg = 'rgba(245,158,11,0.15)'; color = '#f59e0b'; border = 'rgba(245,158,11,0.3)'; emoji = '⚡'
  } else {
    bg = 'rgba(239,68,68,0.15)'; color = '#ef4444'; border = 'rgba(239,68,68,0.3)'; emoji = '❄️'
  }

  return (
    <span style={{
      background: bg, color, border: `1px solid ${border}`,
      borderRadius: '999px', fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {emoji} {score}
    </span>
  )
}
