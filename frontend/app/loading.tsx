import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return <Container className="py-12 sm:py-20"><div className="max-w-3xl" role="status" aria-label="Loading page content"><Skeleton className="h-6 w-36" /><Skeleton className="mt-5 h-12 w-4/5" /><Skeleton className="mt-4 h-5 w-full" /></div><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"><Skeleton className="h-6 w-24" /><Skeleton className="mt-6 h-7 w-4/5" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-8 h-11 w-full" /></div>)}</div></Container>;
}
