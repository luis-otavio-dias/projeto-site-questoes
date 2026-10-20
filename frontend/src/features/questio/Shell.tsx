import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, BookOpen, ChartNoAxesCombined, ChevronRight, FileText, History, LayoutDashboard, ListChecks, LogOut, Moon, Sun, Upload, UserRound } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider/context';
import { useSession, useStudy } from './context';
import { errorMessage, logout } from './api';
import { UploadDialog } from './UploadDialog';
const groups = [
  [{ to: '/', label: 'Visão geral', Icon: LayoutDashboard }],
  [{ to: '/biblioteca', label: 'Meus cadernos', Icon: BookOpen }, { to: '/banco', label: 'Banco de questões', Icon: FileText }, { to: '/simulados', label: 'Simulados', Icon: ListChecks }],
  [{ to: '/desempenho', label: 'Desempenho', Icon: ChartNoAxesCombined }, { to: '/importacoes', label: 'Histórico de envios', Icon: History }],
];
export function Shell() {
  const { changeTheme } = useTheme();
  const { user, setUser } = useSession();
  const { setUploadOpen, local, persistenceError } = useStudy();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [exiting, setExiting] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const main = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const name = user!.email.split('@')[0];
  const activeDestination = /^\/(caderno|questions)\//.test(location.pathname) ? '/biblioteca' : /^\/(simulado|resultado)\//.test(location.pathname) ? '/simulados' : location.pathname === '/historico' ? '/desempenho' : location.pathname.startsWith('/importacao/') ? '/importacoes' : location.pathname;
  const pending = local.tasks.filter(t => t.status === 'PROCESSING' || t.status === 'PENDING');
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (menu.current) menu.current.open = false;
  }, [location.pathname]);
  useEffect(() => {
    const outside = (e: MouseEvent) => { if (menu.current && !menu.current.contains(e.target as Node)) menu.current.open = false; };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && menu.current?.open) { menu.current.open = false; menu.current.querySelector('summary')?.focus(); } };
    document.addEventListener('click', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('click', outside); document.removeEventListener('keydown', escape); };
  }, []);
  async function signout() {
    setExiting(true); setLogoutError('');
    try { await logout(); setUser(null); navigate('/login', { replace: true }); }
    catch (e) { setLogoutError(errorMessage(e, 'Não foi possível sair da conta. Tente novamente.')); }
    finally { setExiting(false); }
  }
  return <div className="theme-stitch"><a className="skip-link" href="#main-content">Ir para o conteúdo</a><div className={`stitch-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className="stitch-sidebar" aria-label="Navegação principal"><div className="sidebar-start"><Link to="/" className="stitch-brand" aria-label="Questio — início"><span className="brand-symbol"><BookOpen size={23} /></span><span>Questio<span className="brand-dot">.</span></span></Link><button className="sidebar-upload-action" onClick={() => setUploadOpen(true)} aria-label="Enviar prova" title={collapsed ? 'Enviar prova' : undefined}><Upload size={18} /><span>Enviar prova</span></button></div>
    <nav className="stitch-nav" aria-label="Estudo e acompanhamento">{groups.map((group, i) => <div className="sidebar-nav-group" key={i}>{group.map(({ to, label, Icon }) => <Link key={to} to={to} aria-label={label} aria-current={activeDestination === to || (to !== '/' && activeDestination.startsWith(`${to}/`)) ? 'page' : undefined} title={collapsed ? label : undefined} className={`stitch-nav-link ${activeDestination === to || (to !== '/' && activeDestination.startsWith(`${to}/`)) ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></Link>)}</div>)}</nav>
    <div className="stitch-sidebar-footer"><details className="sidebar-account" ref={menu}><summary className="account-nav-link" aria-label={`Minha conta — ${user!.email}`}><span className="sidebar-account-avatar" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span><span className="account-summary"><strong>Minha conta</strong><small>{user!.email}</small></span><ChevronRight className="account-chevron" size={14} /></summary><div className="sidebar-account-menu"><Link to="/conta"><UserRound size={16} />Gerenciar conta</Link><button onClick={signout} disabled={exiting}><LogOut size={16} />{exiting ? 'Saindo…' : 'Sair'}</button>{logoutError && <p className="sidebar-error" role="alert">{logoutError}</p>}</div></details><button className="sidebar-toggle" aria-expanded={!collapsed} aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'} onClick={() => setCollapsed(v => !v)}>{collapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}<span>Recolher menu</span></button></div></aside>
    <div className="stitch-main"><header className="stitch-topbar"><span className="stitch-topbar-title">Meu espaço de estudos</span><div className="stitch-topbar-actions"><button className="theme-toggle" type="button" onClick={changeTheme}><Moon className="theme-icon-dark" size={18} aria-hidden="true" /><Sun className="theme-icon-light" size={18} aria-hidden="true" /><span className="theme-label-dark">Tema escuro</span><span className="theme-label-light">Tema claro</span></button><Link to="/conta" className="stitch-topbar-user" aria-label="Abrir minha conta"><div className="stitch-avatar" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</div><div className="stitch-user-info"><div className="stitch-user-name">{name}</div><div className="stitch-user-tag">Estudante</div></div></Link></div></header>
    <main id="main-content" tabIndex={-1} ref={main} className="stitch-content expanded-content">{pending.length > 0 && <Link className="preparation-banner" to="/importacoes"><History size={18} /><span>{pending.length === 1 ? 'Sua prova está em preparação.' : `${pending.length} provas em preparação.`} Acompanhar envios</span><ChevronRight size={16} /></Link>}<Outlet />{persistenceError && <p className="notice notice-error" role="alert">{persistenceError}</p>}<footer className="content-footer"><span>Questio · Um passo de cada vez.</span><span>Treinos, favoritos, revisões e simulados são salvos apenas neste navegador.</span></footer></main></div>
    <UploadDialog />
  </div></div>;
}
