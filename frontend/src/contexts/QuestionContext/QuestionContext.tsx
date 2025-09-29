import type { QuestionActionModel } from "../../actions/questionActions";
import type { QuestionStateModel } from "../../models/Question/QuestionStateModel";
import { createContext } from "react";
import { initialQuestionState } from "./initialQuestionState";

type QuestionContextProps = {
  state: QuestionStateModel;
  dispatch: React.Dispatch<QuestionActionModel>;
};

const initialContextValue = {
  state: initialQuestionState,
  dispatch: () => {},
};

export const QuestionContext =
  createContext<QuestionContextProps>(initialContextValue);
