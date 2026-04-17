# Documentação de Endpoints do Backend

## Visão Geral

Esta documentação descreve os endpoints expostos pelo backend Django em:

- /api/users/
- /api/questions/
- /api/schema/
- /api/schema/swagger-ui/
- /api/schema/redoc/
- /admin/

Base local padrão:

- http://localhost:8000

## Autenticação

A API utiliza JWT com cookies HTTP-only.

Fluxo principal:

1. Login em POST /api/users/login/.
2. Backend define cookies access_token e refresh_token.
3. Endpoints protegidos validam access_token via CookieJWTAuthentication.
4. Renovação com POST /api/users/refresh/ usando refresh_token em cookie.

Detalhes relevantes:

- access_token lifetime: 60 minutos.
- refresh_token lifetime: 7 dias.
- Cookies com httponly=True, secure=True e samesite=None.

## Resumo de Endpoints

| Domínio         | Método | Endpoint                          | Autenticação           |
| --------------- | ------ | --------------------------------- | ---------------------- |
| User/Auth       | POST   | /api/users/register/              | Pública                |
| User/Auth       | POST   | /api/users/login/                 | Pública                |
| User/Auth       | POST   | /api/users/logout/                | Usuário autenticado    |
| User/Auth       | POST   | /api/users/refresh/               | Cookie refresh_token   |
| User/Profile    | GET    | /api/users/me/profile/            | Usuário autenticado    |
| User/Profile    | PUT    | /api/users/me/profile/update/     | Usuário autenticado    |
| User/Upload     | POST   | /api/users/upload_file/           | Usuário autenticado    |
| Question/Admin  | GET    | /api/questions/                   | Admin                  |
| Question/Admin  | GET    | /api/questions/{id}/              | Admin                  |
| Exam/Extraction | POST   | /api/questions/upload-exam/       | Usuário autenticado    |
| Exam/Extraction | GET    | /api/questions/tasks/{id}/status/ | Usuário autenticado    |
| Exam            | GET    | /api/questions/exams/             | Usuário autenticado    |
| Exam            | GET    | /api/questions/exams/{id}/        | Usuário autenticado    |
| Técnico         | GET    | /api/schema/                      | Pública                |
| Técnico         | GET    | /api/schema/swagger-ui/           | Pública                |
| Técnico         | GET    | /api/schema/redoc/                | Pública                |
| Técnico/Admin   | GET    | /admin/                           | Sessão admin do Django |

## Endpoints de Usuário e Autenticação

### POST /api/users/register/

Cria um novo usuário.

Request body principal:

- email: string (obrigatório)
- password: string (obrigatório)

Resposta principal:

- 201 Created com dados do usuário criado (id, email)

Erros comuns:

- 400 Bad Request para validação (email inválido, email já existente, senha ausente)

### POST /api/users/login/

Autentica usuário e define cookies de sessão JWT.

Request body principal:

- email: string
- password: string

Resposta principal:

- 200 OK
- body:
  - user: objeto de usuário (id, email)
  - status: 200
- cookies definidos:
  - access_token
  - refresh_token

Erros comuns:

- 400 Bad Request com erro de credenciais inválidas

### POST /api/users/logout/

Invalida o refresh token (blacklist) e remove cookies de autenticação.

Autenticação:

- Requer usuário autenticado

Resposta principal:

- 200 OK com detail: Logout successful
- remove cookies access_token e refresh_token

Erros comuns:

- 400 Bad Request para token inválido na invalidação

### POST /api/users/refresh/

Gera novo access_token a partir do refresh_token presente em cookie.

Autenticação:

- Não exige access_token
- Exige refresh_token válido em cookie

Resposta principal:

- 200 OK com message: Token refreshed successfully
- atualiza cookies access_token e refresh_token

Erros comuns:

- 401 Unauthorized quando refresh token não é enviado
- 401 Unauthorized quando refresh token é inválido

## Endpoints de Perfil

### GET /api/users/me/profile/

Retorna perfil do usuário autenticado.

Autenticação:

- Requer usuário autenticado

Resposta principal:

- 200 OK com:
  - id
  - email

### PUT /api/users/me/profile/update/

Atualiza dados do usuário autenticado.

Autenticação:

- Requer usuário autenticado

Request body principal:

- email: string (obrigatório)
- password: string (opcional; se vazio, senha não é alterada)

Resposta principal:

- 200 OK com dados do usuário (id, email)

Erros comuns:

