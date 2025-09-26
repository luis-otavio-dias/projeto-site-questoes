import { useContext } from "react";
import { QuestionContext } from "./QuestionContext";

export function useQuestionContext() {
  return useContext(QuestionContext);
}
