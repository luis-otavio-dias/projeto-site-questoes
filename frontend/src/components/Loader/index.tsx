import { Loader2Icon } from "lucide-react";
import { cn } from "../../lib/utils";

type LoaderProps = {
  className?: string;
};

export function Loader({ className }: LoaderProps) {
  return (
    <Loader2Icon
      size={"100px"}
      strokeWidth={1}
      className={cn("text-primary animate-spin", className)}
    ></Loader2Icon>
  );
}
