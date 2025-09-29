import type { QuestionModel } from "./QuestionModel";

export type QuestionStateModel = {
  questions: QuestionModel[];
  loading: boolean;
  error: string | null;
};

export type QuestionDetailsStateModel = {
  question: QuestionModel | null;
  loading: boolean;
  error: string | null;
};
