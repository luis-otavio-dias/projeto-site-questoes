import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { SessionContext, StudyContext, useSession } from './context';
import type { Exam, LocalStudy, User } from './types';
import { emptyStudy } from './types';
import { errorMessage, getExam, listExams, profile, taskStatus, unauthorized } from './api';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    profile(controller.signal).then(account => { if (!controller.signal.aborted) setUser(account); }).catch(e => { if (!controller.signal.aborted) { setUser(null); if (!unauthorized(e)) setError(errorMessage(e)); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  const expire = useCallback(() => setUser(null), []);
  useEffect(() => { window.addEventListener('questio:session-expired', expire); return () => window.removeEventListener('questio:session-expired', expire); }, [expire]);
  return <SessionContext.Provider value={{ user, loading, error, setUser, retry: () => setAttempt(n => n + 1), expire }}>{children}</SessionContext.Provider>;
}
function readLocal(key: string): LocalStudy {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null');
    if (parsed?.version === 1 && Array.isArray(parsed.simulations) && Array.isArray(parsed.tasks) && typeof parsed.answers === 'object') return { ...emptyStudy(), ...parsed };
  } catch { /* Malformed or unavailable storage must not prevent access. */ }
  return emptyStudy();
}
export function StudyProvider({ children }: { children: ReactNode }) {
  const { user, expire } = useSession();
  const storageKey = `questio:study:v1:${user!.id}`;
  const [local, setLocal] = useState(() => readLocal(storageKey));
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [persistenceError, setPersistenceError] = useState('');
  const hasLoaded = useRef(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const mounted = useRef(true);
  const localRef = useRef(local);
  localRef.current = local;
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(local)); setPersistenceError(''); } catch { setPersistenceError('O navegador não permitiu salvar seu estudo. As mudanças desta sessão serão perdidas ao fechar ou recarregar a página.'); }
  }, [local, storageKey]);
  const reload = useCallback(async (signal?: AbortSignal) => {
    if (!hasLoaded.current) setLoading(true);
    setError('');
    try { const data = await listExams(signal); if (mounted.current && !signal?.aborted) { hasLoaded.current = true; setExams(data); } }
    catch (e) { if (mounted.current && !signal?.aborted) { if (unauthorized(e)) expire(); else setError(errorMessage(e)); } }
    finally { if (mounted.current && !signal?.aborted) setLoading(false); }
  }, [expire]);
  useEffect(() => { const controller = new AbortController(); mounted.current = true; void reload(controller.signal); return () => { mounted.current = false; controller.abort(); }; }, [reload]);
  const loadExam = useCallback(async (id: string, signal?: AbortSignal) => {
    const exam = await getExam(id, signal);
    if (mounted.current) setExams(items => [...items.filter(item => item.id !== id), exam]);
    return exam;
  }, []);
  const retryTask = useCallback(async (id: string) => {
    try {
      const task = await taskStatus(id);
      if (!mounted.current) return;
      const old = localRef.current.tasks.find(t => t.id === id);
      setLocal(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...task, lookupError: undefined } : t) }));
      if (task.status === 'COMPLETED' && old?.status !== 'COMPLETED') await reload();
    } catch (e) {
      if (!mounted.current) return;
      if (unauthorized(e)) { expire(); return; }
      setLocal(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, lookupError: errorMessage(e) } : t) }));
    }
  }, [expire, reload]);
  useEffect(() => {
    let busy = false;
    const poll = async () => {
      if (busy) return;
      busy = true;
      try { for (const task of localRef.current.tasks.filter(t => ['PENDING', 'PROCESSING'].includes(t.status) && !t.lookupError)) { if (!mounted.current) break; await retryTask(task.id); } }
      finally { busy = false; }
    };
    void poll();
    const timer = window.setInterval(poll, 2500);
    return () => window.clearInterval(timer);
  }, [retryTask]);
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (!localRef.current.simulations.some(s => s.status === 'IN_PROGRESS' && s.deadline !== null && s.deadline <= now)) return;
      setLocal(s => ({ ...s, simulations: s.simulations.map(sim => sim.status === 'IN_PROGRESS' && sim.deadline !== null && sim.deadline <= now ? { ...sim, status: 'COMPLETED', finishedAt: sim.deadline } : sim) }));
    };
    tick(); const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', tick); };
  }, []);
  return <StudyContext.Provider value={{ exams, loading, error, persistenceError, local, setLocal, reload, loadExam, uploadOpen, setUploadOpen, activeTaskId, setActiveTaskId, retryTask }}>{children}</StudyContext.Provider>;
}
