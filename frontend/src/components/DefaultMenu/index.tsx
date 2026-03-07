import { Link } from "react-router";
import { Menu } from "../Menu";
import { useTheme } from "../ThemeProvider";
import { MoonIcon, SunIcon } from "lucide-react";

export function DefaultMenu() {
  const { theme, changeTheme } = useTheme();

  const NextThemeIcon = {
    light: <MoonIcon size={32} />,
    dark: <SunIcon size={32} />,
    system: theme === "dark" ? <MoonIcon size={32} /> : <SunIcon size={32} />,
  };

  const handleChangeTheme = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    changeTheme();
  };

  return (
    <Menu
      title={
        <Link to="/" className="cursor-pointer">
          iStudy
        </Link>
      }
      actions={"search bar"}
      // children={<MenuDropdown />}
      children={
        <a
          href="#"
          aria-label="Change Theme"
          title="Change Theme"
          onClick={handleChangeTheme}
        >
          {NextThemeIcon[theme]}
        </a>
      }
    />
  );
}
