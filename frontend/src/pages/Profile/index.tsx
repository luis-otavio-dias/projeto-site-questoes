import { RegisterForm } from "../../components/RegisterForm";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { MainTemplate } from "../../templates/MainTemplate";
import axios from "axios";
import { UserActionTypes } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormContainerTemplate } from "../../templates/FormContainerTemplate";

export function Profile() {
  // const { state: userInfo } = useUserContext();
  const { state, dispatch } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const userInfo = state.userInfo;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: UserActionTypes.USER_DETAILS_REQUEST });
    const fetchUserDetails = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        const { data } = await axios.get("/api/users/profile/", config);
        dispatch({ type: UserActionTypes.USER_DETAILS_SUCCESS, payload: data });
        setUsername(data.username);
      } catch (err: any) {
        dispatch({
          type: UserActionTypes.USER_DETAILS_FAIL,
          payload:
            err.response && err.response.data.detail
              ? err.response.data.detail
              : err.message,
        });
      }
    };

    if (userInfo?.token) {
      fetchUserDetails();
    }
  }, [dispatch, userInfo?.token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: UserActionTypes.USER_UPDATE_PROFILE_REQUEST });

    if (password !== passwordConfirm) {
      dispatch({
        type: UserActionTypes.USER_UPDATE_PROFILE_FAIL,
        payload: "Passwords do not match",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/users/profile/update/",
        {
          username: username,
          password: password,
          passwordConfirm: passwordConfirm,
        },
        config
      );

      dispatch({
        type: UserActionTypes.USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });

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
    }
  };

  return (
    <MainTemplate>
      <FormContainerTemplate isSubContainer>
        {state.error && <p className="text-red-500">{state.error}</p>}

        <div className="border-b-2 w-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-accent-foreground mb-10">
            Update Profile
          </h1>
        </div>

        <RegisterForm
          username={username}
          password={password}
          passwordConfirm={passwordConfirm}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onPasswordConfirmChange={(e) => setPasswordConfirm(e.target.value)}
          onSubmit={handleUpdateProfile}
        />
      </FormContainerTemplate>
    </MainTemplate>
  );
}
