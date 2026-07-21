"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, FileText, GitCompareArrows, RefreshCw, Trash2 } from "lucide-react";
import api, { ApiResponse, getApiErrorMessage } from "@/services/api";
import { clearComparisonSchemeIds, getComparisonSchemeIds } from "@/lib/comparison";
import { Scheme } from "@/types/scheme";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

interface ComparisonField {
  label: string;
  render: (scheme: Scheme) => React.ReactNode;
}

function formatIncome(income: number) {
  return income >= 99999999 ? "No income limit specified" : `Up to INR ${new Intl.NumberFormat("en-IN").format(income)} per year`;
}

function formatEligibility(scheme: Scheme) {
  const { eligibility } = scheme;
  const entries = [
    `Citizenship: ${eligibility.citizenship}`,
    `Age: ${eligibility.min_age} to ${eligibility.max_age} years`,
    `Gender: ${eligibility.gender.join(", ")}`,
    `Family income: ${formatIncome(eligibility.max_family_income)}`,
    `Occupation: ${eligibility.occupation.join(", ")}`,
    `Education: ${eligibility.education_level.join(", ")}`,
    `Course or class: ${eligibility.class_or_course.join(", ")}`,
    `Category: ${eligibility.category.join(", ")}`,
    eligibility.disability_required ? "Disability certificate required" : "No disability certificate requirement",
    eligibility.farmer_required ? "Farmer status required" : null,
    ...eligibility.other_conditions,
  ].filter((entry): entry is string => Boolean(entry));

  return <ul className="space-y-2">{entries.map((entry) => <li key={entry} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" /><span>{entry}</span></li>)}</ul>;
}

const comparisonFields: ComparisonField[] = [
  { label: "Scheme Name", render: (scheme) => <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scheme.name}</span> },
  { label: "Category", render: (scheme) => <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-200">{scheme.category}</span> },
  { label: "Description", render: (scheme) => <p>{scheme.description}</p> },
  { label: "Benefits", render: (scheme) => <div className="space-y-2"><p className="font-bold text-slate-900 dark:text-white">{scheme.benefit.amount}</p><p>{scheme.benefit.description}</p><p className="text-sm text-slate-500 dark:text-slate-400">{scheme.benefits.financial}</p>{scheme.benefits.non_financial.length > 0 && <ul className="list-disc space-y-1 pl-5 text-sm">{scheme.benefits.non_financial.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>}</div> },
  { label: "Eligibility", render: formatEligibility },
  { label: "Required Documents", render: (scheme) => <ul className="space-y-2">{scheme.required_documents.map((document) => <li key={document} className="flex gap-2"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" /><span>{document}</span></li>)}</ul> },
  { label: "Application Deadline", render: (scheme) => <span>{scheme.application.deadline}</span> },
  { label: "Official Application Link", render: (scheme) => <a href={scheme.application.official_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-700 transition hover:text-indigo-700 dark:text-blue-300 dark:hover:text-blue-200">{scheme.application.portal} <ExternalLink className="h-4 w-4" /></a> },
];

function ComparisonSkeleton() {
  return <Card className="mt-10 overflow-hidden p-0" hover={false}><div className="grid gap-px bg-slate-200 dark:bg-slate-700 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">{Array.from({ length: 6 }, (_, index) => <div key={index} className="contents"><div className="bg-slate-50 p-5 dark:bg-slate-800"><Skeleton className="h-5 w-24" /></div><div className="bg-white p-5 dark:bg-slate-900"><Skeleton className="h-16 w-full" /></div><div className="bg-white p-5 dark:bg-slate-900"><Skeleton className="h-16 w-full" /></div></div>)}</div></Card>;
}

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = useCallback(async () => {
    const ids = getComparisonSchemeIds();
    setSelectedIds(ids);
    setError(null);

    if (ids.length !== 2) {
      setSchemes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get<ApiResponse<Scheme[]>>("/builder/schemes");
      const selectedSchemes = ids.map((id) => response.data.data.find((scheme) => scheme.id === id)).filter((scheme): scheme is Scheme => Boolean(scheme));
      setSchemes(selectedSchemes);
      if (selectedSchemes.length !== 2) setError("One or more selected schemes are no longer available. Please choose two schemes again.");
    } catch (requestError: unknown) {
      setSchemes([]);
      setError(getApiErrorMessage(requestError, "Scheme data is currently unavailable. Please try again later."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadComparison(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadComparison]);

  const orderedSchemes = useMemo(() => selectedIds.map((id) => schemes.find((scheme) => scheme.id === id)).filter((scheme): scheme is Scheme => Boolean(scheme)), [schemes, selectedIds]);
  const clearComparison = () => {
    if (!clearComparisonSchemeIds()) {
      toast.error("Your comparison could not be cleared in this browser.");
      return;
    }
    setSelectedIds([]);
    setSchemes([]);
    setError(null);
    toast.success("Comparison cleared.");
  };

  return <Container className="py-12 sm:py-20"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"><GitCompareArrows className="h-3.5 w-3.5" /> Scheme comparison</span><h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Compare government schemes.</h1><p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">Review benefits, eligibility, documents, and application details side by side before you apply.</p></div><div className="flex flex-wrap gap-3"><Link href="/schemes"><Button type="button" variant="outline"><ArrowLeft className="h-4 w-4" /> Back to Schemes</Button></Link>{selectedIds.length > 0 && <Button type="button" variant="outline" className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40" onClick={clearComparison}><Trash2 className="h-4 w-4" /> Clear Comparison</Button>}</div></div>{loading && <ComparisonSkeleton />}{!loading && error && <div role="alert" className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"><div className="flex gap-3"><AlertCircle className="mt-0.5 h-6 w-6 shrink-0" /><div><p className="font-extrabold">Comparison unavailable</p><p className="mt-1 text-sm leading-6">{error}</p></div></div><Button type="button" variant="outline" className="mt-5" onClick={() => void loadComparison()}><RefreshCw className="h-4 w-4" /> Retry</Button></div>}{!loading && !error && orderedSchemes.length !== 2 && <Card className="mt-10 max-w-3xl" hover={false}><GitCompareArrows className="h-8 w-8 text-blue-600 dark:text-blue-400" /><h2 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">Choose two schemes to compare</h2><p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">Add two schemes from the directory to see their benefits, eligibility, required documents, and application details side by side.</p><Link href="/schemes" className="mt-6 inline-flex"><Button type="button"><ArrowLeft className="h-4 w-4" /> Browse Schemes</Button></Link></Card>}{!loading && !error && orderedSchemes.length === 2 && <Card className="mt-10 overflow-hidden p-0" hover={false}><div className="hidden grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 md:grid"><div className="p-5 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Compare</div>{orderedSchemes.map((scheme) => <div key={scheme.id} className="border-l border-slate-200 p-5 dark:border-slate-700"><p className="text-lg font-extrabold text-slate-900 dark:text-white">{scheme.name}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{scheme.source.organization}</p></div>)}</div><div className="grid gap-px bg-slate-200 dark:bg-slate-700 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">{comparisonFields.map((field) => <div key={field.label} className="contents"><div className="bg-slate-50 p-5 text-sm font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{field.label}</div>{orderedSchemes.map((scheme) => <div key={`${field.label}-${scheme.id}`} className="bg-white p-5 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300">{field.render(scheme)}</div>)}</div>)}</div></Card>}<Link href="/schemes" className="mt-10 inline-flex items-center gap-2 font-bold text-blue-700 transition hover:text-indigo-700 dark:text-blue-300 dark:hover:text-blue-200">Browse all government schemes <ArrowUpRight className="h-4 w-4" /></Link></Container>;
}
