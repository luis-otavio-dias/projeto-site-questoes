import clsx from "clsx";
import { cn } from "../../lib/utils";

type DefaultInputProps = {
  id: string;
  labelInline?: boolean;
  labelText: string;
  className?: string;
} & React.ComponentProps<"input">;

export function DefaultInput({
  id,
  type,
  labelInline,
  labelText,
  className,
  ...props
}: DefaultInputProps) {
  return (
    <>
      {labelInline && (
        <div className="flex items-center gap-2">
          <input id={id} type={type} className={cn("", className)} {...props} />
          <label htmlFor={id}>{labelText}</label>
        </div>
      )}

      {!labelInline && (
        <>
          <label htmlFor={id}> {labelText} </label>
          <input
            id={id}
            type={type}
            className={clsx(
              [
                "text-center",
                "text-3xl",
                "p-3.5",
                "outline-none",
                "border-accent",
                "border-2",
                "rounded-2xl",
                "transition-all",
                "ease-in-out",
                "placeholder:text-gray-500",
                "placeholder:italic",
                "placeholder:text-2xl",
                "focus:border-accent-foreground",
                "disabled:opacity-50",
                "disabled:border-b-zinc-400",
              ],
              className
            )}
            {...props}
          />
        </>
      )}
    </>
  );
}
