import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useSession } from './context';
import { errorMessage, login, register, updateProfile } from './api';
import { ErrorNotice, Heading, LocalNotice } from './UI';
export function AuthPage({ mode }: { mode: 'login' | 'register' | 'recover' | 'reset' }) {
  const { user, setUser } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from: unknown = location.state?.from;
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !/^\/(login|register|cadastro|recuperar|redefinir)/.test(from) ? from : '/';
  if (user && (mode === 'login' || mode === 'register')) return <Navigate to={destination} replace />;
  const recovery = mode === 'recover' || mode === 'reset';
  const title = { login: 'Entrar', register: 'Criar conta', recover: 'Recuperar acesso', reset: 'Criar nova senha' }[mode];
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    if (mode === 'register' && password !== confirm) { setError('As senhas não coincidem. Confira a confirmação.'); return; }
    setBusy(true);
    try {
      if (mode === 'register' && !created) { await register(email, password); setCreated(true); }
      const account = await login(email, password);
      setUser(account); navigate(destination, { replace: true });
    } catch (e) { setError(errorMessage(e, 'Não foi possível entrar. Confira seu e-mail e senha.')); }
    finally { setBusy(false); }
  }
  return <main className="auth-page theme-stitch"><Link className="auth-brand" to="/login"><BookOpen size={25} />Questio<span>.</span></Link><div className="auth-card"><h1>{title}</h1><p>{mode === 'register' ? 'Comece a organizar seus estudos.' : recovery ? 'Volte ao seu espaço de estudos.' : 'Acesse seu espaço de estudos.'}</p>
    {recovery ? <><LocalNotice>A recuperação de senha ainda não está disponível. Nenhum e-mail será enviado e sua senha não será alterada por esta tela.</LocalNotice>{mode === 'reset' && <p role="status">Não é possível validar este link de recuperação.</p>}<Link className="btn-stitch-primary" to="/login">Voltar para entrar <ArrowRight size={16} /></Link></> : <form onSubmit={submit}>
    {created && <p className="notice" role="status">Sua conta foi criada. Entre com os dados cadastrados para continuar.</p>}{error && <ErrorNotice>{error}</ErrorNotice>}
    <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Senha<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required value={password} onChange={e => setPassword(e.target.value)} /></label>{mode === 'register' && <label>Confirmar senha<input type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /></label>}<button className="btn-stitch-primary" disabled={busy}>{busy ? 'Aguarde…' : created ? 'Entrar na minha conta' : title} <ArrowRight size={16} /></button>
    <div className="auth-links">{mode === 'login' ? <><Link to="/recuperar">Esqueci minha senha</Link><p>Ainda não tem conta? <Link to="/register" state={location.state}>Criar conta</Link></p></> : <p>Já tem conta? <Link to="/login" state={location.state}>Entrar</Link></p>}</div></form>}
  </div></main>;
}
export function AccountPage() {
  const { user, setUser } = useSession();
  const [email, setEmail] = useState(user!.email);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setSaved(false);
    if (password !== confirm) { setError('As senhas não coincidem.'); return; }
    setBusy(true);
    try { const account = await updateProfile(email, password || undefined); setUser(account); setPassword(''); setConfirm(''); setSaved(true); }
    catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  return <><Heading title="Minha conta" description="Gerencie os dados de acesso ao seu espaço de estudos." /><form className="account-form" onSubmit={submit}>{error && <ErrorNotice>{error}</ErrorNotice>}<label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Nova senha<input type="password" autoComplete="new-password" value={password} placeholder="Deixe em branco para manter a senha atual" onChange={e => setPassword(e.target.value)} /></label><label>Confirmar nova senha<input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label><button className="btn-stitch-primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar alterações'}</button>{saved && <p className="success-inline" role="status">Dados atualizados.</p>}</form></>;
}
