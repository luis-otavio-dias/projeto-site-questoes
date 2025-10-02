import type { UserModel } from "../models/User/UserModel";

export const UserActionTypes = {
  USER_LOGIN_REQUEST: "USER_LOGIN_REQUEST",
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
  USER_LOGIN_FAIL: "USER_LOGIN_FAIL",
  USER_LOGOUT: "USER_LOGOUT",
} as const;

export type UserActionTypes = keyof typeof UserActionTypes;

export type UserActionModel =
  | {
      type: typeof UserActionTypes.USER_LOGIN_REQUEST;
    }
  | {
      type: typeof UserActionTypes.USER_LOGIN_SUCCESS;
      payload: UserModel;
    }
  | {
      type: typeof UserActionTypes.USER_LOGIN_FAIL;
      payload: string;
    }
  | {
      type: typeof UserActionTypes.USER_LOGOUT;
    };
