import json
import logging
import os
import time
import httpx
from .base import BaseProvider

logger = logging.getLogger(__name__)

_NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
_MODEL = "mistralai/mistral-large-3-675b-instruct-2512"
_RETRIES = 4
_RETRY_DELAYS = [5, 10, 20]  # seconds between attempts


class MistralProvider(BaseProvider):
    def requires_public_url(self) -> bool:
        return True

    def __init__(self):
        api_key = os.environ.get("NVIDIA_API_KEY")
        if not api_key:
            raise RuntimeError("NVIDIA_API_KEY no está configurada")
        self._headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
        }

    def analyze(self, image_bytes: bytes, mime_type: str, prompt: str, image_url: str | None = None) -> dict:
        if not image_url:
            raise ValueError("MistralProvider requiere image_url")
        payload = {
            "model": _MODEL,
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url}},
                    {"type": "text", "text": prompt},
                ],
            }],
            "max_tokens": 2048,
            "temperature": 0.15,
            "stream": False,
        }
        last_err = None
        for attempt in range(_RETRIES):
            try:
                response = httpx.post(_NVIDIA_URL, headers=self._headers, json=payload, timeout=180)
                if response.status_code >= 500:
                    logger.warning("NVIDIA intento %d — HTTP %d", attempt + 1, response.status_code)
                    last_err = f"HTTP {response.status_code}"
                else:
                    response.raise_for_status()
                    body = response.json()
                    if "choices" in body:
                        break
                    logger.warning("NVIDIA intento %d sin choices: %s", attempt + 1, body)
                    last_err = str(body)
            except httpx.TimeoutException:
                logger.warning("NVIDIA intento %d — timeout", attempt + 1)
                last_err = "timeout"

            if attempt < _RETRIES - 1:
                time.sleep(_RETRY_DELAYS[attempt])
        else:
            raise ValueError(f"NVIDIA API no respondió tras {_RETRIES} intentos: {last_err}")

        raw = body["choices"][0]["message"]["content"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
