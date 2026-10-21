// Isolated API fixture for browser QA. Never imported by the application.
import http from 'node:http';
const question = (id, correct = 'A') => ({ id, area: 'Matemática', topic: 'Proporções', name: '', question_id: String(id), passage_text: 'Uma biblioteca possui 120 livros. Uma turma organiza os livros em três estantes de mesmo tamanho.', stem: 'Quantos livros devem ser colocados em cada estante?', options: [{ label: 'A', text: '40 livros' }, { label: 'B', text: '60 livros' }, { label: 'C', text: '30 livros' }], correct_answer: correct, has_image: false, images: [], sources: [] });
const exams = [{ id: 71, name_base: 'Matemática — Revisão 2024', name_sigle: '', year: '2024', variant: 'Caderno azul', questions: [question(101), question(102, 'B')] }, { id: 72, name_base: 'Conhecimentos gerais 2023', name_sigle: '', year: '2023', variant: '', questions: [question(103, '')] }];
const requests = [];
let authenticated = false;
let pollFail = false;
let taskFail = false;
let empty = false;
let expireOnce = false;
const tasks = new Map();
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();
  requests.push({ method: req.method, path: url.pathname, contentType: req.headers['content-type'], body: url.pathname.includes('upload-exam') ? body : '' });
  const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
  if (url.pathname === '/__qa' || url.pathname === '/api/__qa') return send(200, { requests, tasks: [...tasks.values()] });
  if (url.pathname === '/__qa/control' || url.pathname === '/api/__qa/control') { const control = JSON.parse(body || '{}'); if ('authenticated' in control) authenticated = control.authenticated; if ('pollFail' in control) pollFail = control.pollFail; if ('taskFail' in control) taskFail = control.taskFail; if ('empty' in control) empty = control.empty; if ('expireOnce' in control) expireOnce = control.expireOnce; return send(200, {}); }
  if (url.pathname === '/api/users/register/') return send(201, { id: 991, email: 'teste@questio.local' });
  if (url.pathname === '/api/users/login/') { authenticated = true; return send(200, { user: { id: 991, email: 'teste@questio.local' }, status: 200 }); }
  if (url.pathname === '/api/users/refresh/') return authenticated ? send(200, {}) : send(401, { detail: 'Sessão expirada' });
  if (url.pathname === '/api/users/me/profile/' && expireOnce) { expireOnce = false; return send(401, { detail: 'expired' }); }
  if (!authenticated) return send(401, { detail: 'Sessão expirada' });
  if (url.pathname === '/api/users/me/profile/') return send(200, { id: 991, email: 'teste@questio.local' });
  if (url.pathname === '/api/users/me/profile/update/') return send(200, { id: 991, email: JSON.parse(body).email });
  if (url.pathname === '/api/users/logout/') { authenticated = false; return send(200, {}); }
  if (url.pathname === '/api/questions/exams/') return send(200, { results: empty ? [] : exams, next: null });
  const examMatch = url.pathname.match(/^\/api\/questions\/exams\/(\d+)\/$/);
  if (examMatch) { const exam = exams.find(e => e.id === Number(examMatch[1])); return exam ? send(200, exam) : send(404, { detail: 'Caderno não encontrado.' }); }
  if (url.pathname === '/api/questions/upload-exam/') { const id = tasks.size + 1; const task = { id, title: 'prova-teste', exam_file: '/media/prova-teste.pdf', answer_key_file: '', created_at: new Date().toISOString(), status: 'PROCESSING', start: Date.now() }; tasks.set(id, task); return send(201, task); }
  const match = url.pathname.match(/^\/api\/questions\/tasks\/(\d+)\/status\/$/);
  if (match) { if (pollFail) return send(503, { detail: 'offline' }); const task = tasks.get(Number(match[1])); if (!task) return send(404, {}); if (Date.now() - task.start > 5000) task.status = taskFail ? 'FAILED' : 'COMPLETED'; return send(200, task); }
  return send(404, { detail: 'Not found' });
});
server.listen(8181, '127.0.0.1', () => console.log('Questio QA API: http://127.0.0.1:8181'));
