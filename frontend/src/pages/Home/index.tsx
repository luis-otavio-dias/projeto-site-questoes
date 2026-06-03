import { Card } from "../../components/Card";
import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { useQuestionContext } from "../../contexts/QuestionContext/useQuestionContext";
import { QuestionActionTypes } from "../../actions/questionActions";
import type {
  QuestionModel,
  ExamModel,
} from "../../models/Question/QuestionModel";
import { useEffect } from "react";
import { Link } from "react-router";
import { api } from "../../services/api";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useNavigate } from "react-router";

export function Home() {
  const { state, dispatch } = useQuestionContext();
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.userInfo === null) {
      navigate("/login");
    }
  }, [userState.userInfo, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      dispatch({ type: QuestionActionTypes.QUESTION_LIST_REQUEST });

      try {
        const { data } = await api.get("questions/exams/");

        const allQuestions: QuestionModel[] = data.flatMap(
          (exam: ExamModel) => exam.questions,
        );
        console.log("Fetched questions:", data);

        dispatch({
          type: QuestionActionTypes.QUESTION_LIST_SUCCESS,
          payload: allQuestions,
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: QuestionActionTypes.QUESTION_LIST_FAIL,
          payload:
            err.response && err.response.data.detail
              ? err.response.data.detail
              : err.message,
        });
      }
    };

    if (userState.userInfo) {
      fetchQuestions();
    }
  }, [dispatch, userState.userInfo]);

  const allQuestions: QuestionModel[] | null = state.questions;

  return (
    <MainTemplate>
      <div className="p-8 pt-24">
        {state.loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-[30px] font-semibold text-foreground dark:text-white leading-9">
                Meus Estudos
              </h1>
              <p className="mt-2 text-base text-muted-foreground dark:text-[#9F9FA9]">
                Encontradas{" "}
                <strong className="text-foreground dark:text-white font-medium">
                  {allQuestions?.length ?? 0}
                </strong>{" "}
                questões
              </p>
            </div>

            {!allQuestions || allQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                {state.error && (
                  <p className="mb-4 text-red-500">{state.error}</p>
                )}
                <h2 className="text-3xl font-bold mb-4">No Questions Found</h2>
                <p className="text-lg text-muted-foreground">
                  You have not created any questions yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {state.questions.map((q) => (
                  <Link
                    to={`/questions/${q.id}`}
                    key={`link-question-${q.id}`}
                    state={{ question: q }}
                  >
                    <Card area={q.area} stem={q.stem} topic={q.topic} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainTemplate>
  );
}
