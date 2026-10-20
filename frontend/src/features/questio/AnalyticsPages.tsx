import { Link } from 'react-router';
import { ArrowRight, Check, X } from 'lucide-react';
import { useStudy } from './context';
import { questionKey, resultOf } from './types';
import { Empty, ErrorNotice, Heading, Loading, LocalNotice } from './UI';
export function PerformancePage() {
  const { exams, local, loading, error, reload } = useStudy();
  const byArea = new Map<string, { correct: number; scored: number }>();
  let answered = 0, scored = 0, correct = 0;
  function add(area: string, outcome: boolean | null) {
    answered++;
    if (outcome === null) return;
    scored++; if (outcome) correct++;
    const item = byArea.get(area) || { correct: 0, scored: 0 };
    item.scored++; if (outcome) item.correct++; byArea.set(area, item);
  }
  for (const exam of exams) for (const question of exam.questions) {
    const answer = local.answers[questionKey(exam.id, question.id)];
    if (answer?.checked) add((local.overrides[questionKey(exam.id, question.id)] || question).area, answer.correct);
  }
  const completed = local.simulations.filter(sim => sim.status === 'COMPLETED');
  for (const sim of completed) for (const row of resultOf(sim).rows) if (row.response) add(row.question.area, row.correct);
  const daily = new Map<string, { correct: number; scored: number }>();
  function addDay(at: number, outcome: boolean | null) {
    if (outcome === null) return;
    const day = new Date(at).toLocaleDateString('pt-BR');
    const value = daily.get(day) || { correct: 0, scored: 0 }; value.scored++; if (outcome) value.correct++; daily.set(day, value);
  }
  for (const session of [...local.sessions].sort((a, b) => a.at - b.at)) addDay(session.at, session.correct);
  for (const sim of [...completed].sort((a, b) => (a.finishedAt || 0) - (b.finishedAt || 0))) for (const row of resultOf(sim).rows) if (row.response) addDay(sim.finishedAt || 0, row.correct);
  return <><Heading title="Desempenho" description="Use seus resultados para orientar o próximo treino." action={<Link className="btn-stitch-secondary" to="/historico">Ver histórico</Link>} />{loading ? <Loading /> : error ? <ErrorNotice retry={() => void reload()}>{error}</ErrorNotice> : <><section className="performance-summary"><div><span>Respostas registradas</span><strong>{answered}</strong></div><div><span>Respostas corrigidas</span><strong>{scored}</strong></div><div><span>Acertos</span><strong>{correct} / {scored}</strong></div><div><span>Aproveitamento</span><strong>{scored ? `${Math.round(correct / scored * 100)}%` : '—'}</strong></div></section>{scored < 10 && <p className="sample-size-note">A amostra ainda é pequena: {scored} respostas corrigidas. Os resultados podem mudar bastante a cada questão.</p>}<section className="performance-subjects"><div className="section-heading"><h2>Por matéria</h2><span>Acertos / respostas corrigidas</span></div>{byArea.size ? [...byArea.entries()].map(([area, value]) => <div className="performance-subject-row" key={area}><span>{area}</span><strong>{value.correct} / {value.scored}</strong><span>{Math.round(value.correct / value.scored * 100)}%</span><progress value={value.correct} max={value.scored} aria-label={`${area}: ${value.correct} acertos de ${value.scored}`} /></div>) : <Empty title="Confira sua primeira resposta">As respostas sem gabarito ficam fora do aproveitamento.</Empty>}</section><section className="history-section"><div className="section-heading"><h2>Atividade por dia</h2><span>Respostas conferidas, incluindo novas conferências</span></div>{[...daily.entries()].map(([date, value]) => <div className="history-row" key={date}><span className="history-date">{date}</span><span><strong>{value.correct} acertos em {value.scored} respostas corrigidas</strong></span><span>{Math.round(value.correct / value.scored * 100)}%</span></div>)}{!daily.size && <p>Seu histórico aparece após conferir uma resposta.</p>}</section><LocalNotice>Resumo do treino atual e dos simulados concluídos neste navegador. O histórico diário inclui cada conferência, mesmo quando uma questão é respondida novamente.</LocalNotice></>}</>;
}
export function HistoryPage() {
  const { exams, local } = useStudy();
  const activities = [
    ...local.sessions.map(s => ({ id: s.id, at: s.at, title: exams.find(e => e.id === s.examId)?.title || 'Treino em caderno', description: s.correct === null ? 'Resposta registrada sem correção' : s.correct ? 'Resposta correta' : 'Resposta incorreta', to: `/caderno/${s.examId}/questao/${s.questionId}`, correct: s.correct })),
    ...local.simulations.map(s => ({ id: s.id, at: s.finishedAt || s.startedAt || 0, title: s.title, description: s.status === 'COMPLETED' ? 'Simulado concluído' : s.status === 'DRAFT' ? 'Rascunho de simulado' : 'Simulado em andamento', to: s.status === 'COMPLETED' ? `/resultado/${s.id}` : `/simulado/${s.id}`, correct: null })),
    ...local.tasks.map(t => ({ id: `task-${t.id}`, at: new Date(t.createdAt).getTime(), title: t.title, description: 'Envio de prova', to: `/importacao/${t.id}`, correct: null })),
  ].sort((a, b) => b.at - a.at);
  return <><Heading title="Histórico de atividade" description="Retome suas questões, envios e tentativas de simulado." action={<Link className="btn-stitch-secondary" to="/desempenho">Ver desempenho</Link>} />{activities.length ? <section className="history-section">{activities.map(a => <Link className="history-row" key={a.id} to={a.to}><span className="history-date">{a.at ? new Date(a.at).toLocaleString('pt-BR') : 'Rascunho'}</span><span><strong>{a.title}</strong><small>{a.description}</small></span>{a.correct === null ? <ArrowRight size={16} /> : a.correct ? <Check size={18} /> : <X size={18} />}</Link>)}</section> : <Empty title="Seu histórico começa com uma atividade">Envie uma prova ou resolva uma questão para começar.</Empty>}</>;
}
