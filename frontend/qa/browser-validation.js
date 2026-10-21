// Run only against the isolated QA Vite instance and mock-api.mjs.
export async function run() {
  if (location.origin !== 'http://127.0.0.1:5174') throw new Error('QA must run on the isolated origin');
  const checks = [];
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const expect = (name, value) => { checks.push({ name, passed: !!value }); if (!value) throw new Error(name); };
  const wait = async (selector, text = '') => { for (let i = 0; i < 80; i++) { const e = document.querySelector(selector); if (e && (!text || e.textContent.includes(text))) return e; await sleep(100); } throw new Error(`Timeout: ${selector} ${text}`); };
  const go = async path => { history.pushState({ usr: null, key: crypto.randomUUID(), idx: (history.state?.idx || 0) + 1 }, '', path); dispatchEvent(new PopStateEvent('popstate', { state: history.state })); await sleep(250); };
  const click = async selector => { (await wait(selector)).click(); await sleep(100); };
  const button = async text => { const element = [...document.querySelectorAll('button')].find(e => e.textContent.trim() === text); if (!element) throw new Error(`Button ${text}`); element.click(); await sleep(150); };
  const input = (selector, value) => { const e = document.querySelector(selector); const proto = e.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : e.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, value); e.dispatchEvent(new Event(e.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); };
  const local = () => JSON.parse(localStorage.getItem('questio:study:v1:991'));
  const control = async patch => fetch('/api/__qa/control', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
  try {
    await go('/'); await wait('.resume-panel');
    expect('Seis destinos da sidebar na ordem aprovada', [...document.querySelectorAll('.stitch-nav a')].map(a => a.textContent).join('|') === 'Visão geral|Meus cadernos|Banco de questões|Simulados|Desempenho|Histórico de envios');
    expect('Dados da API mapeados pelo nome do caderno', document.body.textContent.includes('Matemática — Revisão 2024'));
    await go('/biblioteca'); await wait('.library-exam-row');
    await click('.library-exam-row .icon-button'); expect('Favorito persistido por conta', local().favorites.includes('71'));
    await button('Favoritos 1'); expect('Aba de favoritos filtra cadernos', document.querySelectorAll('.library-exam-row').length === 1);
    await go('/caderno/71/questao/101'); await wait('.question-prompt');
    expect('Texto-base e pergunta separados', !!document.querySelector('.question-passage') && document.querySelector('.question-prompt').textContent.includes('Quantos livros'));
    expect('Foco vai ao conteúdo de estudo', document.activeElement.id === 'main-content');
    expect('Alternativas sem borda do fieldset', getComputedStyle(document.querySelector('.stitch-alternatives')).borderTopWidth === '0px');
    await click('input[type=radio][value=A]'); await button('Conferir resposta');
    expect('Conferência correta e alternativa bloqueada', local().answers['71::101'].correct && document.querySelector('input[type=radio]').disabled);
    await click('.question-notes summary'); input('.question-notes textarea', 'Rever divisão em partes iguais.'); await button('Salvar anotação'); expect('Anotação salva', local().notes['71::101'].includes('divisão'));
    await go('/caderno/72/questao/103'); await wait('.question-prompt'); await click('input[type=radio][value=A]'); await button('Registrar resposta'); expect('Questão sem gabarito registrada sem pontuar', local().answers['72::103'].checked && local().answers['72::103'].correct === null);
    await go('/caderno/72/revisar/103'); await wait('.revision-editor'); input('.revision-editor select', 'A'); await sleep(100); document.querySelector('.revision-editor').requestSubmit(); await sleep(200); expect('Novo gabarito permite conferir novamente', local().overrides['72::103'].correct === 'A' && !local().answers['72::103'].checked);
    await go('/caderno/72/questao/103'); await wait('.question-prompt'); await button('Conferir resposta'); expect('Resposta antes sem gabarito agora corrigida', local().answers['72::103'].correct === true);
    await go('/caderno/71/revisar/101'); await wait('.revision-editor'); input('.revision-editor textarea[required]', 'Qual é a quantidade de livros por estante?'); await sleep(100);
    await click('a[href="/caderno/71"]'); await wait('.notice', 'Descartar'); expect('Navegação bloqueada para alterações não salvas', location.pathname.includes('/revisar/')); await button('Continuar editando'); document.querySelector('.revision-editor').requestSubmit(); await sleep(200); expect('Editor salva pergunta separada', local().overrides['71::101'].stem === 'Qual é a quantidade de livros por estante?');
    await go('/banco'); await wait('.bank-question-row'); expect('Banco usa ajustes do editor', document.body.textContent.includes('Qual é a quantidade')); await click('.bank-question-row button'); await click('.selection-dock a'); await wait('.builder-settings'); expect('Seleção do banco transportada ao construtor', document.querySelectorAll('.builder-question input:checked').length === 1);
    input('.builder-settings input', 'Simulado de validação'); await sleep(100); await button('Começar simulado'); await wait('.simulation-question input');
    const id = local().simulations[0].id; expect('Simulado cria cópia das questões', local().simulations[0].questions[0].stem.includes('Qual é a quantidade'));
    await go(`/resultado/${id}`); await wait('.simulation-question'); expect('Resultado antecipado volta ao player', location.pathname === `/simulado/${id}`);
    await click('input[type=radio][value=A]'); await button('Marcar para revisar'); expect('Marcação de revisão salva', local().simulations[0].flagged.length === 1);
    await button('Finalizar simulado'); await wait('.finish-confirmation'); await button('Confirmar finalização'); await wait('.result-summary'); expect('Entrega calcula base e acertos', document.querySelector('.result-stats').textContent.includes('1 de 1'));
    await go(`/simulado/${id}`); await wait('.result-summary'); expect('Tentativa entregue não reabre para alteração', location.pathname === `/resultado/${id}`);
    await click('.result-review-item summary'); expect('Revisão mostra respostas e conteúdo', !!document.querySelector('.result-review-item .stitch-alternatives'));
    await go('/caderno/71/revisar/101'); await wait('.revision-editor'); input('.revision-editor select', 'B'); await sleep(100); document.querySelector('.revision-editor').requestSubmit(); await sleep(150); await go(`/resultado/${id}`); await wait('.result-summary'); expect('Correção histórica não muda após edição', document.querySelector('.result-stats').textContent.includes('1 de 1') && local().simulations.find(s => s.id === id).questions[0].correct === 'A');
    await go('/caderno/71'); await wait('.detail-actions'); await click('.detail-actions a[href="/simulados/novo"]'); await wait('.builder-question'); expect('Atalho pré-seleciona o caderno', document.querySelectorAll('.builder-question input:checked').length === 2);
    await button('Salvar rascunho'); await wait('.simulation-list'); expect('Rascunho disponível na lista', local().simulations[0].status === 'DRAFT');
    await go('/simulados/novo'); await wait('.builder-question'); await click('.builder-question input'); input('.builder-settings select', '30'); await sleep(100); await button('Começar simulado'); await wait('.simulation-clock'); const timed = local().simulations[0].id;
    await go('/banco'); const originalNow = Date.now; Date.now = () => originalNow() + 31 * 60000; await sleep(1300); Date.now = originalNow; expect('Cronômetro finaliza mesmo fora do player', local().simulations.find(s => s.id === timed).status === 'COMPLETED');
    await go('/'); await wait('.resume-panel'); const activeBeforeUpload = local().activeExamId;
    await control({ pollFail: true }); await click('.sidebar-upload-action'); await wait('dialog[open]'); expect('Modal limita foco e altura', document.querySelector('dialog').matches(':modal') && document.querySelector('dialog').getBoundingClientRect().height <= innerHeight);
    const data = new DataTransfer(); data.items.add(new File(['%PDF-1.4\nQA fixture'], 'prova-teste.pdf', { type: 'application/pdf' })); document.querySelector('.upload-field input').files = data.files; document.querySelector('.upload-field input').dispatchEvent(new Event('change', { bubbles: true })); await sleep(150); document.querySelector('.upload-form').requestSubmit(); await wait('.upload-processing'); await click('.dialog-close'); await go('/importacoes'); await wait('.notice-error'); expect('Falha de consulta não transforma tarefa em FAILED', local().tasks[0].status === 'PROCESSING' && !!local().tasks[0].lookupError);
    await sleep(5100); await control({ pollFail: false }); await button('Tentar novamente'); await wait('.task-status', 'Concluída'); expect('Consulta recuperada encontra tarefa concluída', local().tasks[0].status === 'COMPLETED'); expect('Importar preserva caderno de retomada', local().activeExamId === activeBeforeUpload); expect('Sem ID gerado o resultado abre a biblioteca', document.querySelector('.task-row a.btn-stitch-secondary').getAttribute('href') === '/biblioteca');
    const log = await (await fetch('/api/__qa')).json(); const uploaded = log.requests.find(r => r.path.includes('upload-exam'));
    expect('Upload usa multipart e apenas PDFs', uploaded.contentType.startsWith('multipart/form-data; boundary=') && uploaded.body.includes('name="exam_file"') && !uploaded.body.includes('auto_correction'));
    expect('Não consulta endpoints administrativos de questões', !log.requests.some(r => /^\/api\/questions\/(?:\d+\/)?$/.test(r.path)));
    await go('/caderno/999'); await wait('.notice-error'); expect('ID inválido não mostra caderno ativo', document.querySelector('.notice-error').textContent.includes('não encontrado'));
    await go('/rota-inexistente'); await wait('.empty-inline'); expect('Rota inexistente mostra estado próprio', document.body.textContent.includes('Conteúdo não encontrado'));
    await go('/desempenho'); await wait('.performance-summary'); expect('Desempenho reúne treino e simulados', document.querySelector('.performance-summary').textContent.includes('Respostas corrigidas'));
    await go('/historico'); await wait('.history-row'); expect('Histórico tem conferências individuais', document.querySelectorAll('.history-row').length >= 3);
    return { passed: checks.length, checks, screenshotRoutes: ['/', '/biblioteca', '/caderno/71/questao/101', '/simulados/novo', `/resultado/${id}`, '/conta'] };
  } catch (error) { return { passed: checks.filter(c => c.passed).length, checks, error: error.message, path: location.pathname }; }
}
