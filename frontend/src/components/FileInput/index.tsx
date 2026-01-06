import { cn } from "../../lib/utils";

type FileInputProps = {
  id: string;
  labelInline?: boolean;
  labelText: string;
  fileName?: string;
  className?: string;
} & React.ComponentProps<"input">;

export function FileInput({
  id,
  labelInline,
  labelText,
  fileName,
  className,
  ...props
}: FileInputProps) {
  return (
    <>
      {labelInline && (
        <div className="flex items-center gap-2">
          <input id={id} type="file" className={cn("", className)} {...props} />
          <label htmlFor={id}>{labelText}</label>
        </div>
      )}

      {!labelInline && (
        <div className="flex flex-col gap-1">
          <span className="text-center "> {labelText} </span>
          <label
            htmlFor={id}
            className={cn([
              "w-[260px]",
              "h-[80px]",
              "border-2",
              "border-dashed",
              "border-gray-300",
              "dark:border-gray-600",
              "rounded-2xl",
              "text-center",
              "hover:bg-gray-50",
              "dark:hover:bg-zinc-700/50",
              "transition-colors",
              "cursor-pointer",
              "flex",
              "items-center",
              "justify-center",
              className,
            ])}
          >
            <p className="text-gray-600 dark:text-gray-300 text-[15px]">
              {fileName || "Arraste o arquivo aqui ou clique para selecionar"}
            </p>
            <input id={id} type="file" className="hidden" {...props} />
          </label>
        </div>
      )}
    </>
  );
}
