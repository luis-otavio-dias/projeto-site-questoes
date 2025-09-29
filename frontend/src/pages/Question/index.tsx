import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { questionDetailsReducer } from "../../reducers/questionReducer";
import type { QuestionDetailsStateModel } from "../../models/Question/QuestionStateModel";
import { useReducer } from "react";
import { useLocation } from "react-router";
import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { DefaultInput } from "../../components/DefaultInput";
import { DefaultButton } from "../../components/DefaultButton";
import { ArrowLeft } from "lucide-react";

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
      <Menu
        title={<DefaultButton icon={<ArrowLeft />} linkTo="/" />}
        className="w-full h-16"
      />
      {state.loading && <Loader />}

      {state.error && <p>{state.error}</p>}

      {state.question && (
        <Container className="flex flex-col border-1 mb-96 gap-10 p-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">{state.question.stem}</h1>
            <form
              action=""
              radioGroup="options"
              className="flex flex-col items-start border-1 mt-9 gap-3.5"
            >
              {state.question.answer_options.map((option) => (
                <DefaultInput
                  id={`question-${option.id}`}
                  name="options"
                  labelText={`${option.option}) ${option.option_text}`}
                  type="radio"
                />
              ))}

              <DefaultButton
                icon="Enviar"
                className="bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground hover:opacity-80 transition-colors"
              />
            </form>
          </div>
        </Container>
      )}
    </MainTemplate>
  );
}
