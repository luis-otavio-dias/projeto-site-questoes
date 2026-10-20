# Backend

API Django do Projeto Site Questões.

Para executar localmente, neste diretório:

```sh
uv sync
uv run manage.py migrate
uv run manage.py runserver
```

Para executar com Docker, neste diretório:

```sh
docker compose up --build
```

O container executa migrações, coleta os arquivos estáticos e inicia o servidor
de desenvolvimento na porta 8000. Configure as variáveis de ambiente em
`.env` neste diretório (use `.env-example` como base).
