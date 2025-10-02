import { Link, useNavigate } from "react-router";
import { DefaultInput } from "../../components/DefaultInput";
import clsx from "clsx";
import { DefaultButton } from "../../components/DefaultButton";
import { FormContainerTemplate } from "../../templates/FormContainerTemplate";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useState } from "react";
import { UserActionTypes } from "../../actions/userActions";
import axios from "axios";
import { Loader } from "../../components/Loader";

export function Login() {
  const { state, dispatch } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: UserActionTypes.USER_LOGIN_REQUEST });

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/login/",
        {
          username: username,
          password: password,
        },
        config
      );

      dispatch({ type: UserActionTypes.USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      dispatch({
        type: UserActionTypes.USER_LOGIN_FAIL,
        payload: "Error logging in",
      });
    }
  };

  return (
    <FormContainerTemplate>
      {state.loading && <Loader />}

      {state.error && <p className="text-red-500">{state.error}</p>}

      <>
        <div className="border-b-2 w-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-accent-foreground">Login</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col  items-center justify-center gap-10"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <DefaultInput
              id="username"
              labelInline={false}
              labelText="Username"
              placeholder="Your username here"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <DefaultInput
              id="password"
              labelInline={false}
              labelText="Password"
              placeholder="Your password here"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <DefaultButton
              icon="Login"
              type="submit"
              className={clsx([
                "mt-4",
                "w-[260px]",
                "h-[43px]",
                "font-bold",
                "border-transparent",
                "border-2",
                "bg-primary",
                "text-primary-foreground",
                "dark:bg-primary",
                "dark:text-primary-foreground",
                "hover:border-foreground",
                "hover:opacity-80",
                "transition-colors",
              ])}
            />
          </div>
        </form>

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
    </FormContainerTemplate>
  );
}
