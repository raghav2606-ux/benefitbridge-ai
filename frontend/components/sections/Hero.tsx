"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Compass, Search, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";

const highlights = [
  ["Verified", "Government schemes"],
  ["Clear", "Eligibility criteria"],
  ["Official", "Application links"],
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.42),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.25),transparent_28%),linear-gradient(135deg,#0f172a_0%,#111c3a_55%,#0f172a_100%)] bg-[size:36px_36px,36px_36px,auto,auto,auto]" />
      <div className="absolute -left-32 top-1/3 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-28 bottom-0 -z-10 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 shadow-lg shadow-blue-950/20 backdrop-blur"><BadgeCheck className="h-4 w-4 text-cyan-300" /> Government scheme discovery, made clearer</div>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">Find Government Schemes Powered by <span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 bg-clip-text text-transparent">AI</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">Discover credible benefit options, understand the criteria that matter, and take the next step through official application portals.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/eligibility" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 shadow-xl shadow-blue-950/30 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900">Check eligibility <ArrowRight className="h-4 w-4" /></Link><Link href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"><Search className="h-4 w-4" /> Learn more</Link></div>
            <div className="mt-12 grid grid-cols-3 gap-3 border-t border-white/10 pt-7 sm:max-w-xl sm:gap-6">{highlights.map(([value, label]) => <div key={label}><p className="text-2xl font-extrabold text-white sm:text-3xl">{value}</p><p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">{label}</p></div>)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/15 bg-white/[0.09] p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-xl sm:p-6">
              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl sm:p-6"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100"><Compass className="h-5 w-5 text-blue-700" /></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Profile ready</span></div><p className="mt-6 text-sm font-semibold text-slate-500">YOUR BENEFIT PATH</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight">One clear next step at a time.</h2><div className="mt-6 space-y-3">{[["1", "Share your details", "We match only the criteria you provide."], ["2", "Review your matches", "See benefits, documents, and deadlines."], ["3", "Apply officially", "Continue to the verified portal."]].map(([step, title, detail]) => <div key={step} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{step}</span><div><p className="font-bold text-slate-800">{title}</p><p className="text-sm text-slate-500">{detail}</p></div></div>)}</div></div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-cyan-50"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" /> Your information is used to evaluate the current eligibility check.</div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
