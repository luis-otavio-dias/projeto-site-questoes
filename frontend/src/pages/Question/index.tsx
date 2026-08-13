import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { questionDetailsReducer } from "../../reducers/questionReducer";
import type { QuestionDetailsStateModel } from "../../models/Question/QuestionStateModel";
import { useReducer, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Section heading shared style ─────────────────────────────────────────────
const sectionHeading =
  "text-sm font-medium uppercase tracking-[0.025em] text-[#71717B]";

// ─── Component ────────────────────────────────────────────────────────────────

export function Question() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const maxNotesLength = 500;

  const location = useLocation();

  const questionFromState = (): QuestionDetailsStateModel => {
    if (location.state?.question) {
      return {
        question: location.state.question,
        loading: false,
        error: null,
      };
    }
    return { question: null, loading: false, error: "Questão não encontrada." };
  };

  const [state] = useReducer(questionDetailsReducer, questionFromState());

  const passage = state.question?.passage_text ?? "";
  const images = state.question?.images ?? [];
  const sources = state.question?.sources ?? [];
  const hasPassage = images.length > 0 || !!passage;

  return (
    <MainTemplate className="flex h-[calc(100vh-81px)] min-h-0 overflow-hidden">
      <div className="flex flex-col flex-1 h-full dark:bg-[#09090B] bg-background overflow-hidden">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className=" dark:bg-[#18181B] bg-card border-b dark:border-[#27272A] px-8 py-4 shrink-0">
          {" "}
          {/* Back button */}{" "}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-medium  dark:text-[#9F9FA9] text-muted-foreground  dark:hover:text-white hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar para lista
          </Link>
          {/* Meta tags */}
          {state.question && (
            <div className="flex items-center gap-6 mt-4">
              {/* Area badge */}
              <span className="bg-[rgba(43,127,255,0.1)] text-[#51A2FF] text-sm font-medium px-4 py-2 rounded-[10px] shrink-0">
                {state.question.area}
              </span>

              {/* Topic */}
              <div className="flex items-center gap-2 text-sm  dark:text-[#9F9FA9] text-muted-foreground">
                <span className="h-4 w-px bg-[#3F3F47] shrink-0" />
                {state.question.topic}
              </div>
            </div>
          )}
        </header>

        {/* ── Loading ───────────────────────────────────────────────────────── */}
        {state.loading && (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────────── */}
        {state.error && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-[832px] mx-auto w-full px-4 py-12">
              <p className="text-red-400">{state.error}</p>
            </div>
          </div>
        )}

        {/* ── Main content ──────────────────────────────────────────────────── */}
        {state.question && (
          <div className="flex-1 min-h-full overflow-y-auto">
            <div className="max-w-[832px] mx-auto w-full px-4 py-12">
              {/* Enunciado card */}
              <div className=" dark:bg-[#18181B] bg-card border dark:border-[#27272A] rounded-[14px] p-8">
                <p className={sectionHeading}>Enunciado</p>

                {/* Passage: images */}
                {hasPassage && (
                  <div className="mt-4 flex flex-col gap-4">
                    {images.map((image) => (
                      <img
                        key={`q-img-${image.id}`}
                        src={image.image}
                        alt=""
                        className="w-full rounded-lg object-contain"
                      />
                    ))}

                    {/* Passage text */}
                    {passage && (
                      <p className="text-base dark:text-[#9F9FA9] text-muted-foreground font-mono leading-relaxed text-justify">
                        {passage}
                      </p>
                    )}

                    {/* Sources */}
                    {sources.length > 0 && (
                      <p className="text-sm text-[#71717B] italic text-right">
                        {sources.join(", ")}
                      </p>
                    )}
                  </div>
                )}

                {/* Stem */}
                <p className="mt-4 text-lg text-[#F4F4F5] dark:text-[#F4F4F5] text-foreground leading-[1.625]">
                  {state.question.stem}
                </p>
              </div>

              {/* Alternativas */}
              <div className="py-8">
                <p className={sectionHeading}>Alternativas</p>

                <div className="mt-4 flex flex-col gap-3">
                  {state.question.options.map((option) => {
                    const isSelected = selectedOption === option.label;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedOption(option.label)}
                        className={cn(
                          "flex items-center gap-4 w-full min-h-[72px] px-5 rounded-[14px] border text-left transition-all duration-150",
                          isSelected
                            ? "bg-[rgba(43,127,255,0.08)] border-[#51A2FF]"
                            : "bg-[#18181B] dark:bg-[#18181B] bg-card border-[#27272A] dark:border-[#27272A] border-border hover:border-[#3F3F47] hover:bg-[rgba(255,255,255,0.02)]",
                        )}
                      >
                        <span
                          className={cn(
                            "text-lg font-bold shrink-0 w-8 transition-colors",
                            isSelected
                              ? "text-[#51A2FF]"
                              : "text-[#D4D4D8] dark:text-[#D4D4D8]",
                          )}
                        >
                          {option.label})
                        </span>
                        <span className="text-base font-medium text-[#D4D4D8] dark:text-[#D4D4D8] text-card-foreground">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Responder */}
              <button
                type="button"
                disabled={!selectedOption}
                className={cn(
                  "w-full h-14 rounded-[14px] text-base font-medium text-white transition-opacity",
                  "bg-[#155DFC] shadow-[0px_10px_15px_-3px_rgba(21,93,252,0.2),0px_4px_6px_-4px_rgba(21,93,252,0.2)]",
                  selectedOption
                    ? "opacity-100 hover:opacity-90 cursor-pointer"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                Responder
              </button>

              {/* Anotações */}
              <div className="mt-12">
                <p className={cn(sectionHeading, "mb-4")}>Anotações</p>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    if (e.target.value.length <= maxNotesLength) {
                      setNotes(e.target.value);
                    }
                  }}
                  placeholder="Escreva suas anotações, comentários ou observações sobre esta questão..."
                  className="w-full h-[150px] bg-[#18181B] dark:bg-[#18181B] bg-card border border-[#27272A] dark:border-[#27272A] border-border rounded-[14px] p-5 text-base text-[#F4F4F5] dark:text-[#F4F4F5] text-foreground placeholder:text-[#52525C] resize-none focus:outline-none focus:border-[#51A2FF] dark:focus:border-[#51A2FF] transition-colors"
                />
                <p className="text-xs text-[#71717B] text-right mt-1">
                  {notes.length}/{maxNotesLength}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainTemplate>
  );
}
