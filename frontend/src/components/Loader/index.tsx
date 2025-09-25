import { Loader2Icon } from "lucide-react";

export function Loader() {
  return (
    <Loader2Icon
      size={"100px"}
      strokeWidth={1}
      className="text-primary animate-spin"
    ></Loader2Icon>
  );
}
