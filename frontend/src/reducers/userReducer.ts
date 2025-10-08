import { UserActionTypes, type UserActionModel } from "../actions/userActions";
import { initialUserState } from "../contexts/UserContext/initialUserState";
import type { UserStateModel } from "../models/User/UserStateModel";

export function userReducer(
  state: UserStateModel,
  action: UserActionModel
): UserStateModel {
  switch (action.type) {
    // LOGIN
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

    // LOGOUT
    case UserActionTypes.USER_LOGOUT: {
      return { ...initialUserState };
    }

    // REGISTER
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

    // DETAILS
    case UserActionTypes.USER_DETAILS_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case UserActionTypes.USER_DETAILS_SUCCESS: {
      return { ...state, loading: false, userInfo: action.payload };
    }
    case UserActionTypes.USER_DETAILS_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload,
        userInfo: null,
      };
    }

    // UPDATE PROFILE
    case UserActionTypes.USER_UPDATE_PROFILE_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case UserActionTypes.USER_UPDATE_PROFILE_SUCCESS: {
      return { ...state, loading: false, userInfo: action.payload };
    }
    case UserActionTypes.USER_UPDATE_PROFILE_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload,
        userInfo: null,
      };
    }

    default:
      return state;
  }
}
