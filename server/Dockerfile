FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .

ENV PYTHONUNBUFFERED=1

CMD [".venv/bin/uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
