import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowRight, Check, FileText, Image, List, Text, Upload, X } from 'lucide-react';
import { useStudy } from './context';
import { errorMessage, uploadExam } from './api';
import { Empty, ErrorNotice, Heading } from './UI';

function ExtractionScene() {
  const cards = [{ label: 'Enunciados', Icon: Text }, { label: 'Alternativas', Icon: List }, { label: 'Imagens', Icon: Image }, { label: 'Respostas', Icon: Check }];
  return <div className="extraction-scene" aria-hidden="true"><div className="extraction-paper"><div className="paper-topline"><span /><span /></div><div className="paper-rule paper-rule-title" /><div className="paper-question"><b /><span><i /><i /><i /></span></div><div className="paper-answers"><i /><i /><i /></div><div className="paper-question"><b /><span><i /><i /><i /></span></div><div className="paper-answers"><i /><i /></div><div className="scan-beam" /></div><svg className="extraction-routes" viewBox="0 0 420 230" preserveAspectRatio="none" focusable="false">{[29, 86, 144, 201].map(y => <path key={y} className="route-pulse" pathLength="1" d={`M181 ${y} H260`} />)}</svg><div className="knowledge-fields">{cards.map(({ label, Icon }) => <div className="knowledge-field" key={label}><span className="knowledge-square"><Icon size={22} /></span><span>{label}</span></div>)}</div></div>;
}
function DropZone({ label, file, onFile, onError }: { label: string; file: File | null; onFile: (file: File | null) => void; onError: (error: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  function accept(file: File | undefined) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) { onError('Escolha um arquivo em PDF.'); return; }
    if (file.size > 15 * 1024 * 1024) { onError('O arquivo excede o limite de 15 MiB.'); return; }
    if (!file.size) { onError('O arquivo está vazio. Escolha outro PDF.'); return; }
    onError(''); onFile(file);
  }
  return <div className="upload-field"><label>{label}</label><input className="sr-only" ref={input} type="file" accept="application/pdf,.pdf" aria-label={label} onChange={e => { accept(e.target.files?.[0]); e.target.value = ''; }} tabIndex={-1} /><button type="button" className={`stitch-dropzone ${dragging ? 'is-dragging' : ''}`} aria-label={`${label}: ${file ? file.name : "Escolher arquivo"}, PDF até 15 MiB`} onClick={() => input.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files[0]); }}><Upload size={24} /><span>{file ? file.name : 'Escolher PDF ou arrastar aqui'}</span><small>PDF · até 15 MiB</small></button>{file && <button className="text-action file-remove" type="button" onClick={() => onFile(null)}>Remover {file.name}</button>}</div>;
}
export function UploadDialog() {
  const { uploadOpen, setUploadOpen, activeTaskId, setActiveTaskId, local, setLocal, exams, retryTask } = useStudy();
  const dialog = useRef<HTMLDialogElement>(null);
  const statusRef = useRef<HTMLHeadingElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const task = local.tasks.find(t => t.id === activeTaskId);
  const processing = sending || task?.status === 'PENDING' || task?.status === 'PROCESSING';
  const success = task?.status === 'COMPLETED';
  const prepared = exams.find(e => e.id === task?.generatedExamId);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (uploadOpen) { previousFocus.current = document.activeElement as HTMLElement; if (!element.open) element.showModal(); }
    else if (element.open) { element.close(); previousFocus.current?.focus(); }
  }, [uploadOpen]);
  useEffect(() => { if (uploadOpen && (processing || success)) statusRef.current?.focus(); }, [processing, success, uploadOpen]);
  useEffect(() => { const element = dialog.current; return () => element?.close(); }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (!examFile || sending) return;
    setSending(true); setError(''); setActiveTaskId(null);
    try {
      const created = await uploadExam(examFile, keyFile, examFile.name.replace(/\.pdf$/i, ''));
      setLocal(s => ({ ...s, tasks: [created, ...s.tasks.filter(t => t.id !== created.id)] }));
      setActiveTaskId(created.id);
    } catch (e) { setError(errorMessage(e)); }
    finally { setSending(false); }
  }
  function fresh() { setActiveTaskId(null); setExamFile(null); setKeyFile(null); setError(''); }
  function close() { setUploadOpen(false); }
  return <dialog ref={dialog} className="upload-dialog" aria-labelledby="upload-dialog-title" aria-describedby="upload-description" onKeyDown={e => { if (e.key === "Escape") { e.preventDefault(); close(); } }} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) close(); } }}>
    <div className="upload-dialog-header"><div><h2 id="upload-dialog-title">{success ? 'Prova preparada' : 'Enviar prova'}</h2><p id="upload-description">{success ? 'Seu material está disponível para estudar.' : processing ? 'O sistema está preparando sua prova.' : 'Da prova em PDF ao seu próximo treino.'}</p></div><button className="dialog-close" aria-label="Fechar janela de envio" onClick={close}><X size={20} /></button></div>
    <div className="upload-dialog-content"><div className="stitch-card">{success ? <div className="upload-success"><div className="upload-success-icon"><Check size={28} /></div><h3 className="upload-success-title" ref={statusRef} tabIndex={-1}>Sua nova prova está pronta</h3><p><strong>{prepared?.title || task.title}</strong><br />{prepared ? `${prepared.questions.length} questões preparadas.` : 'A preparação terminou. Abra seus cadernos para encontrar a prova enviada.'}</p><div className="upload-success-actions"><Link className="btn-stitch-primary" onClick={close} to={prepared?.questions[0] ? `/caderno/${prepared.id}/questao/${prepared.questions[0].id}` : '/biblioteca'}>{prepared?.questions[0] ? 'Começar a resolver' : 'Ver meus cadernos'}<ArrowRight size={16} /></Link><button className="btn-stitch-secondary" onClick={fresh}>Enviar outra prova</button>{prepared?.questions[0] && <Link className="text-action" onClick={close} to={`/caderno/${prepared.id}/revisar/${prepared.questions[0].id}`}>Revisar questões</Link>}</div></div> : processing ? <div className="upload-processing"><ExtractionScene /><h3 ref={statusRef} tabIndex={-1} role="status">{sending ? 'Enviando sua prova…' : 'Preparando suas questões…'}</h3><p className="processing-close-note">{sending ? 'Aguarde a confirmação de recebimento do arquivo. Fechar esta janela mantém o envio ativo enquanto esta página estiver aberta.' : <>Você pode fechar esta janela. A preparação continua e o resultado aparece em <Link className="text-action" to="/importacoes" onClick={close}>Histórico de envios</Link>.</>}</p>{task?.lookupError && <ErrorNotice retry={() => void retryTask(task.id)}>{task.lookupError} A preparação pode continuar no servidor. Consulte novamente sem reenviar.</ErrorNotice>}</div> : <form className="upload-form" onSubmit={submit}>
    {error && <ErrorNotice>{error}</ErrorNotice>}{task?.status === 'FAILED' && <ErrorNotice>Não foi possível preparar esta prova. Revise os arquivos e tente enviar novamente.</ErrorNotice>}<p className="upload-dialog-intro">Envie sua prova em PDF. O gabarito é opcional.</p><div className="upload-file-fields"><DropZone label="Prova em PDF" file={examFile} onFile={setExamFile} onError={setError} /><DropZone label="Gabarito em PDF (opcional)" file={keyFile} onFile={setKeyFile} onError={setError} /></div><div className="upload-form-actions"><button type="button" className="btn-stitch-secondary" onClick={close}>Cancelar</button><button className="btn-stitch-primary" disabled={!examFile || sending}>Extrair questões <ArrowRight size={18} /></button></div></form>}</div></div>
  </dialog>;
}
export function ImportsPage() {
  const { taskId } = useParamsForTask();
  const { local, retryTask, setActiveTaskId, setUploadOpen } = useStudy();
  const tasks = taskId ? local.tasks.filter(t => t.id === taskId) : local.tasks;
  return <><HeadingForImports onUpload={() => { setActiveTaskId(null); setUploadOpen(true); }} /><p className="local-notice">Aqui aparecem os envios iniciados neste navegador e nesta conta. O estado de cada preparação é consultado no servidor.</p>{tasks.length ? <div className="task-list">{tasks.map(t => <article className="task-row" key={t.id}><span className="task-icon">{t.status === 'COMPLETED' ? <Check size={22} /> : <FileText size={22} />}</span><div className="task-copy"><Link to={`/importacao/${t.id}`}><strong>{t.title}</strong></Link><small>{new Date(t.createdAt).toLocaleString('pt-BR')} · {t.keyFile ? 'Com gabarito enviado' : 'Sem gabarito enviado'}</small>{t.lookupError && <ErrorNotice retry={() => void retryTask(t.id)}>{t.lookupError} Isso não confirma uma falha na preparação.</ErrorNotice>}</div><span className={`task-status ${t.status.toLowerCase()}`}>{t.status === 'COMPLETED' ? 'Concluída' : t.status === 'FAILED' ? 'Falhou' : 'Em preparação'}</span>{t.status === 'COMPLETED' ? <Link className="btn-stitch-secondary" to={t.generatedExamId ? `/caderno/${t.generatedExamId}` : '/biblioteca'}>Abrir resultado <ArrowRight size={16} /></Link> : t.status === 'FAILED' ? <button className="btn-stitch-secondary" onClick={() => { setActiveTaskId(null); setUploadOpen(true); }}>Enviar novamente</button> : <button className="text-action" onClick={() => void retryTask(t.id)}>Consultar novamente</button>}</article>)}</div> : <Empty title={taskId ? 'Envio não encontrado neste navegador' : 'Nenhum envio ainda'}>Envie uma prova para acompanhar sua preparação por aqui.</Empty>}</>;
}
// Route hooks remain outside the dialog so form state survives navigation.
function useParamsForTask() { return useParams<{ taskId: string }>(); }
function HeadingForImports({ onUpload }: { onUpload: () => void }) { return <Heading title="Histórico de envios" description="Acompanhe suas provas e abra o material quando estiver pronto." action={<button className="btn-stitch-primary" onClick={onUpload}><Upload size={18} />Enviar prova</button>} />; }
