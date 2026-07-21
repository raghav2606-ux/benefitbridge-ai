import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950"><Container><div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between"><p>BenefitBridge AI helps you explore recorded government schemes.</p><nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-2"><Link className="hover:text-blue-600 dark:hover:text-blue-300" href="/schemes">Schemes</Link><Link className="hover:text-blue-600 dark:hover:text-blue-300" href="/eligibility">Eligibility</Link><Link className="hover:text-blue-600 dark:hover:text-blue-300" href="/compare">Compare</Link><Link className="hover:text-blue-600 dark:hover:text-blue-300" href="/dashboard">Dashboard</Link></nav></div></Container></footer>;
}
