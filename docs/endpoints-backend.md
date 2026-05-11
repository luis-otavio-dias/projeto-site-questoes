# Documentação de Endpoints do Backend

## Visão Geral

Esta documentação descreve os endpoints expostos pelo backend Django em:

- `/api/users/`
- `/api/questions/`
- `/api/schema/`
- `/api/schema/swagger-ui/`
- `/api/schema/redoc/`
- `/admin/`

**Base local padrão:**
`http://localhost:8000`

---

## Autenticação

A API utiliza JWT com cookies HTTP-only.

**Fluxo principal:**

1. Login em `POST /api/users/login/`.
2. Backend define os cookies `access_token` e `refresh_token`.
3. Endpoints protegidos validam o `access_token` via `CookieJWTAuthentication`.
4. Renovação feita em `POST /api/users/refresh/` usando o `refresh_token` armazenado no cookie.

**Detalhes relevantes:**

- **`access_token` lifetime:** 60 minutos.
- **`refresh_token` lifetime:** 7 dias.
- **Configurações de Cookie:** `httponly=True`, `secure=True` e `samesite=None`.

---

## Resumo de Endpoints

| Domínio         | Método | Endpoint                            | Autenticação           |
| --------------- | ------ | ----------------------------------- | ---------------------- |
| User/Auth       | POST   | `/api/users/register/`              | Pública                |
| User/Auth       | POST   | `/api/users/login/`                 | Pública                |
| User/Auth       | POST   | `/api/users/logout/`                | Usuário autenticado    |
| User/Auth       | POST   | `/api/users/refresh/`               | Cookie `refresh_token` |
| User/Profile    | GET    | `/api/users/me/profile/`            | Usuário autenticado    |
| User/Profile    | PUT    | `/api/users/me/profile/update/`     | Usuário autenticado    |
| User/Upload     | POST   | `/api/users/upload_file/`           | Usuário autenticado    |
| Question/Admin  | GET    | `/api/questions/`                   | Admin                  |
| Question/Admin  | GET    | `/api/questions/{id}/`              | Admin                  |
| Exam/Extraction | POST   | `/api/questions/upload-exam/`       | Usuário autenticado    |
| Exam/Extraction | GET    | `/api/questions/tasks/{id}/status/` | Usuário autenticado    |
| Exam            | GET    | `/api/questions/exams/`             | Usuário autenticado    |
| Exam            | GET    | `/api/questions/exams/{id}/`        | Usuário autenticado    |
| Técnico         | GET    | `/api/schema/`                      | Pública                |
| Técnico         | GET    | `/api/schema/swagger-ui/`           | Pública                |
| Técnico         | GET    | `/api/schema/redoc/`                | Pública                |
| Técnico/Admin   | GET    | `/admin/`                           | Sessão admin do Django |

---

## Endpoints de Usuário e Autenticação

### `POST` /api/users/register/

Cria um novo usuário.

- **Autenticação:** Pública
- **Request Body (JSON):**
  | Campo | Tipo | Obrigatório |
  | --- | --- | --- |
  | `email` | string | Sim |
  | `password` | string | Sim |
- **Resposta de Sucesso:** - `201 Created`: Retorna os dados do usuário criado (`id`, `email`).
- **Erros Comuns:** - `400 Bad Request`: Falha de validação (e-mail inválido, e-mail já existente, senha ausente).

### `POST` /api/users/login/

Autentica o usuário e define os cookies de sessão JWT.

- **Autenticação:** Pública
- **Request Body (JSON):**
  | Campo | Tipo | Obrigatório |
  | --- | --- | --- |
  | `email` | string | Sim |
  | `password` | string | Sim |
- **Resposta de Sucesso:**
  - `200 OK`: Retorna o objeto `user` (`id`, `email`) e `status`.
  - **Cookies definidos:** `access_token` e `refresh_token`.
- **Erros Comuns:**
  - `400 Bad Request`: Credenciais inválidas.

### `POST` /api/users/logout/

Invalida o refresh token (blacklist) e remove os cookies de autenticação.

- **Autenticação:** Requer usuário autenticado
- **Resposta de Sucesso:**
  - `200 OK`: Retorna a mensagem `{"detail": "Logout successful"}`.
  - **Ação:** Remove os cookies `access_token` e `refresh_token`.
- **Erros Comuns:**
  - `400 Bad Request`: Token inválido na invalidação.

### `POST` /api/users/refresh/

Gera um novo `access_token` a partir do `refresh_token` presente no cookie.

- **Autenticação:** Exige `refresh_token` válido no cookie (não exige `access_token`).
- **Resposta de Sucesso:**
  - `200 OK`: Retorna a mensagem `{"message": "Token refreshed successfully"}`.
  - **Ação:** Atualiza os cookies `access_token` e `refresh_token`.
- **Erros Comuns:**
  - `401 Unauthorized`: `refresh_token` não enviado ou inválido.

---

## Endpoints de Perfil

### `GET` /api/users/me/profile/

Retorna o perfil do usuário autenticado.

- **Autenticação:** Requer usuário autenticado
- **Resposta de Sucesso:**
  - `200 OK`: Retorna o objeto do usuário (`id` inteiro, `email` string).

### `PUT` /api/users/me/profile/update/

Atualiza os dados do usuário autenticado.

- **Autenticação:** Requer usuário autenticado
- **Request Body (JSON):**
  | Campo | Tipo | Obrigatório | Observação |
  | --- | --- | --- | --- |
  | `email` | string | Sim | |
  | `password` | string | Não | Se vazio, a senha não é alterada. |
