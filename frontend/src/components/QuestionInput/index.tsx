import { cn } from "../../lib/utils";

type QuestionInputProps = {
  id: string;
  option: string;
  optionText: string;
  className?: string;
  isSelected?: boolean;
} & Omit<React.ComponentProps<"input">, "checked">;

export function QuestionInput({
  id,
  option,
  optionText,
  className,
  isSelected,
  onChange,
  ...props
}: QuestionInputProps) {
  return (
    <div className="w-full relative">
      <input
        {...props}
        id={id}
        type="radio"
        className="sr-only"
        checked={isSelected}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-5 cursor-pointer w-full h-full",
          className,
          isSelected && "bg-secondary/20 border-primary/40"
        )}
      >
        <span className="text-3xl font-bold">({option}) </span>
        <span className="select-none">{optionText}</span>
      </label>
    </div>
  );
}
