import { cn } from "../../lib/utils";

type DefaultTextareaProps = {
  id: string;
  labelInline?: boolean;
  labelText: string;
  className?: string;
  text: string;
} & React.ComponentProps<"textarea">;

export function DefaultTextarea({
  id,
  labelInline,
  labelText,
  className,
  text,
  maxLength = 500,
  ...props
}: DefaultTextareaProps) {
  return (
    <>
      {labelInline && (
        <div className="flex items-center gap-2">
          <textarea id={id} className={cn("", className)} {...props} />
          <label htmlFor={id}>{labelText}</label>
        </div>
      )}

      {!labelInline && (
        <div className="flex flex-col">
          <label htmlFor={id} className="text-center mb-2 p-3.5">
            {" "}
            {labelText}{" "}
          </label>
          <textarea
            id={id}
            maxLength={500}
            className={cn(
              [
                "text-justify",
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
          <div className="text-[13px] self-end-safe align-text-top mr-2">
            {" "}
            {text.length} / {maxLength}{" "}
          </div>
        </div>
      )}
    </>
  );
}
