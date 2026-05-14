import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const LABELS = {
  hook_visual: 'Hook',
  jerarquia_visual: 'Jerarquía',
  legibilidad: 'Legibilidad',
  cta: 'CTA',
  emocion: 'Emoción',
  consistencia_marca: 'Marca',
  fit_formato: 'Formato',
}

export default function RadarChart({ dimensiones }) {
  const data = Object.entries(dimensiones).map(([key, val]) => ({
    dimension: LABELS[key] || key,
    score: val.score,
  }))

  return (
    <div style={styles.wrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#2a2a2a" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: '#aaa', fontSize: 12 }} />
          <Radar
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
            labelStyle={{ color: '#f0f0f0' }}
            itemStyle={{ color: '#6366f1' }}
            formatter={(v) => [`${v}/10`, 'Score']}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  wrapper: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
}
