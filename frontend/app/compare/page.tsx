import Link from "next/link";
import Container from "@/components/ui/Container";

export default function ComparePage() {
  return <Container className="py-20"><h1 className="text-5xl font-bold text-slate-900 dark:text-white">Compare Schemes</h1><p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Use the scheme directory to review official benefits and eligibility information. A full comparison needs two saved scheme selections, which you can make after browsing the current catalogue.</p><Link href="/schemes" className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Browse schemes</Link></Container>;
}
