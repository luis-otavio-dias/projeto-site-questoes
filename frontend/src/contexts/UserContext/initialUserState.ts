import type { UserStateModel } from "../../models/User/UserStateModel";

export const initialUserState: UserStateModel = {
  userInfo: null,
  loading: false,
  error: null,
};
