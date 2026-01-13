import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { questionDetailsReducer } from "../../reducers/questionReducer";
import type { QuestionDetailsStateModel } from "../../models/Question/QuestionStateModel";
import { useReducer, useState } from "react";
import { useLocation } from "react-router";
import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { QuestionInput } from "../../components/QuestionInput";
import { QuestionForm } from "../../components/QuestionForm";

export function Question() {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const checkOptionHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert(`Opção selecionada: ${selectedOption}`);
  };

  const location = useLocation();

  const questionFromState = (): QuestionDetailsStateModel => {
    if (location.state?.question) {
      console.log(location.state.question);

      return {
        question: location.state.question,
        loading: false,
        error: null,
      };
    }
    return { question: null, loading: false, error: "Question not found" };
  };

  const [state] = useReducer(questionDetailsReducer, questionFromState());

  console.log(selectedOption);

  return (
    <MainTemplate>
      <Menu
        title={<DefaultButton icon={<ArrowLeft />} linkTo="/" />}
        className="h-16"
      />
      {state.loading && <Loader />}

      {state.error && <p>{state.error}</p>}

      {state.question && (
        <Container className="mx-auto h-full max-w-[800px] py-10 border-2 rounded-2xl overflow-auto justify-self-center">
          <div className="text-2xl mx-5 mb-2 text-muted-foreground">
            {state.question.edition.year} | {state.question.theme.name}
          </div>

          <div className="flex flex-col mb-9 gap-2 max-w-full mx-5 border-2 rounded-2xl p-5 justify-center items-center">
            <img
              src="/public/vite.svg"
              alt=""
              className="w-full h-[100px] border-2 rounded-2xl bg-white/60"
            />

            <div className="mt-5 font-mono leading-12 text-justify">
              Texto associado à questã se houver. Normalmente é um trecho de um
              artigo, uma citação, uma letra de música, etc. Na maiora das vezes
              questões com imagem associada não possuem texto e vice-versa.
            </div>

            <div className="mt-10 text-2xl text-justify leading-9 font-bold">
              {state.question.stem}
            </div>
          </div>

          <QuestionForm
            buttonText="RESPONDER"
            onClick={checkOptionHandler}
            className="items-start px-5"
          >
            {state.question.answer_options.map((option) => (
              <QuestionInput
                id={`question-option-${option.option}`}
                option={option.option}
                optionText={option.option_text}
                value={option.option}
                name="options"
                key={option.id}
                onChange={handleOptionChange}
                isSelected={selectedOption === option.option}
                className={cn([
                  "border-2",
                  "rounded-2xl",
                  "w-full",
                  "h-20",
                  "p-4",
                  "hover:border-secondary/40",
                  "hover:bg-secondary/30",
                  "cursor-pointer",
                  "transition-colors",
                  "flex items-center",
                ])}
              />
            ))}
            {/* <DefaultButton
              icon={"enviar  "}
              className="border-2 w-full h-[43px]"
            /> */}
          </QuestionForm>
        </Container>
      )}
    </MainTemplate>
  );
}
