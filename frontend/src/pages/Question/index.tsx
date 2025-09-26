import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { questionDetailsReducer } from "../../reducers/questionReducer";
import type { QuestionDetailsStateModel } from "../../models/Question/QuestionStateModel";
import { useReducer } from "react";
import { useLocation } from "react-router";

export function Question() {
  const location = useLocation();

  const questionFromState = (): QuestionDetailsStateModel => {
    if (location.state?.question) {
      return {
        question: location.state.question,
        loading: false,
        error: null,
      };
    }
    return { question: null, loading: false, error: "Question not found" };
  };

  const [state] = useReducer(questionDetailsReducer, questionFromState());

  return (
    <MainTemplate>
      {state.loading && <Loader />}

      {state.error && <p>{state.error}</p>}

      {state.question && (
        <div>
          <h1 className="text-4xl font-bold mb-4">{state.question.stem}</h1>
        </div>
      )}
    </MainTemplate>
  );
}
