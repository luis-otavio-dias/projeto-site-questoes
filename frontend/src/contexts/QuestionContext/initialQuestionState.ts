import type {
  QuestionDetailsStateModel,
  QuestionStateModel,
} from "../../models/Question/QuestionStateModel";

export const initialQuestionState: QuestionStateModel = {
  questions: [],
  loading: true,
  error: null,
};

export const initialQuestionDetailsState: QuestionDetailsStateModel = {
  question: null,
  loading: true,
  error: null,
};
