import { useEffect } from 'react';
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router';
import { useSession, useStudy } from './context';
import { StudyProvider } from './Providers';
import { Shell } from './Shell';
import { AccountPage, AuthPage } from './Auth';
import { DashboardPage, ExamPage, LibraryPage, TrainingPage } from './StudyPages';
import { RevisionPage } from './RevisionPage';
import { BankPage, BuilderPage, ResultPage, SimulationPage, SimulationsPage } from './SimulationPages';
import { ImportsPage } from './UploadDialog';
import { HistoryPage, PerformancePage } from './AnalyticsPages';
import { ErrorNotice, Loading, NotFound } from './UI';
function Protected() {
  const { user, loading, error, retry } = useSession();
  const location = useLocation();
  if (loading) return <div className="session-page theme-stitch"><Loading /></div>;
  if (!user && error) return <div className="session-page theme-stitch"><ErrorNotice retry={retry}>{error}</ErrorNotice><Link className="text-action" to="/login">Ir para entrar</Link></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  return <StudyProvider key={user.id}><Outlet /></StudyProvider>;
}
function UploadEntry() {
  const { setUploadOpen } = useStudy();
  const navigate = useNavigate();
  useEffect(() => { setUploadOpen(true); navigate('/', { replace: true }); }, [navigate, setUploadOpen]);
  return null;
}
function LegacyQuestion() {
  const { id } = useParams();
  const { exams, loading } = useStudy();
  const location = useLocation();
  if (loading) return <Loading />;
  const requested: unknown = location.state?.examId;
  const matches = exams.filter(exam => (!requested || exam.id === String(requested)) && exam.questions.some(q => q.id === id));
  return matches.length === 1 ? <Navigate to={`/caderno/${matches[0].id}/questao/${id}`} replace /> : <NotFound title="Abra esta questão pelo seu caderno" />;
}
export function QuestioRoutes() {
  return <Routes><Route path="/login" element={<AuthPage key="login" mode="login" />} /><Route path="/register" element={<AuthPage key="register" mode="register" />} /><Route path="/cadastro" element={<Navigate to="/register" replace />} /><Route path="/recuperar" element={<AuthPage mode="recover" />} /><Route path="/redefinir" element={<AuthPage mode="reset" />} /><Route element={<Protected />}><Route element={<Shell />}><Route index element={<DashboardPage />} /><Route path="biblioteca" element={<LibraryPage />} /><Route path="caderno/:examId" element={<ExamPage />} /><Route path="caderno/:examId/questao/:questionId" element={<TrainingPage />} /><Route path="caderno/:examId/revisar/:questionId" element={<RevisionPage />} /><Route path="banco" element={<BankPage />} /><Route path="simulados" element={<SimulationsPage />} /><Route path="simulados/novo" element={<BuilderPage />} /><Route path="simulado/:simulationId" element={<SimulationPage />} /><Route path="resultado/:simulationId" element={<ResultPage />} /><Route path="desempenho" element={<PerformancePage />} /><Route path="historico" element={<HistoryPage />} /><Route path="importacoes" element={<ImportsPage />} /><Route path="importacao/:taskId" element={<ImportsPage />} /><Route path="conta" element={<AccountPage />} /><Route path="profile" element={<Navigate to="/conta" replace />} /><Route path="questions/:id" element={<LegacyQuestion />} /><Route path="upload_file" element={<UploadEntry />} /><Route path="enviar" element={<UploadEntry />} /><Route path="*" element={<NotFound />} /></Route></Route></Routes>;
}
