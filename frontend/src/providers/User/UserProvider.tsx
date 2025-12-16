import { useEffect, useReducer } from "react";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { userReducer } from "../../reducers/userReducer";
import { initialUserState } from "../../contexts/UserContext/initialUserState";
import type { UserModel } from "../../models/User/UserModel";
import { api } from "../../services/api";
import { UserActionTypes } from "../../actions/userActions";

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get<UserModel>("/users/me/profile/");

        dispatch({ type: "USER_DETAILS_SUCCESS", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (err: any) {
        console.error("Failed to fetch user details", err);

        if (err.response && err.response.status === 401) {
          try {
            await api.post("/users/refresh/");

            const { data } = await api.get<UserModel>("/users/me/profile/");

            dispatch({ type: "USER_DETAILS_SUCCESS", payload: data });
            localStorage.setItem("userInfo", JSON.stringify(data));
          } catch (err: any) {
            console.error("Refresh token error:", err);

            // Tentar fazer logout, mas não depender do resultado
            try {
              await api.post("/users/logout/");
            } catch (logoutErr) {
              console.error(
                "Logout failed (expected if tokens expired):",
                logoutErr
              );
            }

            // Sempre limpar o estado local, independente do logout
            localStorage.removeItem("userInfo");
            dispatch({ type: UserActionTypes.USER_LOGOUT });
          }
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
