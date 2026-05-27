"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear credentials and route back to login
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* HUD scanline effect for high-tech HUD styling */}
      <div className="hud-scanline animate-scanline" />

      {/* Global Sidebar Navigation */}
      <Sidebar onLogout={handleLogout} />

      {/* Main App Content frame */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Dynamic header tracker */}
        <Header />

        {/* Scrollable central viewport */}
        <main className="flex-grow overflow-y-auto px-8 py-8 z-10">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {children}
          </div>
        </main>

        {/* Cyber background aesthetics grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,86,210,0.03)_0%,transparent_50%)] pointer-events-none -z-10" />
      </div>
      
    </div>
  );
}
