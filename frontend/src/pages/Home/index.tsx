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
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

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
      } catch (err) {
        dispatch({
          type: QuestionActionTypes.QUESTION_LIST_FAIL,
          payload: "Error fetching questions",
        });
      }
    };
    fetchQuestions();
  }, [AUTH_TOKEN]);

  return (
    <MainTemplate>
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
