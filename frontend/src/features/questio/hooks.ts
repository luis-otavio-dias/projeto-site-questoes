import { useEffect, useState } from 'react';
import { useStudy } from './context';
import { errorMessage } from './api';
export function useExam(id: string | undefined) {
  const { exams, loadExam, loading, local } = useStudy();
  const [request, setRequest] = useState<{ id: string; error: string } | null>(null);
  const exam = exams.find(e => e.id === id);
  useEffect(() => {
    if (!id || exam || loading) return;
    const controller = new AbortController();
    setRequest({ id, error: '' });
    loadExam(id, controller.signal).catch(e => { if (!controller.signal.aborted) setRequest({ id, error: errorMessage(e, 'Caderno não encontrado.') }); });
    return () => controller.abort();
  }, [id, exam, loading, loadExam]);
  const error = request && request.id === id ? request.error : '';
  return { exam: exam ? { ...exam, questions: exam.questions.map(q => local.overrides[`${exam.id}::${q.id}`] || q) } : undefined,
    loading: loading || (!exam && !!id && !error), error };
}
