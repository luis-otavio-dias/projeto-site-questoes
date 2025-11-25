import type { QuestionModel } from "../../models/Question/QuestionModel";

export type UserModel = {
  id: string;
  email: string;
  files: string | null;
  questions: QuestionModel[] | null;
};
