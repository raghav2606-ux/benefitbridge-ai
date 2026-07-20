import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  hover = true,
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60 dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-black/20",
        "transition-all duration-300 ease-out",
        hover && "hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10 dark:hover:border-blue-700 dark:hover:shadow-black/30",
        className
      )}
    >
      {children}
    </div>
  );
}
