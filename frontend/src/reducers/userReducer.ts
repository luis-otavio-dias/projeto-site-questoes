import { UserActionTypes, type UserActionModel } from "../actions/userActions";
import type { UserStateModel } from "../models/User/UserStateModel";

export function userReducer(
  state: UserStateModel,
  action: UserActionModel
): UserStateModel {
  switch (action.type) {
    case UserActionTypes.USER_LOGIN_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case UserActionTypes.USER_LOGIN_SUCCESS: {
      return { ...state, loading: false, userInfo: action.payload };
    }
    case UserActionTypes.USER_LOGIN_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload,
        userInfo: null,
      };
    }
    case UserActionTypes.USER_LOGOUT: {
      return { ...state, userInfo: null, error: null };
    }
    case UserActionTypes.USER_REGISTER_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case UserActionTypes.USER_REGISTER_SUCCESS: {
      return { ...state, loading: false, userInfo: action.payload };
    }
    case UserActionTypes.USER_REGISTER_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload,
        userInfo: null,
      };
    }
  }

  return state;
}
