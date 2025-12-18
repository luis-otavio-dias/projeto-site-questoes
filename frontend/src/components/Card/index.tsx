import React from "react";
import { cn } from "../../lib/utils";
import { X, Check } from "lucide-react";

interface CardProps {
  top?: React.ReactNode;
  content?: React.ReactNode;
  bottom?: React.ReactNode;
}

export function Card({ top, content, bottom }: CardProps) {
  return (
    <div
      className={cn([
        "bg-card",
        "grid",
        "grid-rows-[15%_1fr_25%]",
        "grid-cols-1",
        "border-2",
        "rounded-2xl",
        "w-[311px]",
        "h-[190px]",
        "hover:border",
        "dark:hover:border-primary",
        "dark:hover:bg-white/10",
        "hover:border-accent-foreground/60",
        "hover:bg-accent-foreground/5",
        "hover:cursor-pointer",
      ])}
    >
      <div className="p-5 text-sm text-center text-foreground/80 font-semibold flex items-center justify-center col-span-full border-b-2 ">
        {top}
      </div>
      <div className="p-5 text-2xl border-b-2 overflow-auto text-foreground/80">
        {content}
      </div>
      <div className="flex items-center justify-center group">
        <div className="group-hover:hidden flex items-center justify-between w-full px-4">
          <div className="flex flex-row gap-4">
            <div className="w-12 h-2 bg-green-500 rounded-full"></div>
            <div className="w-12 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-12 h-2 bg-red-500 rounded-full"></div>
          </div>

          <div className="rounded-full bg-red-500 w-8 h-8 flex items-center justify-center">
            <X className="text-white m-1" />
          </div>
          {/* <div className="rounded-full bg-green-500 w-8 h-8 flex items-center justify-center">
            <Check className="text-white m-1" />
          </div> */}
        </div>
        <div
          className={cn([
            "rounded-2xl",
            "bg-primary",
            "min-w-[95%]",
            "min-h-[80%]",
            "flex",
            "items-center",
            "justify-center",
            "border-2",
            "dark:hover:border-foreground",
            "hover:border-foreground",
            "hover:cursor-pointer",
            "transition-all",
            "duration-300",
            "hidden",
            "group-hover:flex",
          ])}
        >
          <p className="font-semibold text-accent text-center">{bottom}</p>
        </div>
      </div>
    </div>
  );
}
