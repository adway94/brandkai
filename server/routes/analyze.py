import logging
import threading
import time
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.analyzer import analyze_image

router = APIRouter()
ALLOWED_MIMES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024
logger = logging.getLogger(__name__)

# job_id → {"status": "processing"|"done"|"error", "result": dict, "error": str, "created_at": float}
_jobs: dict[str, dict] = {}
_jobs_lock = threading.Lock()
_JOB_TTL = 3600


def _cleanup_old_jobs():
    now = time.time()
    with _jobs_lock:
        stale = [jid for jid, j in _jobs.items() if now - j["created_at"] > _JOB_TTL]
        for jid in stale:
            del _jobs[jid]


def _run_analysis(job_id: str, image_bytes: bytes, mime_type: str, context: dict):
    try:
        result = analyze_image(image_bytes, mime_type, context)
        with _jobs_lock:
            _jobs[job_id].update({"status": "done", "result": result})
    except Exception as e:
        logger.exception("Error en job %s", job_id)
        with _jobs_lock:
            _jobs[job_id].update({"status": "error", "error": str(e)})


@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    objetivo: str = Form("no especificado"),
    plataforma: str = Form("no especificada"),
    sector: str = Form("no especificado"),
    edad: str = Form("no especificada"),
    genero: str = Form("todos"),
):
    if file.content_type not in ALLOWED_MIMES:
        raise HTTPException(400, "Formato no soportado. Usá JPG, PNG, WEBP o GIF")
    image_bytes = await file.read()
    if len(image_bytes) > MAX_SIZE:
        raise HTTPException(400, "La imagen supera el límite de 5MB")

    context = dict(objetivo=objetivo, plataforma=plataforma, sector=sector, edad=edad, genero=genero)
    job_id = uuid.uuid4().hex

    _cleanup_old_jobs()
    with _jobs_lock:
        _jobs[job_id] = {"status": "processing", "created_at": time.time()}

    t = threading.Thread(target=_run_analysis, args=(job_id, image_bytes, file.content_type, context), daemon=True)
    t.start()

    return {"job_id": job_id}


@router.get("/result/{job_id}")
async def get_result(job_id: str):
    with _jobs_lock:
        job = _jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job no encontrado")
    if job["status"] == "processing":
        return {"status": "processing"}
    if job["status"] == "error":
        raise HTTPException(500, {"error": "Error al analizar la imagen", "detail": job["error"]})
    return {"status": "done", "result": job["result"]}
