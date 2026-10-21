import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { api, isSessionFailure } from '../../services/api';
import type { Exam, ImportTask, Question, TaskStatus, User } from './types';

type QuestionDTO = { id: number; area: string; topic: string; passage_text: string; stem: string; options: { label: string; text: string }[]; correct_answer?: string; images?: { image: string; filename: string }[] };
type ExamDTO = { id: number; name_base: string; name_sigle: string; year: string; variant: string; questions: QuestionDTO[] };
type TaskDTO = { id: number; title: string; status: TaskStatus; exam_file: string; answer_key_file?: string; created_at: string; generated_exam?: number };
export function errorMessage(error: unknown, fallback = 'Não foi possível concluir. Tente novamente.') {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return 'Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.';
  if (isSessionFailure(error)) return 'Sua sessão expirou. Entre novamente para continuar.';
  if (error.response.status >= 500 || error.code === 'ERR_BAD_RESPONSE') return 'O servidor está indisponível. Tente novamente em instantes.';
  const data: unknown = error.response.data;
  if (data && typeof data === 'object') {
    const values = Object.values(data).flat().filter(value => typeof value === 'string');
    if (values.includes('Invalid credentials')) return 'E-mail ou senha incorretos.';
    if (values.length) return values.join(' ');
  }
  return fallback;
}
export const unauthorized = isSessionFailure;
export function requireUser(value: unknown): User {
  if (value && typeof value === 'object' && typeof (value as User).email === 'string' && (typeof (value as User).id === 'number' || typeof (value as User).id === 'string')) {
    return value as User;
  }
  throw new axios.AxiosError('Invalid user payload', 'ERR_BAD_RESPONSE');
}
export async function profile(signal?: AbortSignal): Promise<User> {
  return requireUser((await api.get<User>('/users/me/profile/', { signal })).data);
}
export async function login(email: string, password: string) {
  return requireUser((await api.post<{ user: User }>('/users/login/', { email, password })).data?.user);
}
export async function register(email: string, password: string) {
  await api.post('/users/register/', { email, password });
}
export async function updateProfile(email: string, password?: string) {
  return requireUser((await api.put<User>('/users/me/profile/update/', { email, ...(password ? { password } : {}) })).data);
}
export async function logout() { await api.post('/users/logout/'); }
export function normalizeQuestion(q: QuestionDTO): Question {
  const options = Array.isArray(q.options) ? q.options.filter(o => typeof o.label === 'string' && typeof o.text === 'string') : [];
  return { id: String(q.id), area: q.area || 'Conhecimentos gerais', topic: q.topic || '', passage: q.passage_text || '', stem: q.stem || '', options,
    correct: options.some(o => o.label === q.correct_answer) ? q.correct_answer! : null,
    images: (q.images || []).filter(i => /^https?:\/\//.test(i.image) || i.image.startsWith('/')).map(i => ({ url: i.image, name: i.filename || 'Imagem da questão' })) };
}
export function normalizeExam(exam: ExamDTO): Exam {
  return { id: String(exam.id), title: exam.name_base || exam.name_sigle || `Caderno ${exam.id}`, year: exam.year || '', variant: exam.variant || '', questions: (exam.questions || []).map(normalizeQuestion) };
}
export async function listExams(signal?: AbortSignal): Promise<Exam[]> {
  let url: string | null = '/questions/exams/';
  const exams: Exam[] = [];
  const visited = new Set<string>();
  while (url && !visited.has(url)) {
    visited.add(url);
    const response: AxiosResponse<ExamDTO[] | { results: ExamDTO[]; next: string | null }> = await api.get(url, { signal });
    const data = response.data;
    exams.push(...(Array.isArray(data) ? data : data.results).map(normalizeExam));
    const next: string | null = Array.isArray(data) ? null : data.next;
    if (!next) { url = null; continue; }
    const resolved = new URL(next, window.location.origin);
    // Pagination must stay on the authenticated exams collection.
    if (resolved.origin !== window.location.origin || resolved.pathname !== '/api/questions/exams/') throw new Error('Invalid pagination URL');
    url = resolved.pathname.replace(/^\/api/, '') + resolved.search;
  }
  return exams;
}
export async function getExam(id: string, signal?: AbortSignal) {
  return normalizeExam((await api.get<ExamDTO>(`/questions/exams/${encodeURIComponent(id)}/`, { signal })).data);
}
function normalizeTask(t: TaskDTO): ImportTask {
  return { id: String(t.id), title: t.title || 'Prova enviada', status: t.status, examFile: t.exam_file, keyFile: t.answer_key_file || '', createdAt: t.created_at, ...(t.generated_exam ? { generatedExamId: String(t.generated_exam) } : {}) };
}
export async function uploadExam(exam: File, key: File | null, title: string): Promise<ImportTask> {
  const form = new FormData();
  form.append('exam_file', exam); form.append('title', title);
  if (key) form.append('answer_key_file', key);
  return normalizeTask((await api.post<TaskDTO>('/questions/upload-exam/', form, { headers: { 'Content-Type': undefined } })).data);
}
export async function taskStatus(id: string, signal?: AbortSignal) {
  return normalizeTask((await api.get<TaskDTO>(`/questions/tasks/${encodeURIComponent(id)}/status/`, { signal })).data);
}
