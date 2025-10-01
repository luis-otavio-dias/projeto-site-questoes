import { cn } from "../../lib/utils";
import { Link } from "react-router";

type DefaultButtonProps = {
  icon: React.ReactNode;
  linkTo?: string;
  className?: string;
} & React.ComponentProps<"button">;

export function DefaultButton({
  icon,
  className,
  linkTo,
  ...props
}: DefaultButtonProps) {
  return (
    <>
      {linkTo && (
        <button
          {...props}
          className={cn(
            "cursor-pointer rounded-2xl w-32 h-14 disabled:bg-muted-foreground disabled:cursor-default",
            className
          )}
        >
          <Link to={`${linkTo}`}>{icon}</Link>
        </button>
      )}

      {!linkTo && (
        <button
          {...props}
          className={cn(
            "cursor-pointer rounded-2xl w-32 h-14 disabled:bg-muted-foreground disabled:cursor-default",
            className
          )}
        >
          {icon}
        </button>
      )}
    </>
  );
}
