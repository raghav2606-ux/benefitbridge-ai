"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* Error reporting can be connected here without exposing user data. */ }, []);
  return <Container className="py-20"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50"><AlertTriangle className="h-7 w-7 text-red-600" /></div><h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Something went wrong</h1><p className="mt-3 leading-7 text-slate-600">We could not load this page. Your information has not been submitted again automatically.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={reset}><RefreshCw className="h-4 w-4" /> Try again</Button><Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Return home</Link></div></div></Container>;
}
