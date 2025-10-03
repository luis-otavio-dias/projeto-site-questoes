import clsx from "clsx";
import { DefaultButton } from "../DefaultButton";

type DefaultFormProps = {
  children: React.ReactNode;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function DefaultForm({
  children,
  buttonText,
  buttonIcon,
  onSubmit,
}: DefaultFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col  items-center justify-center gap-10"
    >
      {children}
      <div className="flex flex-col items-center justify-center gap-2">
        <DefaultButton
          icon={buttonIcon || buttonText}
          type="submit"
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
          ])}
        />
      </div>
    </form>
  );
}
