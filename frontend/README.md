# Questio — frontend React

As telas da direção Stitch de `design-exploration` foram migradas para componentes React com TypeScript. A aplicação usa fundo claro, superfícies brancas, ações azuis e navegação lateral escura; envio de prova abre um modal sobre a tela atual.

A referência visual continua em [design-exploration/DESIGN.md](../design-exploration/DESIGN.md), que documenta a demo aprovada, e o inventário original está em [PLANO-PROXIMAS-TELAS.md](../design-exploration/PLANO-PROXIMAS-TELAS.md). O frontend herda `src/styles/stitch.css`; as adaptações React estão em `src/styles/questio.css`, incluindo foco e espaçamento móvel. A documentação da demo conserva valores e comportamentos daquele protótipo e não substitui o contrato de integração descrito abaixo. `PRODUCT.md` continua ausente; esta migração preserva a direção existente, sem estabelecer uma nova identidade visual.

## Executar

Com Node.js 22.18+ e o backend na porta 8000:

```bash
cd frontend
npm ci
npm run dev
```

O Vite encaminha `/api` e `/media` para `http://127.0.0.1:8000`. Para outro destino de desenvolvimento:

```bash
QUESTIO_API_PROXY=http://127.0.0.1:8000 npm run dev
```

A autenticação usa os cookies HTTP-only do backend. Não é necessário configurar um token em variável `VITE_*`. Em produção, configure o servidor para encaminhar `/api` e `/media` ao backend e servir `index.html` nas demais rotas da aplicação. A política de cookies e HTTPS deve ser compatível com a configuração do backend.

## Telas

| Rota | Experiência |
| --- | --- |
| `/` | Visão geral, primeiro acesso, retomada e resumo do estudo. |
| `/login`, `/register` | Entrada e cadastro reais, com retorno ao destino solicitado. |
| `/recuperar`, `/redefinir` | Estados de recuperação indisponível, sem simular envio de e-mail ou troca de senha. |
| `/conta` | Consulta da conta e atualização real de e-mail/senha. Saída pelo menu da conta. |
| `/biblioteca` | Cadernos, busca por nome/matéria/ano, filtros de ano/situação e favoritos. |
| `/caderno/:examId` | Detalhe, índice, progresso, retomada, revisão e simulado com o caderno pré-selecionado. |
| `/caderno/:examId/questao/:questionId` | Treino com conferência imediata, imagens, índice e anotações. |
| `/caderno/:examId/revisar/:questionId` | Editor de texto-base, pergunta, alternativas e gabarito, com proteção contra perda de ajustes. |
| `/banco` | Consulta das questões de diferentes cadernos, filtros, prévia e seleção para simulado. |
| `/simulados`, `/simulados/novo` | Lista, rascunhos, seleção, revisão da seleção e duração opcional. |
| `/simulado/:simulationId` | Resolução sem correção antecipada, marcação de revisão, relógio e entrega. |
| `/resultado/:simulationId` | Resultado da tentativa, tempo, acertos/erros, respostas ausentes/sem correção e revisão detalhada. |
| `/desempenho`, `/historico` | Métricas com base absoluta, amostra, atividade diária e conferências/tentativas individuais. |
| `/importacoes`, `/importacao/:taskId` | Histórico dos envios iniciados neste navegador e consulta real de status. |
| `/enviar`, `/upload_file` | Acesso direto que abre o modal de envio sobre o painel. |

As rotas anteriores `/profile` e `/questions/:id` têm compatibilidade com conta e resolução. Uma questão sem identificação inequívoca do caderno não abre um material arbitrário. Links inexistentes mostram um estado próprio.

## Integração existente

- `POST /api/users/register/`, `POST /api/users/login/`, `POST /api/users/refresh/` e `POST /api/users/logout/`.
- `GET /api/users/me/profile/` e `PUT /api/users/me/profile/update/`; perfil usa e-mail, sem nome/token inexistentes no serializer.
- `GET /api/questions/exams/` e `GET /api/questions/exams/:id/`, com adaptação dos campos `name_base`, `year`, `passage_text`, `stem`, `options`, `correct_answer` e imagens.
- `POST /api/questions/upload-exam/` com multipart, prova em PDF, gabarito opcional e sem `auto_correction`.
- `GET /api/questions/tasks/:id/status/` com consulta em segundo plano, recuperação de falha de consulta e distinção de falha efetiva da preparação.

A renovação de sessão é compartilhada entre requisições simultâneas e tenta cada requisição protegida novamente uma única vez. Reconhece tanto 401 quanto as respostas 403 de autenticação produzidas pelo `CookieJWTAuthentication`; uma negação de permissão comum não é tratada como sessão expirada.

## Recursos locais e limites

Treino, favoritos, anotações, revisões, simulados e histórico de atividade usam `localStorage`, separado pelo ID da conta. Esses dados não são enviados ao servidor nem sincronizados entre navegadores/dispositivos. Se o navegador bloquear a gravação, a interface avisa que o estado daquela sessão não será preservado. Nenhuma senha ou token é gravado nesse armazenamento.

O catálogo global e a recuperação de senha não possuem endpoints para estudantes. Suas telas apresentam a indisponibilidade; não mostram um catálogo fictício como conteúdo real. O banco permite trabalhar com os cadernos do próprio usuário, sem consultar endpoints administrativos.

A API de status ainda não serializa `generated_exam`. Por isso, após uma tarefa concluída, a aplicação oferece **Ver meus cadernos**, sem atribuir o resultado a uma prova possivelmente errada ou inventar a quantidade de questões. Se o contrato passar a informar esse ID, a tela já aceita a associação e oferece **Começar a resolver** e **Revisar questões**.

O histórico de envios mantém os identificadores das tarefas iniciadas neste navegador; não é uma listagem completa de tarefas da conta no servidor. Fechar o modal após o recebimento da tarefa mantém a preparação em andamento. Enquanto o arquivo ainda está sendo enviado, fechar o modal mantém a requisição ativa somente enquanto a página continuar aberta.

O backend ainda não fornece o PDF de origem pelo contrato do caderno. O editor identifica essa ausência, permite consultar as imagens da questão e não exibe um documento ilustrativo como se fosse o original. Edições locais invalidam a conferência atual para permitir nova correção; as tentativas de simulado preservam uma cópia das questões e do gabarito usado em sua criação.

O relógio usa um prazo absoluto e continua fora da tela do simulado. Ao reabrir a aplicação, uma tentativa cujo prazo terminou é finalizada localmente. A entrega bloqueia novas alterações; resultados só podem ser abertos depois da conclusão. Este relógio local não substitui a validação de duração no servidor quando houver persistência de tentativas.

## Organização

- `src/features/questio/`: tipos, adaptação da API, providers, shell e telas.
- `src/services/api.ts`: cliente Axios, cookies e renovação de sessão.
- `src/styles/`: base e estilos Stitch portados da exploração, com adaptações para React.
- `src/pages/`: entradas anteriores encaminhadas aos componentes migrados.
- `qa/`: testes de domínio, API fictícia isolada, validação no navegador e evidências.

Os providers/templates antigos permanecem sem uso nas rotas migradas. A aplicação agora utiliza os providers de sessão e estudo do módulo Questio.

## Validar

```bash
npm run build
npm run lint
npm test
```

A validação de interface usa uma API fictícia isolada, sem contas ou processamento reais. Veja [qa/validation.md](qa/validation.md) para executar e consultar as verificações e limites das evidências.
