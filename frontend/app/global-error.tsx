"use client";

export default function GlobalError() {
  return <html lang="en"><body className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white"><main className="max-w-md text-center"><p className="text-sm font-bold uppercase tracking-widest text-cyan-300">BenefitBridge AI</p><h1 className="mt-4 text-3xl font-extrabold">We hit an unexpected problem.</h1><p className="mt-3 text-slate-300">Please refresh the page and try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-7 rounded-xl bg-white px-5 py-3 font-bold text-slate-900">Refresh page</button></main></body></html>;
}
