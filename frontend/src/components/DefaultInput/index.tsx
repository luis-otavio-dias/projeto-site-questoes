import { cn } from "../../lib/utils";

type DefaultInputProps = {
  id: string;
  labelText: string;
  className?: string;
} & React.ComponentProps<"input">;

export function DefaultInput({
  id,
  type,
  labelText,
  className,
  ...props
}: DefaultInputProps) {
  return (
    <div>
      <input id={id} type={type} {...props} className={cn("", className)} />
      <label htmlFor={id}> {labelText} </label>
    </div>
  );
}
