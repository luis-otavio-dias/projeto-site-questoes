import type { QuestionModel } from "../models/Question/QuestionModel";

export const QuestionActionTypes = {
  QUESTION_LIST_REQUEST: "QUESTION_LIST_REQUEST",
  QUESTION_LIST_SUCCESS: "QUESTION_LIST_SUCCESS",
  QUESTION_LIST_FAIL: "QUESTION_LIST_FAIL",
  QUESTION_DETAILS_REQUEST: "QUESTION_DETAILS_REQUEST",
  QUESTION_DETAILS_SUCCESS: "QUESTION_DETAILS_SUCCESS",
  QUESTION_DETAILS_FAIL: "QUESTION_DETAILS_FAIL",
} as const;

export type QuestionActionTypes = keyof typeof QuestionActionTypes;

export type QuestionActionWithoutPayload =
  | {
      type: typeof QuestionActionTypes.QUESTION_LIST_REQUEST;
    }
  | {
      type: typeof QuestionActionTypes.QUESTION_DETAILS_REQUEST;
    };

export type QuestionActionWithPayload =
  | {
      type: typeof QuestionActionTypes.QUESTION_LIST_SUCCESS;
      payload: QuestionModel[];
    }
  | {
      type: typeof QuestionActionTypes.QUESTION_LIST_FAIL;
      payload: string;
    }
  | {
      type: typeof QuestionActionTypes.QUESTION_DETAILS_SUCCESS;
      payload: QuestionModel;
    }
  | {
      type: typeof QuestionActionTypes.QUESTION_DETAILS_FAIL;
      payload: string;
    };

export type QuestionActionModel =
  | QuestionActionWithoutPayload
  | QuestionActionWithPayload;
