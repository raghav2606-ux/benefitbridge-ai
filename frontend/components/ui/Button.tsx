import React from "react";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold",
        "transition-all duration-200 ease-out active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        {
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-600/25":
            variant === "primary",

          "bg-slate-900 text-white shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-slate-800":
            variant === "secondary",

          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-300":
            variant === "outline",

          "w-full": fullWidth,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {isLoading ? "Checking your profile…" : children}
    </button>
  );
}
