import clsx from "clsx";
import { DefaultButton } from "../DefaultButton";
import { cn } from "../../lib/utils";

type DefaultFormProps = {
  children: React.ReactNode;
  className?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonDisabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function DefaultForm({
  children,
  className,
  buttonText,
  buttonIcon,
  buttonDisabled,
  onClick,
  onSubmit,
}: DefaultFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col items-center justify-center gap-10",
        className
      )}
    >
      {children}
      <div className="flex flex-col items-center justify-center gap-2">
        <DefaultButton
          icon={buttonIcon || buttonText}
          type="submit"
          onClick={onClick}
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
            "disabled:cursor-default",
            "disabled:border-none",
            "disabled:bg-muted-foreground",
            "disabled:hover:opacity-100",
          ])}
          disabled={buttonDisabled}
        />
      </div>
    </form>
  );
}
