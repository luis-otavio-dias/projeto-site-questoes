import { cn } from "../../lib/utils";

type QuestionCommentProps = {
  id: string;
  labelText: string; // Keep for accessibility
  className?: string;
  text: string;
} & React.ComponentProps<"textarea">;

export function QuestionComment({
  id,
  labelText,
  className,
  text,
  maxLength = 500,
  ...props
}: QuestionCommentProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="sr-only">
        {labelText}
      </label>
      <textarea
        id={id}
        maxLength={maxLength}
        className={cn(
          [
            "text-justify",
            "text-lg", // Adjusted size for comments
            "p-3.5",
            "outline-none",
            "border-accent",
            "border-2",
            "rounded-2xl",
            "transition-all",
            "ease-in-out",
            "placeholder:text-gray-500",
            "placeholder:italic",
            "min-h-[100px]", // Minimum height for comment input
            "focus:border-accent-foreground",
            "disabled:opacity-50",
            "disabled:border-b-zinc-400",
            "resize-y", // Allow vertical resizing
          ],
          className
        )}
        value={text}
        {...props}
      />
      <div className="text-[13px] text-gray-500 self-end mr-5 mt-1">
        {text.length} / {maxLength}
      </div>
    </div>
  );
}
