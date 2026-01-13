import clsx from "clsx";
import { DefaultButton } from "../DefaultButton";
import { cn } from "../../lib/utils";

type QuestionFormProps = {
  children: React.ReactNode;
  className?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonDisabled?: boolean;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function QuestionForm({
  children,
  className,
  buttonText,
  buttonIcon,
  buttonDisabled,
  onClick,
  onSubmit,
}: QuestionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        className
      )}
    >
      {children}

      <div className="w-full mt-4">
        <DefaultButton
          icon={buttonIcon || buttonText}
          type="submit"
          onClick={onClick}
          className={clsx([
            "w-full",
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
