import { Link, useNavigate } from "react-router";
import { FormContainerTemplate } from "../../templates/FormContainerTemplate";
import { RegisterForm } from "../../components/RegisterForm";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useState } from "react";
import { UserActionTypes } from "../../actions/userActions";
import { api } from "../../services/api";
import { Loader } from "../../components/Loader";

export function Register() {
  const { state, dispatch } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      dispatch({
        type: UserActionTypes.USER_REGISTER_FAIL,
        payload: "Passwords do not match",
      });
      return;
    }

    dispatch({ type: UserActionTypes.USER_REGISTER_REQUEST });

    try {
      await api.post("/users/register/", {
        email: email,
        password: password,
      });

      const { data } = await api.post("/users/login/", {
        email: email,
        password: password,
      });

      dispatch({ type: UserActionTypes.USER_REGISTER_SUCCESS, payload: true });

      dispatch({ type: UserActionTypes.USER_LOGIN_SUCCESS, payload: data });

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/");
    } catch (err: any) {
      let errorMessage = "An error occurred";

      if (err.response && err.response.data) {
        const data = err.response.data;

        if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          const firstError = data[firstKey];

          if (Array.isArray(firstError)) {
            errorMessage = `${firstKey}: ${firstError[0]}`;

            if (firstKey === "email") {
              errorMessage = "Credenciais inválidas";
            }
          } else {
            errorMessage = String(firstError);
          }
        }
      } else {
        errorMessage = err.message;
      }

      dispatch({
        type: UserActionTypes.USER_REGISTER_FAIL,
        payload: errorMessage,
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
            <h1 className="text-5xl font-bold text-accent-foreground mb-10">
              Register
            </h1>
          </div>

          <RegisterForm
            email={email}
            password={password}
            passwordConfirm={passwordConfirm}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onPasswordConfirmChange={(e) => setPasswordConfirm(e.target.value)}
            onSubmit={handleRegister}
          />

          <div>
            <p className="text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary no-underline hover:underline hover:font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </>
      )}
    </FormContainerTemplate>
  );
}
