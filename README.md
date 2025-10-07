<h2 align="center">Plataforma de estudos personalizável</h2>

<!-- Badges/Shields: Use um site como https://shields.io/ para gerar os seus -->

<p align="center">
<img alt="Python" src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff">
<img alt="Django" src="https://img.shields.io/badge/Django-%23092E20.svg?logo=django&logoColor=white">
<img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff">
<img alt="React" src="https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)">
<img alt="Licença" src="https://img.shields.io/badge/License-MIT-black.svg">
<img alt="Status do Projeto" src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow">
</p>

O projeto consiste em um ambiente de estudos customizável, permitindo que o usuário adicione seu próprio banco de questões.
O banco de questões deve ser composto por questões de múltipla escolha, contendo obrigatoriamente:

  - Enunciado da questão
  - Alternativas
  - Alternativa correta
   
A plataforma importa o arquivo enviado, organiza o conteúdo em blocos de questões para facilitar a visualização. As questões podem ser acessadas e resolvidas.

Este é um projeto pessoal de estudos desenvolvido em Django, atualmente em desenvolvimento. Estou constantemente implementando novas funcionalidades e corrigindo falhas.

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
### Como rodar a aplicação localmente

**Executando a aplicação**  
O projeto é dividido em duas partes principais: o backend (Django) e o frontend (React). Ambos precisam ser executados simultaneamente.


**Executando o Backend com Docker**  

Com o Docker Desktop em execução, o comando irá construir a imagem do Docker (se ainda não tiver sido construída) e iniciar o serviço do backend em segundo plano:  
```
docker-compose up --build -d
```

O backend estará disponível em http://localhost:8000.
##
**Executando o Frontend com Vite**  

Navegue até a pasta `frontend`
```
cd frontend
```
Instale as dependências do Node.js:
```
npm install
(ou pnpm install / yarn install )
```
Inicie o servidor de desenvolvimento do React:
```
npm run dev
(ou pnpm dev / yarn dev )
```
A aplicação frontend estará acessível em `http://localhost:5173`. O Vite já está configurado para redirecionar as chamadas de API (/api) para o backend do Django que está rodando na porta 8000.

**Acessando a Aplicação**  
Após iniciar ambos os serviços, abra seu navegador e acesse:  
Frontend (Interface do Usuário): http://localhost:5173  
Backend (API): http://localhost:8000  
##

### Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações. 
