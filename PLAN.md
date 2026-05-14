# BrandKai — Analizador de Creatividades con IA

## Qué es

Herramienta que analiza ads (imagen/video) usando Claude Vision y devuelve un diagnóstico estructurado con scores por dimensión, radar chart y recomendaciones accionables en lenguaje natural.

El activo central es el prompt de evaluación — define el framework de análisis basado en neuromarketing y best practices de plataformas.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + react-dropzone + Recharts + Axios |
| Backend | Flask + Flask-CORS |
| Uploads | python-multipart |
| IA | Claude API (`claude-sonnet-4-20250514`) + SDK `anthropic` |
| Video | opencv-python — extrae frame representativo |
| PDF | reportlab (fase 2) |
| ORM | Flask-SQLAlchemy + Alembic (fase 2) |
| Storage | Local / S3 (fase 2) |
| Contenedores | Docker + Docker Compose |

---

## Dimensiones de evaluación

Cada dimensión devuelve: `score` (1–10), `justificacion` (1 oración), `recomendacion` (acción concreta).

| # | Dimensión | Qué evalúa |
|---|-----------|-----------|
| 1 | **Hook visual** | ¿Detiene el scroll? Rostro, contraste, sorpresa, tensión |
| 2 | **Jerarquía visual** | Flujo del ojo: imagen → titular → CTA |
| 3 | **Legibilidad** | Tamaño texto, contraste, info density, lectura mobile |
| 4 | **CTA** | Existencia, claridad, posición, urgencia |
| 5 | **Emoción predominante** | Confianza / urgencia / aspiración / humor / FOMO |
| 6 | **Consistencia de marca** | Colores, tipografía, tono (requiere brand kit) |
| 7 | **Fit con formato** | Adaptación al placement (9:16, 1:1, banner, etc.) |

**Score general**: promedio ponderado (hook y CTA tienen mayor peso).

---

## Datos de contexto requeridos

Antes de analizar, el sistema pide contexto para que el análisis sea relevante y no genérico. Sin esto, Claude analiza el ad "en el vacío".

**Campos del formulario de análisis:**

| Campo | Opciones | Por qué importa |
|-------|----------|-----------------|
| Objetivo de campaña | Awareness / Tráfico / Conversión / Leads | Cambia cómo evaluar el CTA y la urgencia |
| Plataforma / Placement | Meta Feed, Stories, Google Display, OOH, YouTube | Define reglas de composición y formato |
| Industria / Sector | Texto libre | El tono correcto varía por industria |
| Rango etario target | 18–24, 25–34, 35–44, 45+ | Afecta legibilidad, referencias visuales |
| Género predominante | Todos, Femenino, Masculino | Opcional, solo si es relevante para la marca |

Con contexto, en vez de "el CTA es débil" el sistema puede decir:  
*"Para conversión en Meta Stories en el segmento 25–34, 'Más info' tiene tasa de respuesta ~40% menor que verbos de acción — probá 'Conseguilo hoy'."*

---

## Backoffice para agencias

Convierte la herramienta de un one-shot en una **plataforma**. Las agencias gestionan sus clientes desde un panel propio.

**Qué permite:**
- Cargar clientes con toda su información: brand kit, sector, audiencia tipo, historial de campañas
- Cada análisis nuevo tiene el contexto precargado — el consultor no completa nada
- Historial acumulado: "este es el tercer ad de este cliente, el anterior tuvo 6.2, este tiene 7.8 — mejoró el hook pero empeoró el CTA"
- Vista de evolución de calidad creativa por cliente en el tiempo
- Múltiples usuarios por agencia con roles (admin / analista)

**Estructura de datos:**

```
Agencia
  └── Clientes
        ├── Brand kit (colores, tipografía, tono)
        ├── Info (sector, audiencia, objetivos habituales)
        └── Análisis
              ├── Ad 1 → scores + recomendaciones
              ├── Ad 2 → scores + recomendaciones
              └── ...
```

**Cuándo construirlo:** después de validar el MVP. No antes. Primero que el output convenza, después que la plataforma escale.

---

## Flujo técnico

```
Usuario sube archivo + contexto (objetivo, plataforma, sector, audiencia)
    │
    ├─ imagen → base64 directo
    └─ video  → ffmpeg extrae frame en segundo 1 + frame al 50%
                     │
                     ▼
            Claude API (vision)
            prompt de evaluación + contexto → JSON estructurado
                     │
                     ▼
            Frontend renderiza:
            - Scores por dimensión
            - Radar chart (Recharts)
            - Recomendaciones en texto
            - (fase 2) PDF descargable
```

