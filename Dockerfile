FROM python:3.13-slim-bookworm
LABEL mantainer="luis-otavio-dias"

ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONUNBUFFERED=1 \
UV_LINK_MODE=copy


COPY backend /backend
COPY scripts /scripts

WORKDIR /backend


COPY --from=ghcr.io/astral-sh/uv:latest  /uv /uvx /bin/

EXPOSE 8000

RUN apt-get update && \
  apt-get install -y --no-install-recommends libmagic1 file && \
  rm -rf /var/lib/apt/lists/* && \
  uv sync --locked && \
  adduser --disabled-password --no-create-home duser && \
  mkdir -p /home/duser/.cache && \
  chown -R duser:duser /home/duser/.cache && \
  mkdir -p /data/web/static && \
  mkdir -p /data/web/media && \
  chown -R duser:duser /data/web/static && \
  chown -R duser:duser /data/web/media && \
  chmod -R 755 /data/web/static && \
  chmod -R 755 /data/web/media && \
  chmod -R +x /scripts


ENV PATH="/scripts:/backend/.venv/bin:$PATH"

USER duser

# Executa o arquivo scripts/commands.sh
CMD ["commands.sh"]