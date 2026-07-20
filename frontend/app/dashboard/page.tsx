import Link from "next/link";
import Container from "@/components/ui/Container";

export default function DashboardPage() {
  return <Container className="py-20"><h1 className="text-5xl font-bold text-slate-900 dark:text-white">Your Dashboard</h1><p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">BenefitBridge does not retain personal profiles or application data in this MVP. Check eligibility whenever you need an updated result and apply through the official portal.</p><Link href="/eligibility" className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Check eligibility</Link></Container>;
}
