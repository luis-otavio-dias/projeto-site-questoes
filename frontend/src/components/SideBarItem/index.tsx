import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

type SideBarItemProps = {
  icon: LucideIcon;
  text: string;
  to?: string;
  onClick?: () => void;
};

export function SideBarItem({
  icon: Icon,
  text,
  to,
  onClick,
}: SideBarItemProps) {
  return onClick ? (
    <button
      onClick={onClick}
      className="grid grid-cols-[40px_1fr] items-center gap-4 px-4 h-18 font-medium text-accent-foreground/80 hover:bg-accent-foreground/10 cursor-pointer transition-all hover:text-primary/70"
    >
      <Icon className="h-8 w-8 justify-self-center" />
      <p className="text-left text-[15px]">{text}</p>
    </button>
  ) : (
    <Link
      to={to ?? "#"}
      className="grid grid-cols-[40px_1fr] items-center gap-4 px-4 h-18 font-medium text-accent-foreground/80 hover:bg-accent-foreground/10 cursor-pointer transition-all hover:text-primary/70"
    >
      <Icon className="h-8 w-8 justify-self-center" />
      <p className="text-left text-[15px]">{text}</p>
    </Link>
  );
  // <Link
  //   to={to}
  //   className="grid grid-cols-[40px_1fr] items-center gap-4 px-4 h-18 font-medium text-accent-foreground/80 hover:bg-accent-foreground/10 cursor-pointer transition-all hover:text-primary/70"
  // >
  //   <Icon className="h-8 w-8 justify-self-center" />
  //   <p className="text-left text-[15px]">{text}</p>
  // </Link>
}
