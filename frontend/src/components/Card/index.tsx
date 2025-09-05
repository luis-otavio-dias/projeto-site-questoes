import React from "react";

interface CardProps {
  children?: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className=" bg-card border rounded-2xl w-[311px] h-[190px]">
      <div className="p-5 text-2xl">{children}</div>
    </div>
  );
}
