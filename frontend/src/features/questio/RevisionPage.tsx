import { useEffect, useState } from 'react';
import { Link, useBlocker, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { useStudy } from './context';
import { useExam } from './hooks';
import { questionKey } from './types';
import type { Exam, Question } from './types';
import { ErrorNotice, Heading, Loading, LocalNotice, NotFound } from './UI';
export function RevisionPage() {
  const { examId, questionId } = useParams();
  const { exam, loading, error } = useExam(examId);
  if (loading) return <Loading />;
  if (!exam) return error ? <ErrorNotice>{error}</ErrorNotice> : <NotFound title="Caderno não encontrado" />;
  const question = exam.questions.find(q => q.id === questionId);
  if (!question) return <NotFound title="Questão não encontrada" />;
  return <RevisionEditor key={`${exam.id}:${question.id}`} exam={exam} question={question} />;
}
function RevisionEditor({ exam, question }: { exam: Exam; question: Question }) {
  const { setLocal } = useStudy();
  const [draft, setDraft] = useState<Question>(() => structuredClone(question));
  const [savedContent, setSavedContent] = useState(JSON.stringify(question));
  const [saved, setSaved] = useState(false);
  const [mobileTab, setMobileTab] = useState('question');
  const dirty = JSON.stringify(draft) !== savedContent;
  const blocker = useBlocker(dirty);
  const index = exam.questions.findIndex(q => q.id === question.id);
  useEffect(() => {
    if (!dirty) return;
    const before = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', before);
    return () => window.removeEventListener('beforeunload', before);
  }, [dirty]);
  function save(event: React.FormEvent) {
    event.preventDefault();
    const key = questionKey(exam.id, question.id);
    setLocal(s => ({ ...s, overrides: { ...s.overrides, [key]: structuredClone(draft) }, answers: s.answers[key] ? { ...s.answers, [key]: { ...s.answers[key], checked: false, correct: null } } : s.answers }));
    setSavedContent(JSON.stringify(draft)); setSaved(true);
  }
  return <><nav className="breadcrumb"><Link to={`/caderno/${exam.id}`}>{exam.title}</Link><span>/</span><span>Revisão</span></nav><Heading title="Revisar questões" description="Confira o conteúdo e salve ajustes para o seu estudo." action={<Link className="btn-stitch-secondary" to={`/caderno/${exam.id}`}>Concluir revisão</Link>} /><LocalNotice>Estes ajustes são salvos apenas neste navegador. O conteúdo no servidor e as tentativas de simulado já criadas permanecem como estavam.</LocalNotice>{blocker.state === 'blocked' && <div className="notice" role="alert"><div><h2>Descartar alterações não salvas?</h2><p>Há ajustes nesta questão que ainda não foram salvos.</p><div className="detail-actions"><button className="btn-stitch-secondary" onClick={() => blocker.reset()}>Continuar editando</button><button className="btn-stitch-primary" onClick={() => blocker.proceed()}>Descartar e sair</button></div></div></div>}
    <div className="revision-mobile-tabs"><button className="btn-stitch-secondary" aria-pressed={mobileTab === 'document'} onClick={() => setMobileTab('document')}>Documento</button><button className="btn-stitch-secondary" aria-pressed={mobileTab === 'question'} onClick={() => setMobileTab('question')}>Questão</button></div><div className={`revision-layout show-${mobileTab}`}><section className="document-preview"><div className="document-preview-head"><FileText size={18} /><span>{exam.title}</span></div><div className="source-unavailable"><FileText size={40} /><h2>Documento original indisponível</h2><p>O arquivo de origem não está disponível para comparação nesta tela.</p></div>{question.images.map(image => <figure key={image.url}><img src={image.url} alt={image.name} /><figcaption>{image.name}</figcaption></figure>)}</section>
    <form className="revision-editor" onSubmit={save}><div className="revision-step">{index > 0 ? <Link className="btn-stitch-secondary" to={`/caderno/${exam.id}/revisar/${exam.questions[index - 1].id}`}><ArrowLeft size={16} />Anterior</Link> : <span />}<strong>Questão {index + 1} de {exam.questions.length}</strong>{index + 1 < exam.questions.length ? <Link className="btn-stitch-secondary" to={`/caderno/${exam.id}/revisar/${exam.questions[index + 1].id}`}>Próxima<ArrowRight size={16} /></Link> : <span />}</div><label>Matéria<input value={draft.area} onChange={e => { setDraft(s => ({ ...s, area: e.target.value })); setSaved(false); }} /></label><label>Assunto<input value={draft.topic} onChange={e => { setDraft(s => ({ ...s, topic: e.target.value })); setSaved(false); }} /></label><label>Texto-base<textarea rows={6} value={draft.passage} onChange={e => { setDraft(s => ({ ...s, passage: e.target.value })); setSaved(false); }} /></label><label>Pergunta<textarea rows={4} required value={draft.stem} onChange={e => { setDraft(s => ({ ...s, stem: e.target.value })); setSaved(false); }} /></label><fieldset><legend>Alternativas</legend>{draft.options.map(o => <label className="revision-option" key={o.label}><span>{o.label}</span><textarea rows={2} required aria-label={`Texto da alternativa ${o.label}`} value={o.text} onChange={e => { setDraft(s => ({ ...s, options: s.options.map(option => option.label === o.label ? { ...option, text: e.target.value } : option) })); setSaved(false); }} /></label>)}</fieldset><label>Gabarito<select value={draft.correct || ''} onChange={e => { setDraft(s => ({ ...s, correct: e.target.value || null })); setSaved(false); }}><option value="">Sem gabarito</option>{draft.options.map(o => <option value={o.label} key={o.label}>Alternativa {o.label}</option>)}</select></label><button className="btn-stitch-primary" disabled={!dirty}>Salvar ajustes</button>{saved && <p className="success-inline" role="status">Ajustes salvos neste navegador. Confira novamente sua resposta no treino.</p>}</form></div></>;
}
