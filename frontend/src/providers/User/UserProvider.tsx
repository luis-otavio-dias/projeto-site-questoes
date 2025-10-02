import { useReducer } from "react";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { userReducer } from "../../reducers/userReducer";
import { initialUserState } from "../../contexts/UserContext/initialUserState";
import type { UserModel } from "../../models/User/UserModel";

type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const stored = localStorage.getItem("userInfo");
  const initialState = {
    ...initialUserState,
    userInfo: stored ? (JSON.parse(stored) as UserModel) : null,
  };
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