- 400 Bad Request para dados inválidos

## Endpoint de Upload de Arquivo

### POST /api/users/upload_file/

Realiza upload de arquivo (CSV ou PDF), associa ao usuário e dispara processamento de questões para CSV.

Autenticação:

- Requer usuário autenticado

Request body principal (multipart/form-data):

- title: string (opcional)
- file_upload: arquivo (obrigatório)
- file_type: string (opcional; normalmente preenchido automaticamente)

Validação de arquivo:

- MIME aceitos: text/csv, text/plain (com conteúdo de CSV), application/pdf
- Para text/plain, deve conter delimitador CSV (virgula, ponto e virgula ou tab)

Resposta principal:

- 201 Created com:
  - id
  - title
  - file_type
  - file_upload

Erros comuns:

- 400 Bad Request para tipo/formato de arquivo inválido

## Endpoints de Questões (Admin)

### GET /api/questions/

Lista todas as questões cadastradas.

Autenticação:

- Requer permissão de admin (IsAdminUser)

Resposta principal:

- 200 OK com lista de questões
- campos por item:
  - area
  - topic
  - question_id
  - id
  - name
  - passage_text
  - sources
  - has_image
  - stem
  - options
  - correct_answer
  - images

### GET /api/questions/{id}/

Retorna detalhes de uma questão específica.

Autenticação:

- Requer permissão de admin (IsAdminUser)

Parâmetros de rota:

- id: inteiro

Resposta principal:

- 200 OK com os mesmos campos de Question

Erros comuns:

- 404 Not Found para id inexistente

Observação técnica:

- A URL usa id, mas a função da view recebe \_id. Essa inconsistência pode afetar o comportamento do endpoint até ajuste no código.

## Endpoints de Extração de Exame

### POST /api/questions/upload-exam/

Cria tarefa de extração de exame para processamento assíncrono.

Autenticação:

- Requer usuário autenticado

Request body principal (multipart/form-data):

- exam_file: arquivo (obrigatório)
- answer_key_file: arquivo (opcional)
- title: string (opcional)
- description: string (opcional)

Resposta principal:

- 201 Created com:
  - id
  - status (PENDING inicial)
  - exam_file
  - answer_key_file
  - title
  - description
  - created_at

### GET /api/questions/tasks/{id}/status/

Consulta status de uma tarefa de extração.

Autenticação:

- Requer usuário autenticado
- Escopo por usuário: só retorna tarefas do usuário logado

Parâmetros de rota:

- id: inteiro (id da tarefa)

Resposta principal:

- 200 OK com os mesmos campos do serializer de task:
  - id
  - status
  - exam_file
  - answer_key_file
  - title
  - description
  - created_at

Erros comuns:

- 404 Not Found se a tarefa não existir ou não pertencer ao usuário autenticado

## Endpoints de Exames

### GET /api/questions/exams/

Lista exames do usuário autenticado, incluindo questões relacionadas.

Autenticação:

- Requer usuário autenticado

Resposta principal:

- 200 OK com lista de exames
- campos por exame:
  - id
  - name_base
  - name_sigle
  - variant
  - year
  - style
  - questions (lista de questões)

### GET /api/questions/exams/{id}/

Retorna um exame específico do usuário autenticado com suas questões.

Autenticação:

- Requer usuário autenticado
- Escopo por usuário: só acessa exame do próprio usuário

Parâmetros de rota:

- id: inteiro

Resposta principal:

- 200 OK com o objeto de exame e questions aninhadas

Erros comuns:

- 404 Not Found se o exame não existir ou não pertencer ao usuário

## Endpoints Técnicos

### GET /api/schema/

Retorna schema OpenAPI da API (drf-spectacular).

Uso principal:

- Integração técnica
- Geração de documentação e clients

### GET /api/schema/swagger-ui/

Interface Swagger UI para explorar e testar endpoints.

### GET /api/schema/redoc/

Interface ReDoc para visualização do schema.

### GET /admin/

Painel administrativo padrão do Django.

Observação:

- Exige autenticação por sessão de admin no Django.

## Notas de Implementação Atual

- Autenticação padrão do DRF configurada para CookieJWTAuthentication.
- Endpoints de listagem/detalhe de exames e status de task aplicam filtro por usuário autenticado.
- Endpoint de upload de arquivo em User aciona processamento de CSV após persistência do arquivo.
- Endpoint de extração de exame cria task com status inicial PENDING.