---

## Fases de desarrollo

### Fase 0 — MVP crudo (1 fin de semana)
**Objetivo**: validar que el output del prompt convence.

- [ ] Form web básico: sube imagen → muestra análisis crudo en pantalla
- [ ] Endpoint `POST /analyze` que manda a Claude y devuelve JSON
- [ ] Prompt v1 con las 7 dimensiones
- [ ] Display simple del JSON en el frontend
- **Sin**: PDF, radar chart, base de datos, auth

**Criterio de éxito**: mostrárselo a 2–3 consultores y que digan "esto es útil".

---

### Fase 1 — Demo-able (1–2 semanas post-validación)
**Objetivo**: producto que se puede mostrar en reunión de ventas.

- [ ] Radar chart visual con las 7 dimensiones (Recharts)
- [ ] UI pulida: drag & drop, loading state, cards por dimensión
- [ ] Soporte video (ffmpeg)
- [ ] Comparación A vs B (sube 2 creatividades)
- [ ] Selector de formato/placement (Story, Feed, Banner)

---

### Fase 2 — Producto vendible (2–3 semanas)
**Objetivo**: primeras ventas reales.

- [ ] PDF descargable del informe (PDFKit)
- [ ] Auth básica (JWT) + cuentas por agencia
- [ ] Brand kit: la agencia sube colores/tipografías de cada cliente
- [ ] Historial de análisis por cliente
- [ ] Límite de uso por plan (créditos)

---

### Fase 2.5 — Backoffice para agencias
**Objetivo**: convertir usuarios sueltos en cuentas de agencia retenidas.

- [ ] Panel de gestión de clientes (CRUD)
- [ ] Brand kit por cliente (colores hex, tipografía, tono)
- [ ] Contexto precargado por cliente (sector, audiencia, objetivos habituales)
- [ ] Dashboard de evolución de calidad creativa por cliente
- [ ] Roles: admin / analista por agencia

---

### Fase 3 — Escala (según tracción)
- [ ] White label: subdominio custom por agencia
- [ ] Reporte mensual automático de evolución de calidad
- [ ] API pública para integraciones
- [ ] Webhooks (Zapier, Make)

---

## Estructura de carpetas (MVP + backoffice)

```
brandkai/
├── client/                  # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadZone.jsx
│   │   │   ├── ContextForm.jsx      # objetivo, plataforma, sector, audiencia
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   └── RadarChart.jsx
│   │   ├── pages/
│   │   │   ├── Analyze.jsx
│   │   │   ├── Dashboard.jsx        # backoffice
│   │   │   ├── Clients.jsx
│   │   │   └── ClientDetail.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── nginx.conf               # sirve el build en producción
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── server/                  # Flask app
│   ├── routes/
│   │   ├── analyze.py
│   │   ├── clients.py               # fase 2
│   │   └── auth.py                  # fase 2
│   ├── services/
│   │   ├── claude_service.py
│   │   ├── video_service.py         # opencv
│   │   └── pdf_service.py           # fase 2
│   ├── prompts/
│   │   └── evaluation.py            # EL prompt — activo central
│   ├── models/                      # fase 2
│   │   ├── agency.py
│   │   ├── client.py
│   │   └── analysis.py
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── app.py
│   └── requirements.txt
├── docker-compose.yml           # orquesta backend + frontend (+ db en fase 2)
├── docker-compose.prod.yml      # overrides para producción
├── PLAN.md
└── .env
```

---

## Docker

Dos servicios en `docker-compose.yml`: `backend` (Flask) y `frontend` (React). En fase 2 se agrega `db` (PostgreSQL).

```yaml
# docker-compose.yml (dev)
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    volumes:
      - ./server:/app          # hot reload en dev
    env_file: .env

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app          # hot reload en dev
    depends_on:
      - backend
```

**Dev:** ambos contenedores con volúmenes montados para hot reload.  
**Prod:** `docker-compose.prod.yml` — React se buildea y sirve con Nginx, Flask corre con Gunicorn.

Un solo comando para levantar todo:
```bash
docker compose up
```

---

## Prompt v1 (borrador)

