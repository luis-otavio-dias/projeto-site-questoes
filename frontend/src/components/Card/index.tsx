import React from "react";
import { Link } from "react-router";

interface CardProps {
  children?: React.ReactNode;
  id?: number;
}

export function Card({ children, id }: CardProps) {
  return (
    <div className="bg-card border rounded-2xl w-[311px] h-[190px] hover:cursor-pointer hover:scale-105 transition-all duration-300">
      <Link to={`/questions/${id}`}>
        <div className="p-5 text-2xl">{children}</div>
      </Link>
    </div>
  );
}
