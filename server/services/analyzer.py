import os
import threading
import uuid
from functools import lru_cache
from pathlib import Path
from prompts.evaluation import build_prompt
from services.providers.base import BaseProvider

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

_EXT_MAP = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}


@lru_cache(maxsize=1)
def _get_provider() -> BaseProvider:
    provider = os.environ.get("AI_PROVIDER", "claude").lower()
    if provider == "mistral":
        from services.providers.mistral import MistralProvider
        return MistralProvider()
    from services.providers.claude import ClaudeProvider
    return ClaudeProvider()


def _ttl_minutes() -> int:
    return int(os.environ.get("IMAGE_TTL_MINUTES", "10"))


def _delete_after(path: Path, minutes: int):
    threading.Timer(minutes * 60, lambda: path.unlink(missing_ok=True)).start()


def analyze_image(image_bytes: bytes, mime_type: str, context: dict) -> dict:
    if mime_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Tipo de imagen no soportado: {mime_type}")

    provider = _get_provider()
    prompt = build_prompt(context)
    image_url = None

    if provider.requires_public_url():
        ext = _EXT_MAP.get(mime_type, ".jpg")
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = UPLOADS_DIR / filename
        filepath.write_bytes(image_bytes)

        base_url = os.environ.get("PUBLIC_BASE_URL", "https://brandkai.amachulsky.com")
        image_url = f"{base_url}/image/{filename}"

        _delete_after(filepath, _ttl_minutes())

    return provider.analyze(image_bytes, mime_type, prompt, image_url=image_url)
