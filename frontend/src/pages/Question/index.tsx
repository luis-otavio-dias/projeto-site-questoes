import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { questionDetailsReducer } from "../../reducers/questionReducer";
import type { QuestionDetailsStateModel } from "../../models/Question/QuestionStateModel";
import { useReducer, useState } from "react";
import { useLocation } from "react-router";
import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { DefaultInput } from "../../components/DefaultInput";
import { DefaultButton } from "../../components/DefaultButton";
import { ArrowLeft } from "lucide-react";

export function Question() {
  const [selectedOption, setSelectedOption] = useState<string>("");

  function checkOptionHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

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
        className="w-full h-16 pb-14"
      />
      {state.loading && <Loader />}

      {state.error && <p>{state.error}</p>}

      {state.question && (
        <Container className="flex flex-col h-[50vh] w-full border-y-2 gap-10 p-10 justify-center">
          <p className="text-2xl mb-2 text-muted-foreground">
            {state.question.edition.year} | {state.question.theme.name}
          </p>
          <p className="text-4xl text-justify mb-5">{state.question.stem}</p>
          <form action="" radioGroup="options" className="flex flex-col gap-5">
            {state.question.answer_options.map((option) => (
              <DefaultInput
                id={`question-${option.id}`}
                labelText={`${option.option}) ${option.option_text}`}
                labelInline={true}
                value={option.option}
                name="options"
                type="radio"
                className=""
                onChange={(e) => setSelectedOption(e.target.value)}
              />
            ))}

            <DefaultButton
              icon="Enviar"
              className="mt-4 bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground hover:opacity-80 transition-colors"
              type="submit"
              onClick={checkOptionHandler}
              disabled={!selectedOption}
            />
          </form>
        </Container>
      )}
    </MainTemplate>
  );
}