- **Resposta de Sucesso:**
  - `200 OK`: Retorna os dados atualizados (`id`, `email`).
- **Erros Comuns:**
  - `400 Bad Request`: Dados inválidos.

---

## Endpoint de Upload de Arquivo

### `POST` /api/users/upload_file/

Realiza o upload de um arquivo (CSV ou PDF), associa ao usuário e dispara o processamento de questões caso seja um CSV.

- **Autenticação:** Requer usuário autenticado
- **Request Body (`multipart/form-data`):**
  | Campo | Tipo | Obrigatório |
  | --- | --- | --- |
  | `title` | string | Não |
  | `file_upload` | arquivo | Sim |
  | `file_type` | string | Não |
- **Validação de Arquivo:**
  - MIME types aceitos: `text/csv`, `text/plain` (com conteúdo de CSV), `application/pdf`.
  - Arquivos `text/plain` devem conter um delimitador CSV válido (vírgula, ponto e vírgula ou tabulação).
- **Resposta de Sucesso:**
  - `201 Created`: Retorna `id`, `title`, `file_type` e a URL de `file_upload`.
- **Erros Comuns:**
  - `400 Bad Request`: Tipo ou formato de arquivo inválido.

---

## Endpoints de Questões (Admin)

### `GET` /api/questions/

Lista todas as questões cadastradas.

- **Autenticação:** Requer permissão de admin (`IsAdminUser`)
- **Resposta de Sucesso:**
  - `200 OK`: Retorna uma lista de objetos de questões contendo os campos: `id`, `question_id`, `area`, `topic`, `name`, `passage_text`, `sources`, `has_image`, `stem`, `options`, `correct_answer` e `images`.

### `GET` /api/questions/{id}/

Retorna os detalhes de uma questão específica.

- **Autenticação:** Requer permissão de admin (`IsAdminUser`)
- **Parâmetros de Rota:** `id` (inteiro)
- **Resposta de Sucesso:**
  - `200 OK`: Retorna o objeto da questão com os mesmos campos da listagem.
- **Erros Comuns:**
  - `404 Not Found`: ID inexistente.
- **Observação técnica:** A URL utiliza `id`, mas a view pode estar aguardando `_id` internamente, o que pode afetar o comportamento até que seja ajustado.

---

## Endpoints de Extração de Exame

### `POST` /api/questions/upload-exam/

Cria uma tarefa de extração de exame para processamento assíncrono.

- **Autenticação:** Requer usuário autenticado
- **Request Body (`multipart/form-data`):**
  | Campo | Tipo | Obrigatório |
  | --- | --- | --- |
  | `exam_file` | arquivo | Sim |
  | `answer_key_file` | arquivo | Não |
  | `title` | string | Não |
  | `description` | string | Não |
- **Resposta de Sucesso:**
  - `201 Created`: Retorna os dados da tarefa (`id`, `status` inicializado como `PENDING`, `exam_file`, `answer_key_file`, `title`, `description`, `created_at`).

### `GET` /api/questions/tasks/{id}/status/

Consulta o status de uma tarefa de extração específica.

- **Autenticação:** Requer usuário autenticado (escopo restrito ao próprio usuário)
- **Parâmetros de Rota:** `id` (inteiro da tarefa)
- **Resposta de Sucesso:**
  - `200 OK`: Retorna os dados da tarefa (`id`, `status`, `exam_file`, `answer_key_file`, `title`, `description`, `created_at`).
- **Erros Comuns:**
  - `404 Not Found`: A tarefa não existe ou não pertence ao usuário autenticado.

---

## Endpoints de Exames

### `GET` /api/questions/exams/

Lista os exames do usuário autenticado, incluindo as questões relacionadas.

- **Autenticação:** Requer usuário autenticado
- **Resposta de Sucesso:**
  - `200 OK`: Retorna uma lista de exames com os campos `id`, `name_base`, `name_sigle`, `variant`, `year`, `style` e `questions` (lista de questões aninhadas).

### `GET` /api/questions/exams/{id}/

Retorna um exame específico do usuário autenticado, junto com suas questões.

- **Autenticação:** Requer usuário autenticado (escopo restrito ao próprio usuário)
- **Parâmetros de Rota:** `id` (inteiro)
- **Resposta de Sucesso:**
  - `200 OK`: Retorna o objeto do exame e as `questions` aninhadas.
- **Erros Comuns:**
  - `404 Not Found`: O exame não existe ou não pertence ao usuário.

---

## Endpoints Técnicos

### `GET` /api/schema/

Retorna o schema OpenAPI da API (gerado pelo `drf-spectacular`). Utilizado principalmente para integração técnica, geração de documentação e criação de clients automáticos.

### `GET` /api/schema/swagger-ui/

Disponibiliza a interface Swagger UI para explorar e testar os endpoints interativamente.

### `GET` /api/schema/redoc/

Disponibiliza a interface ReDoc para visualização estática e amigável do schema OpenAPI.

### `GET` /admin/

Painel administrativo padrão do Django.

- **Observação:** Exige autenticação através da sessão de admin padrão do Django.

---

## Notas de Implementação Atual

- A autenticação padrão do DRF está configurada para utilizar `CookieJWTAuthentication`.
- Os endpoints de listagem/detalhe de exames e status de tarefas aplicam filtros automáticos baseados no usuário autenticado no request.
- O endpoint de upload de arquivo no módulo de `User` possui um gatilho que aciona o processamento de questões caso o arquivo seja um CSV validado.
- O endpoint de extração de exame cria a tarefa no banco com o status inicial fixado em `PENDING`.
