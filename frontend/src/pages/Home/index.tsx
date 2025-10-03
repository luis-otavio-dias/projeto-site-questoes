import { Card } from "../../components/Card";
import { Loader } from "../../components/Loader";
import { MainTemplate } from "../../templates/MainTemplate";
import { useQuestionContext } from "../../contexts/QuestionContext/useQuestionContext";
import { QuestionActionTypes } from "../../actions/questionActions";
import type { QuestionModel } from "../../models/Question/QuestionModel";
import { useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useUserContext } from "../../contexts/UserContext/useUserContext";

export function Home() {
  const { state, dispatch } = useQuestionContext();
  const { state: userState } = useUserContext();

  useEffect(() => {
    const fetchQuestions = async () => {
      dispatch({ type: QuestionActionTypes.QUESTION_LIST_REQUEST });

      try {
        const { data } = await axios.get<QuestionModel[]>(
          "/api/users/me/questions/",
          {
            headers: {
              Authorization: `Bearer ${userState.userInfo?.token}`,
            },
          }
        );

        dispatch({
          type: QuestionActionTypes.QUESTION_LIST_SUCCESS,
          payload: data,
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
    fetchQuestions();
  }, [dispatch, userState.userInfo]);

  const userQuestions: QuestionModel[] | null = state.questions;

  return (
    <MainTemplate>
      {!userQuestions ||
        (userQuestions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold mb-4">No Questions Found</h2>
            <p className="text-lg text-muted-foreground">
              You have not created any questions yet.
            </p>
          </div>
        ))}

      {state.loading ? (
        <Loader />
      ) : (
        Array.isArray(state.questions) &&
        state.questions.map((q) => (
          <Link
            to={`/questions/${q.id}`}
            key={`link-question-${q.id}`}
            state={{ question: q }}
          >
            <Card key={`question-${q.id}`}>
              <p className="mb-2 text-muted-foreground">
                {q.theme.name} | {q.edition.year}
              </p>
              <div>{q.stem}</div>
            </Card>
          </Link>
        ))
      )}

      {state.error && <p>{state.error}</p>}
    </MainTemplate>
  );
}
