import { Card } from "../../components/Card";
import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { useQuestionContext } from "../../contexts/QuestionContext/useQuestionContext";
import { QuestionActionTypes } from "../../actions/questionActions";
import type { QuestionModel } from "../../models/Question/QuestionModel";
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
          (exam: any) => exam.questions,
        );
        console.log("Fetched questions:", data);

        dispatch({
          type: QuestionActionTypes.QUESTION_LIST_SUCCESS,
          payload: allQuestions,
        });
      } catch (err: any) {
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
      <div className="flex-1 mx-8 h-[90vh] mt-10 py-10 border-2 rounded-2xl overflow-auto">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-wrap gap-10 justify-center">
            {!allQuestions ||
              (allQuestions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                  {state.error && (
                    <p className="mb-4 text-red-500">{state.error}</p>
                  )}
                  <h2 className="text-3xl font-bold mb-4">
                    No Questions Found
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    You have not created any questions yet.
                  </p>
                </div>
              ))}

            {Array.isArray(state.questions) &&
              state.questions.map((q) => (
                <Link
                  to={`/questions/${q.id}`}
                  key={`link-question-${q.id}`}
                  state={{ question: q }}
                >
                  <Card
                    key={`${q.id}`}
                    top={`${q.area} | ${q.topic}`}
                    content={q.stem}
                    bottom={"RESOLVER"}
                  />
                </Link>
              ))}
          </div>
        )}
      </div>
    </MainTemplate>
  );
}
