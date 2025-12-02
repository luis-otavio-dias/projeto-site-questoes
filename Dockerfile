FROM python:3.13-slim-bookworm
LABEL mantainer="luis-otavio-dias"

COPY --from=ghcr.io/astral-sh/uv:latest  /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONUNBUFFERED=1 \
UV_COMPILE_BYTECODE=1 \
UV_LINK_MODE=copy \
UV_TOOL_BIN_DIR=/usr/local/bin \
UV_PROJECT_ENVIRONMENT="/opt/venv"


COPY backend /backend
COPY scripts /scripts
COPY backend/pyproject.toml backend/uv.lock ./

WORKDIR /backend

RUN uv sync --locked --no-dev

EXPOSE 8000

RUN apt-get update && \
  apt-get install -y --no-install-recommends libmagic1 file && \
  rm -rf /var/lib/apt/lists/* && \
  adduser --disabled-password --no-create-home duser && \
  mkdir -p /home/duser/.cache && \
  chown -R duser:duser /home/duser/.cache && \
  mkdir -p /data/web/static && \
  mkdir -p /data/web/media && \
  chown -R duser:duser /data/web/static && \
  chown -R duser:duser /data/web/media && \
  chmod -R 755 /data/web/static && \
  chmod -R 755 /data/web/media && \
  chmod -R +x /scripts && \
  chown -R duser:duser /opt/venv


ENV PATH="/scripts:/opt/venv/bin:$PATH"

USER duser

# Executa o arquivo scripts/commands.sh
CMD ["commands.sh"]