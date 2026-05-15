import base64
import json
import anthropic
from .base import BaseProvider


class ClaudeProvider(BaseProvider):
    def __init__(self):
        self._client = anthropic.Anthropic()

    def analyze(self, image_bytes: bytes, mime_type: str, prompt: str, image_url: str | None = None) -> dict:
        b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
        response = self._client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": mime_type, "data": b64}},
                    {"type": "text", "text": prompt},
                ],
            }],
        )
        return json.loads(response.content[0].text.strip())
