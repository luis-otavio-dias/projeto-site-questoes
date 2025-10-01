import { Link } from "react-router";
import { Menu } from "../Menu";
import { MenuDropdown } from "../MenuDropdown";

export function DefaultMenu() {
  return (
    <Menu
      title={
        <Link to="/" className="cursor-pointer">
          iStudy
        </Link>
      }
      actions={"search bar"}
      children={<MenuDropdown />}
    />
  );
}
