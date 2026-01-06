import clsx from "clsx";
import { DefaultButton } from "../DefaultButton";
import { cn } from "../../lib/utils";

type DefaultFormProps = {
  children: React.ReactNode;
  className?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonDisabled?: boolean;
  cancelButton?: boolean;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function DefaultForm({
  children,
  className,
  buttonText,
  buttonIcon,
  buttonDisabled,
  cancelButton,
  onClose,
  onClick,
  onSubmit,
}: DefaultFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        className
      )}
    >
      {children}

      <div className="flex flex-col gap-1 mt-4">
        <DefaultButton
          icon={buttonIcon || buttonText}
          type="submit"
          onClick={onClick}
          className={clsx([
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
        {cancelButton && (
          <DefaultButton
            icon={"Cancelar"}
            type="submit"
            onClick={onClose}
            className={clsx([
              "w-[260px]",
              "h-[43px]",
              "mt-2",
              "font-bold",
              "border-transparent",
              "border-2",
              "text-primary",
              "dark:text-muted-foreground",
              "hover:bg-accent-foreground/30",
              "transition-colors",
              "disabled:cursor-default",
              "disabled:border-none",
              "disabled:bg-muted-foreground",
              "disabled:hover:opacity-100",
            ])}
          />
        )}
      </div>
    </form>
  );
}
