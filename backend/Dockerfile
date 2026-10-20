# syntax=docker/dockerfile:1
FROM ghcr.io/astral-sh/uv:0.9.17-trixie-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \
  UV_LINK_MODE=copy \
  UV_PYTHON_PREFERENCE=only-managed \
  UV_NO_DEV=1 \
  UV_PYTHON_INSTALL_DIR=/python \
  UV_PROJECT_ENVIRONMENT=/opt/venv \
  UV_PYTHON=3.13

RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN uv python install 3.13

WORKDIR /backend

RUN --mount=type=cache,target=/root/.cache/uv \
  --mount=type=bind,source=uv.lock,target=uv.lock \
  --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
  uv sync --frozen --no-install-project

COPY . /backend/

RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --frozen

################################################################################

FROM debian:trixie-slim AS development

ENV PYTHONUNBUFFERED=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PATH="/opt/venv/bin:${PATH}"

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates libmagic1t64 \
  && update-ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1000 duser \
  && useradd --uid 1000 --gid duser --shell /bin/bash --create-home duser \
  && mkdir -p /data/web/static /data/web/media \
  && chown -R duser:duser /data/web


COPY --from=builder --chown=duser:duser /python /python
COPY --from=builder --chown=duser:duser /opt/venv /opt/venv
COPY --from=builder --chown=duser:duser /backend /backend
COPY --chown=duser:duser --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh

USER duser
WORKDIR /backend
EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
