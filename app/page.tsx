"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect root traffic to the corporate login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-slate-500 select-none">
      <span>CONNECTING TO UFS OPERATIONAL TELEMETRY...</span>
    </div>
  );
}
