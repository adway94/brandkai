import { useState } from 'react'
import axios from 'axios'
import UploadZone from './components/UploadZone'
import ContextForm from './components/ContextForm'
import AnalysisResult from './components/AnalysisResult'

const INITIAL_CONTEXT = {
  objetivo: 'conversion',
  plataforma: 'meta_feed',
  sector: '',
  edad: '25-34',
  genero: 'todos',
}

export default function App() {
  const [image, setImage] = useState(null)       // { file, preview }
  const [context, setContext] = useState(INITIAL_CONTEXT)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    if (!image) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', image.file)
    Object.entries(context).forEach(([k, v]) => formData.append(k, v))

    try {
      const { data } = await axios.post('/api/analyze', formData)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>BrandKai</h1>
        <p style={styles.tagline}>Analizador de creatividades publicitarias</p>
      </header>

      <main style={styles.main}>
        <div style={styles.inputSection}>
          <UploadZone image={image} onImageChange={setImage} />
          <ContextForm context={context} onChange={setContext} />

          <button
            style={{
              ...styles.analyzeBtn,
              opacity: !image || loading ? 0.5 : 1,
              cursor: !image || loading ? 'not-allowed' : 'pointer',
            }}
            onClick={handleAnalyze}
            disabled={!image || loading}
          >
            {loading ? 'Analizando...' : 'Analizar creatividad'}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Claude está analizando tu creatividad...</p>
          </div>
        )}

        {result && <AnalysisResult result={result} imagePreview={image?.preview} />}
      </main>
    </div>
  )
}

const styles = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: -1,
    color: '#fff',
  },
  tagline: {
    color: '#888',
    marginTop: 4,
    fontSize: 15,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  analyzeBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px 28px',
    fontSize: 16,
    fontWeight: 700,
    transition: 'background 0.2s',
    alignSelf: 'flex-start',
  },
  error: {
    color: '#f87171',
    fontSize: 14,
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: 40,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #333',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#888',
    fontSize: 15,
  },
}
