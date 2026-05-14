const DIMENSION_LABELS = {
  hook_visual: 'Hook visual',
  jerarquia_visual: 'Jerarquía visual',
  legibilidad: 'Legibilidad',
  cta: 'CTA',
  emocion: 'Emoción',
  consistencia_marca: 'Consistencia de marca',
  fit_formato: 'Fit con formato',
}

function scoreColor(score) {
  if (score >= 8) return '#4ade80'
  if (score >= 5) return '#facc15'
  return '#f87171'
}

export default function ScoreCard({ dimensionKey, data }) {
  const label = DIMENSION_LABELS[dimensionKey] || dimensionKey
  const color = scoreColor(data.score)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.name}>{label}</span>
        <span style={{ ...styles.score, color }}>{data.score}<span style={styles.outOf}>/10</span></span>
      </div>

      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${data.score * 10}%`, background: color }} />
      </div>

      <p style={styles.justificacion}>{data.justificacion}</p>

      <div style={styles.recBox}>
        <span style={styles.recLabel}>Recomendación</span>
        <p style={styles.recText}>{data.recomendacion}</p>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontWeight: 600,
    fontSize: 15,
    color: '#f0f0f0',
  },
  score: {
    fontSize: 22,
    fontWeight: 800,
  },
  outOf: {
    fontSize: 13,
    color: '#555',
    fontWeight: 400,
  },
  barTrack: {
    background: '#2a2a2a',
    borderRadius: 4,
    height: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.6s ease',
  },
  justificacion: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 1.5,
  },
  recBox: {
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  recLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6366f1',
  },
  recText: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 1.5,
  },
}
