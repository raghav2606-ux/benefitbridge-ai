"use client";

import Link from "next/link";
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

          <nav className="hidden items-center gap-8 md:flex">
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

          {/* CTA */}

          <Link href="/eligibility" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700">
            Get Started
          </Link>

        </div>
      </Container>
    </header>
  );
}
