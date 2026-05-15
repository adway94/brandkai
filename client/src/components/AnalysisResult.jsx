import ScoreCard from './ScoreCard'
import RadarChart from './RadarChart'

const EMOCION_LABELS = {
  confianza: 'Confianza',
  urgencia: 'Urgencia',
  aspiracion: 'Aspiración',
  humor: 'Humor',
  fomo: 'FOMO',
  otro: 'Otro',
}

function scoreColor(score) {
  if (score >= 75) return '#4ade80'
  if (score >= 50) return '#facc15'
  return '#f87171'
}

export default function AnalysisResult({ result, imagePreview }) {
  const color = scoreColor(result.score_general)
  const rechazada = result.veredicto === 'rechazada'
  const alertas = result.alertas_criticas || []

  return (
    <div style={styles.container}>

      {/* Veredicto banner */}
      <div style={{ ...styles.veredicto, background: rechazada ? '#2d0f0f' : '#0f2d1a', borderColor: rechazada ? '#f87171' : '#4ade80' }}>
        <span style={{ ...styles.veredictoIcon }}>
          {rechazada ? '✕' : '✓'}
        </span>
        <div>
          <p style={{ ...styles.veredictoLabel, color: rechazada ? '#f87171' : '#4ade80' }}>
            {rechazada ? 'RECHAZADA' : 'APROBADA'}
          </p>
          {alertas.length > 0 && (
            <ul style={styles.alertasList}>
              {alertas.map((a, i) => <li key={i} style={styles.alertaItem}>{a}</li>)}
            </ul>
          )}
        </div>
      </div>

      <div style={styles.topRow}>
        {imagePreview && (
          <img src={imagePreview} alt="Ad analizado" style={styles.thumbImg} />
        )}

        <div style={styles.scoreBlock}>
          <p style={styles.scoreLabel}>Score general</p>
          <p style={{ ...styles.scoreNumber, color }}>{result.score_general}</p>
          <p style={styles.scoreSub}>sobre 100</p>

          <div style={styles.tags}>
            <Tag label="Formato" value={result.formato_detectado} />
            <Tag label="Emoción" value={EMOCION_LABELS[result.emocion_predominante] || result.emocion_predominante} />
          </div>
        </div>

        <div style={styles.resumen}>
          <p style={styles.resumenLabel}>Diagnóstico</p>
          <p style={styles.resumenText}>{result.resumen_ejecutivo}</p>
        </div>
      </div>

      <RadarChart dimensiones={result.dimensiones} />

      <div style={styles.cardsGrid}>
        {Object.entries(result.dimensiones).map(([key, data]) => (
          <ScoreCard key={key} dimensionKey={key} data={data} />
        ))}
      </div>
    </div>
  )
}

function Tag({ label, value }) {
  return (
    <div style={styles.tag}>
      <span style={styles.tagLabel}>{label}</span>
      <span style={styles.tagValue}>{value}</span>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    borderTop: '1px solid #2a2a2a',
    paddingTop: 28,
  },
  veredicto: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    border: '1px solid',
    borderRadius: 12,
    padding: '14px 18px',
  },
  veredictoIcon: {
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1,
    marginTop: 2,
  },
  veredictoLabel: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 1,
  },
  alertasList: {
    margin: '6px 0 0 0',
    padding: '0 0 0 16px',
  },
  alertaItem: {
    color: '#fca5a5',
    fontSize: 13,
    lineHeight: 1.5,
  },
  topRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 160px 1fr',
    gap: 20,
    alignItems: 'start',
  },
  thumbImg: {
    width: 120,
    borderRadius: 8,
    objectFit: 'cover',
  },
  scoreBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: '16px 12px',
    gap: 4,
  },
  scoreLabel: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: 900,
    lineHeight: 1,
  },
  scoreSub: {
    color: '#555',
    fontSize: 12,
  },
  tags: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 8,
    width: '100%',
  },
  tag: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#111',
    borderRadius: 6,
    padding: '5px 8px',
  },
  tagLabel: {
    color: '#555',
    fontSize: 11,
  },
  tagValue: {
    color: '#ddd',
    fontSize: 12,
    fontWeight: 600,
  },
  resumen: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  resumenLabel: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resumenText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 1.7,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 14,
  },
}
