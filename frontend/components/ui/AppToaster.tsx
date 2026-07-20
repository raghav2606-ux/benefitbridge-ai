"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return <Toaster position="top-right" toastOptions={{ duration: 4500, style: { borderRadius: "14px", background: "#0f172a", color: "#f8fafc", fontWeight: 600, boxShadow: "0 16px 36px rgba(15, 23, 42, 0.2)" } }} />;
}
