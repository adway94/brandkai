import base64
import json
import anthropic
from prompts.evaluation import build_prompt

_client = anthropic.Anthropic()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def analyze_image(image_bytes: bytes, mime_type: str, context: dict) -> dict:
    if mime_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Tipo de imagen no soportado: {mime_type}")

    b64_data = base64.standard_b64encode(image_bytes).decode("utf-8")
    prompt = build_prompt(context)

    response = _client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": mime_type,
                            "data": b64_data,
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )

    raw = response.content[0].text.strip()
    return json.loads(raw)
