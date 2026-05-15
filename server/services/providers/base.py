from abc import ABC, abstractmethod


class BaseProvider(ABC):
    def requires_public_url(self) -> bool:
        return False

    @abstractmethod
    def analyze(self, image_bytes: bytes, mime_type: str, prompt: str, image_url: str | None = None) -> dict:
        ...
