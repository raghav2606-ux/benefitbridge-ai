import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import AppToaster from "@/components/ui/AppToaster";

export const metadata: Metadata = {
  title: "BenefitBridge AI",
  description:
    "AI-powered platform to discover, compare and check eligibility for government welfare schemes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />

        <main>{children}</main>
        <Footer />
        <AppToaster />
      </body>
    </html>
  );
}
