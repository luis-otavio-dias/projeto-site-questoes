import { useEffect, useReducer } from "react";
import { QuestionContext } from "../../contexts/QuestionContext/QuestionContext";
import { questionReducer } from "../../reducers/questionReducer";
import { initialQuestionState } from "../../contexts/QuestionContext/initialQuestionState";

type QuestionContextProviderProps = {
  children: React.ReactNode;
};

export function QuestionContextProvider({
  children,
}: QuestionContextProviderProps) {
  const [state, dispatch] = useReducer(questionReducer, initialQuestionState);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <QuestionContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionContext.Provider>
  );
}
