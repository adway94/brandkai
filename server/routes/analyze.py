from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.claude_service import analyze_image

router = APIRouter()
ALLOWED_MIMES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024


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
    try:
        return analyze_image(image_bytes, file.content_type, context)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, {"error": "Error al analizar la imagen", "detail": str(e)})
