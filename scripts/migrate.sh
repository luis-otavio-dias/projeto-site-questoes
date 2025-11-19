#!/bin/sh
makemigrations.sh
echo 'Executando migrate.sh'
uv run manage.py migrate --noinput