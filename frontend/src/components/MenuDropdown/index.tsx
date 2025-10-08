import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import {
  ToggleLeftIcon,
  ToggleRightIcon,
  MenuIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Link, useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { UserActionTypes } from "../../actions/userActions";

export function MenuDropdown() {
  const navigate = useNavigate();
  const { theme, changeTheme } = useTheme();
  const { state: userInfo, dispatch } = useUserContext();

  function handleLogout(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    dispatch({ type: UserActionTypes.USER_LOGOUT });
    navigate("/login");
  }

  const NextThemeIcon = {
    dark: <MoonIcon size={32} />,
    light: <SunIcon size={32} />,
    system: theme === "dark" ? <MoonIcon size={32} /> : <SunIcon size={32} />,
  };

  const NextToggleIcon = {
    dark: <ToggleRightIcon size={32} />,
    light: <ToggleLeftIcon size={32} />,
    system:
      theme === "dark" ? (
        <ToggleRightIcon size={32} />
      ) : (
        <ToggleLeftIcon size={32} />
      ),
  };

  function handleChangeTheme(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    event.preventDefault();
    changeTheme();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        <a href="#">
          <MenuIcon size={32} />
        </a>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="mr-2 mt-7 w-80 border-2 rounded-lg bg-primary-foreground"
        align="center"
      >
        <DropdownMenuGroup className="flex flex-col p-4 gap-4">
          <DropdownMenuItem className="outline-none cursor-pointer p-2">
            <ul className="flex flex-row items-center justify-between">
              <li>
                <a
                  href="#"
                  aria-label="Change Theme"
                  title="Change Theme"
                  onClick={handleChangeTheme}
                >
                  {NextToggleIcon[theme]}
                </a>
              </li>

              <li>{NextThemeIcon[theme]}</li>
            </ul>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="border-1" />
        <DropdownMenuGroup className="flex flex-col p-4 gap-4">
          <DropdownMenuItem className="outline-none cursor-pointer p-2 hover:bg-accent rounded-lg hover:opacity-80">
            <a aria-label="Home" title="Home">
              Home
            </a>
          </DropdownMenuItem>

          {userInfo.userInfo && (
            <DropdownMenuItem className="outline-none cursor-pointer p-2 hover:bg-accent rounded-lg hover:opacity-80">
              <Link aria-label="Profile" title="Profile" to="/profile">
                Profile
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="border-1" />
        <DropdownMenuGroup className="flex flex-col p-4 gap-4">
          <DropdownMenuItem className="outline-none cursor-pointer p-2 hover:bg-accent rounded-lg hover:opacity-80">
            {userInfo.userInfo ? (
              <Link
                aria-label="Logout"
                title="Logout"
                to="#"
                onClick={handleLogout}
              >
                Logout
              </Link>
            ) : (
              <Link aria-label="Login" title="Login" to="/login">
                Login
              </Link>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
