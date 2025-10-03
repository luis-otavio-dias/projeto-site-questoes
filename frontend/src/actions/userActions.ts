import type { UserModel } from "../models/User/UserModel";

export const UserActionTypes = {
  USER_LOGIN_REQUEST: "USER_LOGIN_REQUEST",
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
  USER_LOGIN_FAIL: "USER_LOGIN_FAIL",
  USER_LOGOUT: "USER_LOGOUT",
  USER_REGISTER_REQUEST: "USER_REGISTER_REQUEST",
  USER_REGISTER_SUCCESS: "USER_REGISTER_SUCCESS",
  USER_REGISTER_FAIL: "USER_REGISTER_FAIL",
} as const;

export type UserActionTypes = keyof typeof UserActionTypes;

export type UserActionLogin =
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

export type UserActionRegister =
  | {
      type: typeof UserActionTypes.USER_REGISTER_REQUEST;
    }
  | {
      type: typeof UserActionTypes.USER_REGISTER_SUCCESS;
      payload: UserModel;
    }
  | {
      type: typeof UserActionTypes.USER_REGISTER_FAIL;
      payload: string;
    };

export type UserActionModel = UserActionLogin | UserActionRegister;