```
Sos un experto en efectividad publicitaria con conocimiento en neuromarketing, 
psicología del consumidor y best practices de Meta Ads, Google Display y OOH.

Analizá esta creatividad publicitaria y devolvé un JSON con exactamente esta estructura:

{
  "score_general": <número 0-100>,
  "formato_detectado": "<Story 9:16 | Feed 1:1 | Banner horizontal | Otro>",
  "emocion_predominante": "<confianza | urgencia | aspiración | humor | FOMO | otro>",
  "dimensiones": {
    "hook_visual": {
      "score": <1-10>,
      "justificacion": "<una oración>",
      "recomendacion": "<acción concreta>"
    },
    "jerarquia_visual": { ... },
    "legibilidad": { ... },
    "cta": { ... },
    "emocion": { ... },
    "consistencia_marca": { ... },
    "fit_formato": { ... }
  },
  "resumen_ejecutivo": "<2-3 oraciones con el diagnóstico principal>"
}

Criterios por dimensión:

HOOK VISUAL (peso: 20%)
Evaluá si el primer elemento visual detendría el scroll. Sumá puntos por:
- Rostro humano mirando a cámara: +2
- Contraste alto entre elemento principal y fondo: +2  
- Elemento inesperado, de curiosidad o tensión visual: +2
- Mínimo texto en zona superior: +2
- Movimiento implícito (líneas diagonales, acción congelada): +2

JERARQUÍA VISUAL (peso: 15%)
¿El ojo recorre el camino correcto: imagen principal → titular → CTA?
Penalizá si hay elementos que compiten entre sí o si el CTA está enterrado.

LEGIBILIDAD (peso: 15%)
Evaluá: tamaño de fuente legible en mobile (mínimo 14px equivalente), 
contraste texto/fondo (ratio mínimo 4.5:1), cantidad de información 
(máximo 7 palabras en titular), y claridad del mensaje principal.

CTA (peso: 20%)
¿Existe un CTA explícito? ¿Es específico ("Comprá ahora" > "Más info")?
¿Genera urgencia? ¿Está en posición visible (tercio inferior o zona de alta atención)?

EMOCIÓN (peso: 10%)
¿Hay una emoción dominante clara? ¿Es consistente con el tipo de producto/servicio?
Penalizá si la creatividad es emocionalmente ambigua o neutra.

CONSISTENCIA DE MARCA (peso: 10%)
Evaluá cohesión visual general. Si no hay brand kit provisto, evaluá 
consistencia interna de la pieza (¿los elementos visuales cuentan la misma historia?).

FIT CON FORMATO (peso: 10%)
¿La creatividad está bien adaptada para el formato detectado? 
Penalizá texto cortado, elementos en zonas muertas (esquinas en Stories), 
o composición diseñada para otro formato.

IMPORTANTE: Devolvé SOLO el JSON, sin texto adicional, sin markdown.
```

---

## Modelo de negocio

| Plan | Precio | Incluye |
|------|--------|---------|
| Por análisis | USD 5–15/ad | Sin suscripción, pago por uso |
| Agencia Starter | USD 99/mes | 50 análisis/mes, 3 usuarios |
| Agencia Pro | USD 199/mes | Ilimitado, brand kit, PDF, historial |
| White label | USD 399/mes | Subdominio custom, branding propio |

---

## Próximos pasos inmediatos

1. **Prompt v1** — refinar los criterios de evaluación y testear con 10 ads reales
2. **Backend MVP** — endpoint `/analyze` con Claude Vision
3. **Frontend MVP** — upload + display de resultados
4. **Test con consultores** — 2–3 personas reales, feedback crudo

---

## Preguntas abiertas

- ¿El análisis de video vale la pena en el MVP o empezamos solo con imágenes?
- ¿Precio por uso o freemium con límite mensual para adquisición?
- ¿Hay un vertical específico para atacar primero? (e-commerce, real estate, etc.)

---

## Modelos locales (exploración futura)

> **Prioridad baja** — solo evaluar una vez que el producto tenga tracción y el costo de API sea significativo.

La brecha de calidad entre modelos open source y Claude para análisis subjetivo y estructurado es real. Para validación del producto, Claude API es la opción correcta: lo que necesitamos saber es si el *framework de evaluación* convence, no si podemos ahorrar costos.

**Opciones viables cuando sea momento:**

| Modelo | Peso | Calidad visión | Setup |
|--------|------|----------------|-------|
| Llama 3.2 Vision 11B | ~7 GB | Buena | Ollama |
| Qwen2.5-VL 7B | ~5 GB | Muy buena (mejor relación calidad/peso) | Ollama |
| LLaVA 1.6 7B | ~5 GB | Aceptable | Ollama |
| Moondream 2 | ~1.8 GB | Básica — para prototipo rápido | Ollama |

**Candidato preferido cuando sea momento:** `Qwen2.5-VL 7B` — mejor balance calidad/peso del grupo.

**Criterio para migrar:** cuando el costo mensual de Claude API supere USD 200/mes o cuando haya necesidad de privacidad de datos (el ad no sale del servidor del cliente).
