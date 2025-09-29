import {
  QuestionActionTypes,
  type QuestionActionModel,
} from "../actions/questionActions";
import type {
  QuestionDetailsStateModel,
  QuestionStateModel,
} from "../models/Question/QuestionStateModel";

export function questionReducer(
  state: QuestionStateModel,
  action: QuestionActionModel
): QuestionStateModel {
  switch (action.type) {
    case QuestionActionTypes.QUESTION_LIST_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case QuestionActionTypes.QUESTION_LIST_SUCCESS: {
      return { ...state, loading: false, questions: action.payload };
    }
    case QuestionActionTypes.QUESTION_LIST_FAIL: {
      return { ...state, loading: false, error: action.payload, questions: [] };
    }
  }
  return state;
}

export function questionDetailsReducer(
  state: QuestionDetailsStateModel,
  action: QuestionActionModel
): QuestionDetailsStateModel {
  switch (action.type) {
    case QuestionActionTypes.QUESTION_DETAILS_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case QuestionActionTypes.QUESTION_DETAILS_SUCCESS: {
      return { ...state, loading: false, question: action.payload };
    }
    case QuestionActionTypes.QUESTION_DETAILS_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload,
        question: null,
      };
    }
  }

  return state;
}
