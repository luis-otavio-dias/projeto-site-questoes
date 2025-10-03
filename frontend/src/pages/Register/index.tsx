import { Link, useNavigate } from "react-router";
import { FormContainerTemplate } from "../../templates/FormContainerTemplate";
import { RegisterForm } from "../../components/RegisterForm";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useState } from "react";
import { UserActionTypes } from "../../actions/userActions";
import axios from "axios";
import { Loader } from "../../components/Loader";

export function Register() {
  const { state, dispatch } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: UserActionTypes.USER_REGISTER_REQUEST });

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/register/",
        {
          username: username,
          password: password,
          passwordConfirm: passwordConfirm,
        },
        config
      );

      dispatch({ type: UserActionTypes.USER_REGISTER_SUCCESS, payload: data });

      dispatch({ type: UserActionTypes.USER_LOGIN_SUCCESS, payload: data });

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/");
    } catch (err: any) {
      dispatch({
        type: UserActionTypes.USER_REGISTER_FAIL,
        payload:
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message,
      });
      // console.log(err.response.data.detail);
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
            username={username}
            password={password}
            passwordConfirm={passwordConfirm}
            onUsernameChange={(e) => setUsername(e.target.value)}
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
