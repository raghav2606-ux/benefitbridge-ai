"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, BookOpen, Check, CheckCircle2, Filter, GitCompareArrows, Plus, RefreshCw, Search, SearchX } from "lucide-react";
import api, { ApiResponse, getApiErrorMessage } from "@/services/api";
import { getComparisonSchemeIds, saveComparisonSchemeIds } from "@/lib/comparison";
import { Scheme } from "@/types/scheme";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

function SchemeSkeletons() {
  return <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"><Skeleton className="h-6 w-24" /><Skeleton className="mt-6 h-7 w-4/5" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-8 h-10 w-full" /></div>)}</div>;
}

export default function SchemesPage() {
  const searchParams = useSearchParams();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const loadSchemes = useCallback(async (isRetry = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Scheme[]>>("/builder/schemes");
      setSchemes(response.data.data);
      if (isRetry) toast.success("Scheme directory refreshed.");
    } catch (requestError: unknown) {
      const message = getApiErrorMessage(requestError, "Scheme data is currently unavailable. Please try again later.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setComparisonIds(getComparisonSchemeIds());
      void loadSchemes();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadSchemes]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setQuery(searchParams.get("query")?.trim() ?? ""), 0);
    return () => window.clearTimeout(timeoutId);
  }, [searchParams]);

  const toggleComparison = (schemeId: string) => {
    if (comparisonIds.includes(schemeId)) {
      const updatedIds = comparisonIds.filter((id) => id !== schemeId);
      if (!saveComparisonSchemeIds(updatedIds)) {
        toast.error("Your comparison could not be saved in this browser.");
        return;
      }
      setComparisonIds(updatedIds);
      return;
    }

    if (comparisonIds.length === 2) {
      toast.error("You can compare only two schemes at a time.");
      return;
    }

    const updatedIds = [...comparisonIds, schemeId];
    if (!saveComparisonSchemeIds(updatedIds)) {
      toast.error("Your comparison could not be saved in this browser.");
      return;
    }
    setComparisonIds(updatedIds);
    toast.success("Scheme added to comparison.");
  };

  const categories = useMemo(() => ["All", ...Array.from(new Set(schemes.map((scheme) => scheme.category))).sort()], [schemes]);
  const visibleSchemes = useMemo(() => schemes.filter((scheme) => (category === "All" || scheme.category === category) && `${scheme.name} ${scheme.description} ${scheme.category}`.toLowerCase().includes(query.trim().toLowerCase())), [schemes, category, query]);

  return <Container className="py-12 sm:py-20"><div className="max-w-3xl"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/60 dark:text-blue-200">Government scheme catalogue</span><h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Explore benefit options across India.</h1><p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">Browse {schemes.length || "our"} recorded schemes across education, health, agriculture, livelihoods, and more. Always confirm final eligibility on the official portal.</p></div>{loading && <SchemeSkeletons />}{error && <div role="alert" className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"><div className="flex gap-3"><AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600 dark:text-red-400" /><div><p className="font-extrabold">Directory unavailable</p><p className="mt-1 text-sm leading-6">{error}</p></div></div><Button type="button" variant="outline" className="mt-5 border-red-200 bg-white text-red-700 hover:bg-red-100" onClick={() => void loadSchemes(true)}><RefreshCw className="h-4 w-4" /> Retry</Button></div>}{!loading && !error && <><div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"><div className="flex flex-col gap-3 lg:flex-row"><label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:border-slate-700 dark:focus-within:ring-blue-950"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search schemes, categories, or benefits" className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none dark:text-white" /></label><div className="flex items-center gap-2 overflow-x-auto"><Filter className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={category === item ? "whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white" : "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}>{item}</button>)}</div></div></div><div className="mt-5 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-slate-300"><span>{visibleSchemes.length} scheme{visibleSchemes.length === 1 ? "" : "s"} shown</span><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Official portal links included</span><Link href="/compare" className="inline-flex items-center gap-1 font-bold text-blue-700 transition hover:text-indigo-700 dark:text-blue-300 dark:hover:text-blue-200"><GitCompareArrows className="h-4 w-4" /> Compare selected ({comparisonIds.length}/2)</Link></div></div>{visibleSchemes.length === 0 ? <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900"><SearchX className="mx-auto h-8 w-8 text-blue-600" /><h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">No matching schemes</h2><p className="mt-2 text-slate-600 dark:text-slate-300">Try a broader keyword or choose another category.</p><Button type="button" variant="outline" className="mt-5" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button></div> : <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleSchemes.map((scheme) => { const isSelected = comparisonIds.includes(scheme.id); return <Card key={scheme.id} className="group flex min-h-80 flex-col"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-200">{scheme.category}</span>{isSelected ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"><Check className="h-3.5 w-3.5" /> Added</span> : <BookOpen className="h-5 w-5 text-slate-300 transition group-hover:text-blue-500 dark:text-slate-600" />}</div><h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">{scheme.name}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{scheme.description}</p><p className="mt-5 text-xs text-slate-500 dark:text-slate-400">Source: {scheme.source.organization} · Verified {scheme.last_verified}</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><Button type="button" variant={isSelected ? "secondary" : "outline"} className="flex-1" onClick={() => toggleComparison(scheme.id)}>{isSelected ? <><Check className="h-4 w-4" /> Added to Compare</> : <><Plus className="h-4 w-4" /> Add to Compare</>}</Button><a className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl px-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 hover:text-indigo-700 dark:text-blue-300 dark:hover:bg-slate-800 dark:hover:text-blue-200" href={scheme.application.official_url} target="_blank" rel="noopener noreferrer">Official application <ArrowUpRight className="h-4 w-4" /></a></div></Card>; })}</div>}</>}<Link href="/eligibility" className="mt-10 inline-flex items-center gap-2 font-bold text-blue-700 transition hover:text-indigo-700 dark:text-blue-300 dark:hover:text-blue-200">Check your eligibility <ArrowUpRight className="h-4 w-4" /></Link></Container>;
}
