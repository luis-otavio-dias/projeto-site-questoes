import { cn } from "../../lib/utils";

type MenuProps = {
  className?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

export function Menu({ className, title, actions, children }: MenuProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center p-4 text-primary border-b-2",
        className
      )}
    >
      <div className="flex items-center ml-5 ">
        <h1 className="text-4xl font-bold"> {title} </h1>
      </div>

      <nav className="flex flex-row items-center justify-between gap-8 font-semibold w-full">
        <div className="flex m-auto items-center justify-center rounded-lg">
          {actions}
        </div>

        <div className="flex items-center mr-5">{children}</div>
      </nav>
    </div>
  );
}
