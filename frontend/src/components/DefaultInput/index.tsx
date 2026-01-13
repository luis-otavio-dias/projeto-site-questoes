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
        <div className={cn("flex items-center gap-2", className)}>
          <input id={id} type={type} className="hidden" {...props} />
          <label htmlFor={id}>
            <span>{labelText}</span>
          </label>
        </div>
      )}

      {!labelInline && (
        <>
          <label htmlFor={id}> {labelText} </label>
          <input
            id={id}
            type={type}
            className={cn(
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
