import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, FileText, AlertCircle, Check, X } from 'lucide-react';
import type { Answer, Question } from './types';
export function Heading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return <div className="empty-inline"><FileText size={32} aria-hidden="true" /><h2>{title}</h2>{children && <p>{children}</p>}{action}</div>;
}
export function ErrorNotice({ children, retry }: { children: ReactNode; retry?: () => void }) {
  return <div className="notice notice-error" role="alert"><AlertCircle size={18} aria-hidden="true" /><div><p>{children}</p>{retry && <button className="text-action" onClick={retry}>Tentar novamente</button>}</div></div>;
}
export function LocalNotice({ children }: { children: ReactNode }) { return <p className="local-notice">{children}</p>; }
export function Loading() { return <p className="loading-state" role="status">Carregando seu espaço de estudos…</p>; }
export function NotFound({ title = 'Conteúdo não encontrado' }: { title?: string }) {
  return <Empty title={title}>O link pode estar incorreto ou este conteúdo não está disponível nesta conta.<br /><Link className="btn-stitch-secondary" to="/biblioteca">Voltar aos cadernos <ArrowRight size={16} /></Link></Empty>;
}
export function QuestionContent({ question }: { question: Question }) {
  return <>{question.passage && <p className="question-passage">{question.passage}</p>}{question.images.map(image => <figure className="question-figure" key={image.url}><img src={image.url} alt={image.name} loading="lazy" /><figcaption>{image.name}</figcaption></figure>)}<p className="stitch-question-stem question-prompt">{question.stem}</p></>;
}
export function Options({ question, selected, onChange, answer, disabled = false, name = 'answer' }: { question: Question; selected: string; onChange: (value: string) => void; answer?: Answer; disabled?: boolean; name?: string }) {
  return <fieldset className="stitch-alternatives"><legend className="sr-only">Alternativas</legend>{question.options.map(option => {
    const chosen = selected === option.label;
    const correct = answer?.checked && question.correct === option.label;
    const wrong = answer?.checked && chosen && question.correct !== null && !correct;
    return <label key={option.label} className={`stitch-option-label ${chosen ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'incorrect' : ''}`}><input type="radio" name={name} value={option.label} checked={chosen} disabled={disabled} onChange={() => onChange(option.label)} /><span className="stitch-option-letter">{option.label}</span><span>{option.text}</span>{correct ? <Check size={18} aria-label="Alternativa correta" /> : wrong ? <X size={18} aria-label="Resposta incorreta" /> : null}</label>;
  })}</fieldset>;
}
