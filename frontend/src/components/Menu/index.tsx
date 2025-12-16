import { cn } from "../../lib/utils";

type MenuProps = {
  className?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

export function Menu({ className, title, actions, children }: MenuProps) {
  return (
    <div className={cn("grid grid-cols-8 col-span-6 border-b-2", className)}>
      <div className="w-30 h-20 flex justify-center items-center">
        <h1 className="text-4xl font-bold"> {title} </h1>
      </div>

      <nav className="col-span-7 flex items-center justify-end">
        <div className="m-5 hover:opacity-80 cursor-pointer">{actions}</div>

        <div className="m-5 hover:opacity-80 cursor-pointer">{children}</div>
      </nav>
    </div>
  );
}
