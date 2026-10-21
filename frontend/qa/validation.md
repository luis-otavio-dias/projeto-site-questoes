# Validação da migração para React

Verificação em 7 de outubro de 2026, pelo navegador integrado do Orca, contra uma API fictícia isolada compatível com os serializers existentes. Não foram utilizados contas, provas ou tarefas reais. O pipeline de extração e o backend Django não foram executados nestes testes.

## Resultados

- **37 verificações funcionais aprovadas** em `browser-validation.js`: cadernos/favoritos, texto-base e pergunta separados, conferência, anotações, resposta sem gabarito e inclusão posterior local, proteção do editor, banco, seleção, rascunhos, entrega, resultado, cópia histórica, relógio fora do player, multipart, envio em segundo plano, falha de consulta recuperável e links inexistentes.
- **11 verificações de acesso aprovadas** em `browser-access-validation.js`: perfil, senha, saída, rotas protegidas, retorno ao destino, cadastro e indisponibilidade explícita de recuperação/catálogo.
- **5 testes de domínio aprovados** em `domain.test.mjs`: base de aproveitamento, estados do resultado, correção histórica e distinção entre sessão expirada e negação de permissão, incluindo o 403 de autenticação por cookies.
- **13 telas inspecionadas em 1440×1000 e 390×844**, pelo script `browser-inspection.js`: nenhum overflow horizontal; foco direcionado ao conteúdo principal em cada navegação.
- Primeiro acesso conferido sem ação superior redundante; renovação de sessão exercitada após falha de perfil e confirmada no registro de chamadas da fixture.
- Modal conferido como diálogo nativo, com ambos os campos inteiros antes do rodapé na resolução 1053×947. Fechamento por evento de Escape e restauração ao acionador conferidos.
- `npm run build` e `npm run lint` aprovados.

As capturas iniciais do painel estão em [desktop](screenshots/dashboard-desktop.png) e [mobile](screenshots/dashboard-mobile.png). Uma rodada posterior de capturas foi interrompida por timeout de `Page.captureScreenshot` no Orca (“the browser page did not draw a frame”). A inspeção de DOM, dimensões, foco e os percursos continuaram funcionando; não há capturas finais de todas as telas. As imagens iniciais não documentam todos os estados testados.

A conferência não substitui teste de integração com o backend real, leitura por tecnologias assistivas nem auditoria completa de acessibilidade. Os percursos de tarefa efetivamente malsucedida, quota de armazenamento e persistência entre dispositivos não tiveram cobertura ponta a ponta.

## Reproduzir

Com Node.js 22.18+:

```bash
node frontend/qa/mock-api.mjs
```

Em outro terminal:

```bash
cd frontend
QUESTIO_API_PROXY=http://127.0.0.1:8181 npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Abra `http://127.0.0.1:5174/login` em uma aba de teste. A fixture começa sem sessão e aceita apenas dados fictícios de acesso. Prepare o cenário pelo console dessa aba:

```js
await fetch('/api/__qa/control', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ authenticated: true, empty: false, pollFail: false }),
});
localStorage.removeItem('questio:study:v1:991');
location.assign('/');
```

Depois de carregar o painel, execute separadamente:

```js
await import('/qa/browser-validation.js').then(m => m.run());
await import('/qa/browser-access-validation.js').then(m => m.run());
await import('/qa/browser-inspection.js').then(m => m.inspect());
```

Os primeiros dois scripts alteram dados locais de teste. Execute o preparo novamente antes de repetir a suíte funcional. O script de inspeção requer uma tentativa concluída, criada pela suíte anterior; repita-o nas dimensões desejadas pelo controle de viewport do navegador. Os scripts exigem a origem de teste na porta 5174.

Para os testes de domínio e verificações estáticas:

```bash
npm test --prefix frontend
npm run build --prefix frontend
npm run lint --prefix frontend
```
