import { createContext } from "react";
import type { UserActionModel } from "../../actions/userActions";
import type { UserStateModel } from "../../models/User/UserStateModel";
import { initialUserState } from "./initialUserState";

type UserContextProps = {
  state: UserStateModel;
  dispatch: React.Dispatch<UserActionModel>;
};

const initialContextValue = {
  state: initialUserState,
  dispatch: () => {},
};

export const UserContext = createContext<UserContextProps>(initialContextValue);
