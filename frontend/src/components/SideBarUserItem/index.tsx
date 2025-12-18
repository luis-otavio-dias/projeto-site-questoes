import { Link, useNavigate } from "react-router";
import { User2Icon, SettingsIcon, LogOutIcon } from "lucide-react";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { UserActionTypes } from "../../actions/userActions";
import { api } from "../../services/api";

export function SideBarUserItem() {
  const { state, dispatch } = useUserContext();
  const navigate = useNavigate();

  const userInfo = state.userInfo;

  async function handleLogout(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    await api.post("/users/logout/");
    dispatch({ type: UserActionTypes.USER_LOGOUT });
    navigate("/login");
  }

  return (
    <li className="grid grid-cols-[1fr_50%_auto] items-center gap-5 px-4 h-20 font-medium text-accent-foreground/80 ">
      <User2Icon className="h-7 w-7 justify-self-center border" />
      <span className="flex items-center text-left h-18 text-[10px] border">
        {userInfo?.name || "Name"}
      </span>
      <div className="flex gap-3">
        <Link to="/configuracoes">
          <SettingsIcon
            aria-label="Configurações"
            className="h-10 w-8 cursor-pointer hover:text-primary transition-colors border"
          />
        </Link>
        <Link to="#" onClick={handleLogout}>
          <LogOutIcon className="h-10 w-8 cursor-pointer hover:text-red-500 transition-colors border" />
        </Link>
      </div>
    </li>
  );
}
