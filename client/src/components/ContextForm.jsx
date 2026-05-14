const OBJETIVOS = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'trafico', label: 'Tráfico' },
  { value: 'conversion', label: 'Conversión' },
  { value: 'leads', label: 'Leads' },
]

const PLATAFORMAS = [
  { value: 'meta_feed', label: 'Meta Feed' },
  { value: 'stories', label: 'Stories (9:16)' },
  { value: 'google_display', label: 'Google Display' },
  { value: 'ooh', label: 'OOH / Via pública' },
  { value: 'youtube', label: 'YouTube' },
]

const EDADES = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45+', label: '45+' },
]

const GENEROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
]

export default function ContextForm({ context, onChange }) {
  function set(field, value) {
    onChange({ ...context, [field]: value })
  }

  return (
    <div style={styles.form}>
      <p style={styles.label}>Contexto de campaña</p>
      <div style={styles.grid}>
        <Field label="Objetivo">
          <Select value={context.objetivo} onChange={v => set('objetivo', v)} options={OBJETIVOS} />
        </Field>

        <Field label="Plataforma">
          <Select value={context.plataforma} onChange={v => set('plataforma', v)} options={PLATAFORMAS} />
        </Field>

        <Field label="Sector / Industria">
          <input
            style={styles.input}
            type="text"
            placeholder="ej: moda, real estate, fintech..."
            value={context.sector}
            onChange={e => set('sector', e.target.value)}
          />
        </Field>

        <Field label="Edad target">
          <Select value={context.edad} onChange={v => set('edad', v)} options={EDADES} />
        </Field>

        <Field label="Género">
          <Select value={context.genero} onChange={v => set('genero', v)} options={GENEROS} />
        </Field>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select style={styles.select} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

const styles = {
  form: {
    background: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    border: '1px solid #2a2a2a',
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  fieldLabel: {
    color: '#aaa',
    fontSize: 13,
  },
  select: {
    background: '#111',
    color: '#f0f0f0',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 14,
    outline: 'none',
  },
  input: {
    background: '#111',
    color: '#f0f0f0',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 14,
    outline: 'none',
  },
}
