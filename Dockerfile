FROM python:3.13-slim-bookworm
LABEL mantainer="luis-otavio-dias"

ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONUNBUFFERED=1

COPY djangoapp /djangoapp
COPY scripts /scripts

WORKDIR /djangoapp

# Instala uv 
COPY --from=ghcr.io/astral-sh/uv:latest  /uv /uvx /bin/

COPY djangoapp/requirements.txt /djangoapp

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

EXPOSE 8000

RUN uv pip install -r requirements.txt --system && \
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


# Adiciona a pasta scripts no $PATH do container.
ENV PATH="/scripts:/djangoapp/.venv/bin:$PATH"

USER duser

# Executa o arquivo scripts/commands.sh
CMD ["commands.sh"]