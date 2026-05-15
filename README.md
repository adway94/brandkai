# BrandKai

Analizador de creatividades publicitarias usando Claude Vision. Subís una imagen de un aviso, completás el contexto de campaña, y obtenés un diagnóstico estructurado con scores en 7 dimensiones, radar chart y recomendaciones concretas.

## Stack

- **Backend:** Python 3.12 + FastAPI + uvicorn
- **Frontend:** React 19 + Vite
- **AI:** Claude Sonnet 4.6 (Vision)
- **Infra:** Docker Compose + Cloudflare Tunnel

## Requisitos

- Docker y Docker Compose
- API key de Anthropic ([console.anthropic.com](https://console.anthropic.com))

## Instalación

```bash
git clone git@github.com:adway94/brandkai.git
cd brandkai

cp .env.example .env
# Editá .env y ponés tu ANTHROPIC_API_KEY

docker compose up --build
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`

## Uso

1. Arrastrá una imagen publicitaria (JPG, PNG, WEBP, GIF — máx. 5MB)
2. Completá el contexto: objetivo, plataforma, sector, audiencia
3. Clic en **Analizar creatividad**
4. Revisá el score general, radar chart y recomendaciones por dimensión

## Dimensiones de análisis

| Dimensión | Peso |
|-----------|------|
| Hook visual | 20% |
| CTA | 20% |
| Jerarquía visual | 15% |
| Legibilidad | 15% |
| Emoción | 10% |
| Consistencia de marca | 10% |
| Fit con formato | 10% |

## Estructura

```
brandkai/
├── server/
│   ├── app.py                  # FastAPI app
│   ├── routes/analyze.py       # POST /api/analyze
│   ├── services/claude_service.py
│   └── prompts/evaluation.py   # Prompt de análisis
├── client/
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── UploadZone.jsx
│           ├── ContextForm.jsx
│           ├── AnalysisResult.jsx
│           ├── ScoreCard.jsx
│           └── RadarChart.jsx
└── docker-compose.yml
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `ANTHROPIC_API_KEY` | API key de Anthropic (requerida) |
| `FLASK_ENV` | Entorno (`development` / `production`) |
