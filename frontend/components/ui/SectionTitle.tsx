import { ReactNode } from "react";
import clsx from "clsx";

interface SectionTitleProps {
  title: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        "mb-12",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
