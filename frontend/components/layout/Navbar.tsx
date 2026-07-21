"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import Container from "@/components/ui/Container";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Schemes", href: "/schemes" },
  { name: "Eligibility", href: "/eligibility" },
  { name: "Compare", href: "/compare" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}

          <Link href="/" className="text-2xl font-bold text-blue-600">
            BenefitBridge AI
          </Link>

          {/* Navigation */}

          <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <details className="relative md:hidden">
            <summary aria-label="Open navigation menu" className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Menu className="h-5 w-5" /></summary>
            <nav aria-label="Mobile navigation" className="absolute right-0 top-14 z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">{navigation.map((item) => <Link key={item.name} href={item.href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300">{item.name}</Link>)}</nav>
          </details>

          {/* CTA */}

          <Link href="/eligibility" className="hidden items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 sm:inline-flex">
            Get Started
          </Link>

        </div>
      </Container>
    </header>
  );
}
