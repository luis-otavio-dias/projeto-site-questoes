import type { UserModel } from "./UserModel";

export type UserStateModel = {
  userInfo: UserModel | null;
  loading: boolean;
  error: string | null;
};
