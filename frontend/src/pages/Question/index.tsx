import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { questionDetailsReducer } from "../../reducers/questionReducer";
import type { QuestionDetailsStateModel } from "../../models/Question/QuestionStateModel";
import { useReducer, useState } from "react";
import { Link, useLocation } from "react-router";
import { Container } from "../../components/Container";
import { ChevronLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { QuestionInput } from "../../components/QuestionInput";
import { QuestionForm } from "../../components/QuestionForm";
import { QuestionComment } from "../../components/QuestionComment";

export function Question() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const maxLength = 500;

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setComment(e.target.value);
    }
  };

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
      console.log("Question:", location.state.question);

      return {
        question: location.state.question,
        loading: false,
        error: null,
      };
    }
    return { question: null, loading: false, error: "Question not found" };
  };

  const [state] = useReducer(questionDetailsReducer, questionFromState());

  const passage = state.question?.passage_text ?? "";
  const images = state.question?.images ?? [];

  console.log("images:", images);
  console.log("passage:", passage);
  console.log("sources:", state.question?.sources);
  console.log(selectedOption);

  return (
    <MainTemplate>
      <div className="grid grid-cols-8 col-span-6 max-w-[800px] justify-self-center w-full mx-auto">
        <div className="h-20 w-60 flex justify-start items-center">
          <div className="">
            <Link
              className="flex items-center gap-2 text-2xl font-semibold hover:text-primary hover:opacity-80 cursor-pointer"
              to="/"
            >
              <ChevronLeft /> Voltar para lista
            </Link>
          </div>
        </div>
      </div>

      {state.loading && <Loader />}

      {state.error && <p>{state.error}</p>}

      {state.question && (
        <Container className="mx-auto h-full max-w-[800px] py-10 border-2 rounded-2xl overflow-auto justify-self-center">
          <div className="max-w-full mx-5 mb-5 p-5 border-2 rounded-2xl text-2xl text-muted-foreground ">
            {state.question.area} | {state.question.topic}
          </div>
          <div className="flex flex-col mb-9 gap-2 max-w-full mx-5 border-2 rounded-2xl p-5 justify-center items-center bg-accent/90 dark:bg-gray-500/10">
            {images.length > 0 && (
              <div className="flex flex-col gap-5 w-full">
                {images.map((image) => (
                  <img
                    key={`question-image-${image.id}`}
                    src={image.image}
                    alt={`Question Image ${image.id + 1}`}
                    className="w-full max-h-min rounded-lg object-contain"
                  />
                ))}
              </div>
            )}
            <div className="mt-5 font-mono leading-12 text-justify">
              {passage}
            </div>
            <div className="w-full mt-2 text-right">
              <span className="font-mono italic text-2xl text-muted-foreground">
                {state.question.sources?.join(", ")}
              </span>
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
            {state.question.options.map((option) => (
              <QuestionInput
                id={`${state.question?.id}-${option.label}`}
                option={option.label}
                optionText={option.text}
                value={option.label}
                name="options"
                key={option.id}
                onChange={handleOptionChange}
                isSelected={selectedOption === option.label}
                className={cn([
                  "bg-accent/90 dark:bg-gray-500/10",
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
          </QuestionForm>
          <QuestionComment
            id="description"
            labelText="Comentário"
            name="description"
            placeholder="Deixe aqui seus comentários sobre a questão..."
            onChange={handleCommentChange}
            text={comment}
            maxLength={maxLength}
            className={cn([
              "mx-5",
              "mt-10",
              "h-[100px]",
              "text-2xl",
              "font-mono",
              "font-semibold",
              comment ? "dark:border-primary border-muted-foreground/60" : "",
            ])}
          />
        </Container>
      )}
    </MainTemplate>
  );
}
