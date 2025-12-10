<h1 align="center">Plataforma de Estudos com IA</h1>

<div align="center">

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Available-2496ED?logo=docker&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-8E75B2?logo=google-bard&logoColor=white)

</div>

## Sobre o Projeto

O projeto é um ambiente de estudos personalizável e inteligente. A plataforma permite que o usuário construa seu próprio banco de questões a partir de arquivos **PDF** (Provas e Gabaritos) ou **CSV**.

O projeto utiliza **Inteligência Artificial (Google Gemini)** para ler arquivos de provas, identificar enunciados, alternativas, respostas corretas e até mesmo extrair e associar imagens às questões automaticamente.

## Funcionalidades Principais

* **Extração Inteligente com IA:** Upload de arquivos de prova e gabarito (PDF) com processamento automático via LangChain e Google Gemini para estruturar as questões.
* **Extração de Imagens:** O sistema identifica e recorta imagens presentes nas questões do PDF.
* **Importação via CSV:** Suporte para carga de questões em lote via arquivos CSV padronizados.
* **Simulado Interativo:** Interface moderna para resolução de questões com feedback imediato.
* **Gerenciamento de Usuário:** Autenticação completa (Login, Registro, Atualização de Perfil) via JWT armazenado em Cookies HTTP-Only.
* **Interface Moderna:** Frontend desenvolvido com React, TypeScript e Tailwind CSS, incluindo suporte a **Dark Mode**.

## Tecnologias Utilizadas

### Backend
* **Python 3.13** & **Django 5.1**
* **Django REST Framework** (API)
* **Google Generative AI (Gemini 2.5 Flash)** & **LangChain** (Processamento de IA)
* **PyMuPDF (Fitz)** & **Pillow** (Manipulação de PDF e Imagens)
* **uv** (Gerenciamento de dependências ultra-rápido)

### Frontend
* **React 19** & **Vite**
* **TypeScript**
* **Tailwind CSS** & **Shadcn/UI** (Estilização e Componentes)
* **Axios** & **React Router**

---

## Como Rodar o Projeto

### Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.
* Uma **API Key do Google Gemini** (para a funcionalidade de extração de questões).

### 1. Clonar o repositório

```bash
git clone https://github.com/luis-otavio-dias/projeto-site-questoes.git
cd projeto-site-questoes
```

### 2. Configurar Varíaveis de Ambiente  
Crie o arquivo `.env` baseado no exemplo fornecido na pasta `dotenv_files`.

```bash
cp dotenv_files/.env-example dotenv_files/.env
```

**Importante**: Edite o arquivo `dotenv_files/.env` e adicione sua chave API do Google:
```env
GOOGLE_API_KEY="SUA_CHAVE_API_DO_GOOGLE_GEMINI_AQUI"
```

### 3. Executando com Docker (Recomendado)
O projeto está totalmente configurado com Docker Compose. Para iniciar o backend e preparar o ambiente:
```bash
docker compose up --build
```
O comando acima irá:
  1. Construir a imagem do Backend.
  2. Instalar as dependências do sistema.
  3. Rodar as migrações do banco de dados.
  4. Coletar arquivos estáticos.
  5. Iniciar o servidor em ```http://localhost:8000```

Agora, pare o servidor com CTRL + C (ou inicie um novo terminal) e execute o comando a seguir para criar um superuser:
```bash
docker compose up -d
docker compose exec backend python manage.py createsuperuser
```

### 4. Executando o Frontend
Abra um novo terminal, navegue até a pasta do frontend e inicie o servidor de desenvolvimento:
```bash
cd frontend
npm install
npm run dev
```
A aplicação estará acessível em: http://localhost:5173

### Estrutura do Banco de Questões
Para o upload manual via CSV, o arquivo deve seguir o formato delimitado por `;`:
```csv
Ano;Temática;Enunciado;Alternativas;Resposta Correta
2024;História;Quem descobriu o Brasil?;A) Pedro Álvares Cabral | B) Colombo;A
```

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
