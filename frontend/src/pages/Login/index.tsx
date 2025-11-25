import { Link, useNavigate } from "react-router";
import { FormContainerTemplate } from "../../templates/FormContainerTemplate";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useState } from "react";
import { UserActionTypes } from "../../actions/userActions";
import { Loader } from "../../components/Loader";
import { LoginForm } from "../../components/LoginForm";

import { api } from "../../services/api";

export function Login() {
  const { state, dispatch } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: UserActionTypes.USER_LOGIN_REQUEST });

    try {
      const { data } = await api.post("/users/login/", {
        email: email,
        password: password,
      });

      dispatch({ type: UserActionTypes.USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (err: any) {
      dispatch({
        type: UserActionTypes.USER_LOGIN_FAIL,
        payload:
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message,
      });
    }
  };

  return (
    <FormContainerTemplate>
      {state.loading ? (
        <Loader />
      ) : (
        <>
          {state.error && <p className="text-red-500">{state.error}</p>}

          <div className="border-b-2 w-full flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-accent-foreground">Login</h1>
          </div>

          <LoginForm
            email={email}
            password={password}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
          />

          <div>
            <p className="text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary no-underline hover:underline hover:font-semibold"
              >
                Register
              </Link>
            </p>
          </div>
        </>
      )}
    </FormContainerTemplate>
  );
}
