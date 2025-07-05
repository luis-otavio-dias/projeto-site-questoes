FROM python:3.13-slim-bookworm
LABEL mantainer="luis-otavio-dias"

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

# Copia a pasta "djangoapp" e "scripts" para dentro   do container.
COPY djangoapp /djangoap
COPY uv_files /djangoapp/uv_files
COPY scripts /scripts

WORKDIR /djangoapp
# Instala uv 
COPY --from=ghcr.io/astral-sh/uv:0.7.8 /uv /uvx /bin/

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

EXPOSE 8000

RUN cd uv_files && \
  uv sync --locked --no-dev && \
  cd .. &&\
  adduser --disabled-password --no-create-home duser && \
  mkdir -p /data/web/static && \
  mkdir -p /data/web/media && \
  chown -R duser:duser /djangoapp/uv_files/.venv && \
  chown -R duser:duser /data/web/static && \
  chown -R duser:duser /data/web/media && \
  chmod -R 755 /usr/local && \
  chmod -R 755 /data/web/static && \
  chmod -R 755 /data/web/media && \
  chmod -R +x /scripts


# Adiciona a pasta scripts no $PATH do container.
ENV PATH="/scripts:/djangoapp/uv_files/.venv/bin:$PATH"

ENV PATH=/root/.local/bin:$PATH

RUN uv tool install cowsay

ENTRYPOINT []

USER duser

# Executa o arquivo scripts/commands.sh
CMD ["commands.sh"]