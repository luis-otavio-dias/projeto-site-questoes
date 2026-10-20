export type User = { id: number; email: string };
export type Option = { label: string; text: string };
export type Question = {
  id: string; area: string; topic: string; passage: string; stem: string;
  options: Option[]; correct: string | null; images: { url: string; name: string }[];
};
export type Exam = { id: string; title: string; year: string; variant: string; questions: Question[] };
export type Answer = { selected: string; checked: boolean; correct: boolean | null; updatedAt: number };
export type TaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ImportTask = { id: string; title: string; examFile: string; keyFile: string; status: TaskStatus; createdAt: string; lookupError?: string; generatedExamId?: string };
export type SimulationQuestion = Question & { examId: string; examTitle: string; key: string };
export type Simulation = {
  id: string; title: string; questions: SimulationQuestion[]; responses: Record<string, string>;
  flagged: string[]; index: number; minutes: number; status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt: number | null; deadline: number | null; finishedAt: number | null;
};
export type StudySession = { id: string; examId: string; questionId: string; at: number; correct: boolean | null };
export type LocalStudy = {
  version: 1; answers: Record<string, Answer>; favorites: string[]; notes: Record<string, string>;
  overrides: Record<string, Question>; activeExamId: string | null; activeQuestionId: string | null;
  simulations: Simulation[]; tasks: ImportTask[]; sessions: StudySession[]; tipDismissed: boolean;
};
export const questionKey = (examId: string, questionId: string) => `${examId}::${questionId}`;
export function emptyStudy(): LocalStudy {
  return { version: 1, answers: {}, favorites: [], notes: {}, overrides: {}, activeExamId: null, activeQuestionId: null, simulations: [], tasks: [], sessions: [], tipDismissed: false };
}
export function getMetrics(exam: Exam, answers: LocalStudy['answers']) {
  const answered = exam.questions.map(q => answers[questionKey(exam.id, q.id)]).filter(a => a?.checked);
  const scored = answered.filter(a => a.correct !== null);
  return { total: exam.questions.length, answered: answered.length, scored: scored.length, correct: scored.filter(a => a.correct).length,
    next: exam.questions.find(q => !answers[questionKey(exam.id, q.id)]?.checked)?.id || exam.questions[0]?.id };
}
export function resultOf(sim: Simulation) {
  const rows = sim.questions.map(q => ({ question: q, response: sim.responses[q.key], correct: q.correct ? sim.responses[q.key] === q.correct : null }));
  const unanswered = rows.filter(row => !row.response).length;
  const unscored = rows.filter(row => row.response && row.correct === null).length;
  const scored = rows.filter(row => row.response && row.correct !== null);
  const correct = scored.filter(row => row.correct).length;
  return { rows, correct, scored: scored.length, errors: scored.length - correct, unanswered, unscored };
}
