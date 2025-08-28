<h2 align="center">Plataforma de estudos personalizável</h2>

<!-- Badges/Shields: Use um site como https://shields.io/ para gerar os seus -->

<p align="center">
<img alt="Python" src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff">
<img alt="Django" src="https://img.shields.io/badge/Django-%23092E20.svg?logo=django&logoColor=white">
<img alt="Status do Projeto" src="https://img.shields.io/badge/License-MIT-black.svg">
<img alt="Status do Projeto" src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow">
</p>

O projeto consiste em um ambiente de estudos customizável, permitindo que o usuário adicione seu próprio banco de questões.
O banco de questões deve ser composto por questões de múltipla escolha, contendo obrigatoriamente:

  - Enunciado da questão
  - Alternativas
  - Alternativa correta
   
A plataforma importa o arquivo enviado, organiza o conteúdo em blocos de questões para facilitar a visualização. As questões podem ser acessadas e resolvidas.

Este é um projeto pessoal de estudos desenvolvido em Django, atualmente em desenvolvimento. Estou constantemente implementando novas funcionalidades e corrigindo falhas.

Na raiz do projeto existe o arquivo ``todo.md``  que me auxilia a acompanhar o progresso do desenvolvimento, nele registro:
  - Alterações realizadas
  - Pontos de melhoria
  - Bugs identificados

## Como rodar o projeto localmente

**Pré-requisitos**: 
 - Docker Desktop

### Instalação 

1. Clone o repositório
``` 
git clone https://github.com/luis-otavio-dias/projeto-site-questoes.git
cd projeto-site-questoes
```
  - Crie o arquivo de varíaveis ambiente
    
    ```
    cd dotenv_files
    cp .env-example .env
    ```
    
2. Ajuste as varíaveis em  `.env`
   
  - Abra o arquivo e faça as seguintes alterações
  
    ```
    SECRET_KEY=escolha-uma-cahve-forte
    DEBUG="1"
    ALLOWED_HOSTS="127.0.0.1,localhost"
    DB_ENGINE="django.db.backends.sqlite3"
    DB_NAME="db.sqlite"
    ```
##
### Como usar

**Executando a aplicação**

Com o Docker Desktop instalado e aberto, o arquivo .env configurado, execute na raiz do projeto:

```
docker-compose up --build -d
```
Após finalizar o processo de build, execute:

```
docker-compose up
```

A aplicação estará disponível em http://localhost:8000.
##

### Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações. 