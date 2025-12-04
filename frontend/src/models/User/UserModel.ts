import type { QuestionModel } from "../../models/Question/QuestionModel";

export type UserModel = {
  id: string;
  email: string;
  files: string | null;
  exams: {
    id: string;
    title: string;
    questions: QuestionModel[] | null;
  } | null;
};
