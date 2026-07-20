"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  function submitSearch(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); router.push(`/eligibility?query=${encodeURIComponent(query)}`); }
  return <section className="bg-white py-20 dark:bg-slate-950"><Container><div className="mx-auto max-w-4xl text-center"><div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"><Sparkles size={18} /><span className="font-medium">Guided scheme search</span></div><h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">Start With Your Situation</h2><p className="mt-6 text-lg text-slate-600 dark:text-slate-300">Describe what you need, then confirm the required details in the eligibility form.</p><form onSubmit={submitSearch} className="mt-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20"><div className="flex flex-col gap-4 md:flex-row"><div className="flex flex-1 items-center rounded-xl border border-slate-200 px-4 dark:border-slate-700"><Search className="text-slate-400" size={20} /><input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: I am a student from Himachal Pradesh..." className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500" /></div><button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Start eligibility check</button></div></form></div></Container></section>;
}
