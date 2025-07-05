#!/bin/sh

# O shell irá encerrar a execução do script quando um comando falhar
set -e

collectstatic.sh
migrate.sh
runserver.sh
