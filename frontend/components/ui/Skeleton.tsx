import clsx from "clsx";

interface Props { className?: string; }

export default function Skeleton({ className }: Props) {
  return <div aria-hidden="true" className={clsx("animate-pulse rounded-xl bg-slate-200/80", className)} />;
}
