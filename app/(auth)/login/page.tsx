"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  MapPin, 
  Users, 
  Activity,
  KeyRound,
  ShieldCheck,
  Cpu,
  Radio
} from "lucide-react";
import UFSLogo from "@/components/shared/UFSLogo";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("admin@ufs.cr");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Web Audio Synthesizer for high-tech sound effects (chimes & scanner sweeps)
  const playSound = (type: "click" | "success" | "error" | "input" | "scan") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        // High-tech quick blip
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "input") {
        // Soft clicking feedback
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === "success") {
        // Futuristic double rise chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.4); // C6
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "error") {
        // Harsh retro buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "scan") {
        // Cyber radar sweep tone
        osc.type = "sine";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.warn("Web Audio not supported or blocked by user gesture:", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    playSound("click");

    setTimeout(() => {
      if ((email === "admin@ufs.cr" || email === "supervisor@ufs.cr" || email === "operativo@ufs.cr") && password === "demo123") {
        setLoginSuccess(true);
        playSound("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setIsLoading(false);
        setError("Acceso denegado: Firma de seguridad no coincide. Seleccione una cuenta autorizada.");
        playSound("error");
      }
    }, 1500);
  };

  const fillCredentials = (demoEmail: string, demoPassword: string) => {
    playSound("click");
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-[#020713] text-foreground flex flex-col lg:flex-row relative overflow-hidden select-none font-sans">
      
      {/* BACKGROUND SCI-FI AURA GLOWS */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ufs-primary/10 rounded-full filter blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-ufs-accent/10 rounded-full filter blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      
      {/* HUD Scanner Line Overlay - Global */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ufs-accent to-transparent opacity-35 pointer-events-none animate-scanline" style={{ animationDuration: "8s" }} />

      {/* LEFT COLUMN — High-Tech HUD telemetry map & branding */}
      <div className="w-full lg:w-[58%] border-b lg:border-b-0 lg:border-r border-cyber-border/40 relative flex flex-col justify-between p-8 sm:p-12 overflow-hidden bg-slate-950/20 backdrop-blur-sm">
        
        {/* Animated Cyber Grid Matrix */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(0,163,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,224,0.15)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Decorative radar concentric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-ufs-accent/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-ufs-accent/5 pointer-events-none animate-pulse" />
        
        {/* Radar Scanner Sweep Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-ufs-accent/5 to-transparent pointer-events-none animate-scanline" style={{ animationDuration: "6s" }} />

        {/* 1. Header (Branding & Status nodes) */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="hover:scale-105 transition-transform duration-500 cursor-pointer">
            <UFSLogo size="lg" withTagline={true} />
          </div>
          
          <div className="flex items-center space-x-2.5 bg-slate-950/60 border border-cyber-border rounded-full py-1.5 px-3.5 shadow-lg backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-neon-success animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-slate-300 font-bold">NODE_01 // ONLINE</span>
          </div>
        </div>

        {/* 2. Visual Centerpiece - Floating HUD Dashboard metrics */}
        <div className="relative z-10 my-auto py-12 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-ufs-accent/15 border border-ufs-accent/30 rounded px-3 py-1 mb-6">
            <Cpu className="w-3.5 h-3.5 text-ufs-accent animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-ufs-accent font-mono">UFS AI ENGINE ACTIVE</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[42px] leading-tight text-white tracking-wide">
            SISTEMA OPERATIVO <br className="hidden sm:inline" />
            DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-ufs-accent via-ufs-secondary to-neon-success">GESTIÓN OPERACIONAL</span> EN CAMPO
          </h2>
          
          <p className="text-slate-300/80 font-sans font-medium text-sm sm:text-base mt-5 max-w-xl leading-relaxed">
            Plataforma centralizada de supervisión facility enterprise para United Facility Services Costa Rica. Monitoreo satelital, despacho predictivo e inspección de calidad asistida por IA.
          </p>

          {/* TELEMETRY GLASS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
            
            {/* CARD 1 */}
            <div className="group relative rounded-xl overflow-hidden p-[1px]">
              {/* Backglow border light */}
              <div className="absolute inset-0 bg-gradient-to-b from-ufs-accent/20 to-transparent group-hover:from-ufs-accent/60 transition-all duration-500 rounded-xl" />
              
              <div className="relative bg-slate-950/60 backdrop-blur-xl rounded-xl p-4.5 border border-white/5 shadow-2xl flex flex-col justify-between h-full transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div className="bg-ufs-accent/10 p-2 rounded-lg border border-ufs-accent/25">
                    <Users className="w-4 h-4 text-ufs-accent" />
                  </div>
                  <span className="text-[9px] font-mono text-neon-success font-semibold px-2 py-0.5 bg-neon-success/10 border border-neon-success/20 rounded">Costa Rica</span>
                </div>
                <div className="mt-4">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Colaboradores</span>
                  <span className="font-display font-black text-2xl text-white tracking-tight drop-shadow-[0_0_10px_rgba(0,163,224,0.4)]">924</span>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="group relative rounded-xl overflow-hidden p-[1px]">
              {/* Backglow border light */}
              <div className="absolute inset-0 bg-gradient-to-b from-neon-success/20 to-transparent group-hover:from-neon-success/60 transition-all duration-500 rounded-xl" />
              
              <div className="relative bg-slate-950/60 backdrop-blur-xl rounded-xl p-4.5 border border-white/5 shadow-2xl flex flex-col justify-between h-full transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div className="bg-neon-success/10 p-2 rounded-lg border border-neon-success/25">
                    <MapPin className="w-4 h-4 text-neon-success" />
                  </div>
                  <span className="text-[9px] font-mono text-ufs-accent font-semibold px-2 py-0.5 bg-ufs-accent/10 border border-ufs-accent/20 rounded">SLA 99.8%</span>
                </div>
                <div className="mt-4">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Sedes Activas</span>
                  <span className="font-display font-black text-2xl text-white tracking-tight drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">6 Zonas</span>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="group relative rounded-xl overflow-hidden p-[1px]">
              {/* Backglow border light */}
              <div className="absolute inset-0 bg-gradient-to-b from-neon-warning/20 to-transparent group-hover:from-neon-warning/60 transition-all duration-500 rounded-xl" />
              
              <div className="relative bg-slate-950/60 backdrop-blur-xl rounded-xl p-4.5 border border-white/5 shadow-2xl flex flex-col justify-between h-full transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div className="bg-neon-warning/10 p-2 rounded-lg border border-neon-warning/25">
                    <Activity className="w-4 h-4 text-neon-warning" />
                  </div>
                  <span className="text-[9px] font-mono text-neon-warning font-semibold px-2 py-0.5 bg-neon-warning/10 border border-neon-warning/20 rounded">Realtime</span>
                </div>
                <div className="mt-4">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Órdenes Realizadas</span>
                  <span className="font-display font-black text-2xl text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,159,0,0.4)]">12,481</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Footer Branding Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-slate-400/80 font-mono tracking-widest uppercase gap-2 sm:gap-0">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-ufs-accent animate-pulse" />
            <span>UNITED FACILITY SERVICES COSTA RICA</span>
          </div>
          <span>© 2026 // EDICIÓN ENTERPRISE</span>
        </div>

      </div>

      {/* RIGHT COLUMN — Clean floating glassmorphic login panel */}
      <div className="w-full lg:w-[42%] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-12 xl:px-16 py-12 relative bg-[#020713]/40 backdrop-blur-md">
        
        {/* Interactive glow behind the form container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-ufs-secondary/15 rounded-full filter blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "5s" }} />

        {/* Floating Glassmorphic Login Container */}
        <div className="bg-[#0b1328]/50 backdrop-blur-2xl border border-cyber-border/80 rounded-2xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Internal neon accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-ufs-accent via-ufs-secondary to-neon-success" />

          {/* Form Header */}
          <div className="mb-8">
            <span className="text-[9px] text-ufs-accent font-bold tracking-widest uppercase font-mono block mb-1">
              UFS OPERATIONAL PORTAL
            </span>
            <h1 className="font-display font-black text-2xl text-white tracking-wide">
              INGRESAR AL SISTEMA
            </h1>
            <p className="text-slate-400 font-medium text-xs mt-1 leading-relaxed">
              Firme con su firma de seguridad digital para ingresar al sistema de despacho.
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="space-y-5 font-medium">
            
            {error && (
              <div className="bg-red-950/20 border border-neon-danger/40 rounded-lg p-3 text-xs text-red-200 flex items-start space-x-2.5 shadow-inner">
                <ShieldAlert className="w-4 h-4 text-neon-danger shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="bg-emerald-950/30 border border-neon-success/40 rounded-lg p-3 text-xs text-emerald-200 flex items-start space-x-2.5 shadow-inner">
                <ShieldCheck className="w-4.5 h-4.5 text-neon-success shrink-0 mt-0.5 animate-bounce" />
                <span className="font-mono">FIRMA AUTORIZADA. REDIRIGIENDO AL NODO CENTRAL...</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block font-mono">
                Identificador de Usuario (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  playSound("input");
                }}
                required
                className="w-full bg-[#030a16]/80 border border-cyber-border hover:border-slate-600 focus:border-ufs-accent focus:outline-none rounded-lg px-4 py-2.5 font-sans text-xs text-white placeholder-slate-500 shadow-inner focus:shadow-[0_0_15px_rgba(0,163,224,0.25)] transition-all duration-300"
                placeholder="ejemplo@ufs.cr"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block font-mono">
                  Llave de Acceso (Password)
                </label>
                <span className="text-[10px] text-ufs-accent hover:underline cursor-pointer font-semibold">
                  ¿Recuperar llave?
                </span>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    playSound("input");
                  }}
                  required
                  className="w-full bg-[#030a16]/80 border border-cyber-border hover:border-slate-600 focus:border-ufs-accent focus:outline-none rounded-lg pl-4 pr-10 py-2.5 font-sans text-xs text-white placeholder-slate-500 shadow-inner focus:shadow-[0_0_15px_rgba(0,163,224,0.25)] transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    playSound("click");
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stay Logged Checkbox */}
            <div className="flex items-center space-x-2.5 py-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-3.5 h-3.5 rounded border border-cyber-border bg-[#030a16] text-ufs-secondary focus:ring-ufs-accent focus:ring-offset-0 transition duration-300 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none font-medium hover:text-slate-300">
                Mantener mi firma activa en esta estación
              </label>
            </div>

            {/* Glowing Futuristic Button */}
            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-ufs-secondary to-ufs-accent hover:from-ufs-secondary hover:to-ufs-accent text-white py-3 rounded-lg font-sans text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,86,210,0.3)] hover:shadow-[0_0_25px_rgba(0,163,224,0.5)] border border-ufs-accent/20 cursor-pointer transition-all duration-300 disabled:opacity-50"
            >
              {/* Shimmer sweep glow overlay */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
              
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2.5">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AUTENTICANDO...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>INGRESAR AL PANEL</span>
                </span>
              )}
            </button>
          </form>

          {/* CREDENTIALS ASSIST PANEL */}
          <div className="mt-8 border border-cyber-border/60 bg-[#030a16]/60 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-3.5 h-3.5 text-neon-warning animate-pulse" />
              <span className="text-[9px] text-neon-warning font-bold font-mono tracking-widest uppercase">
                CREDENCIALES DEMO DISPONIBLES
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div 
                className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-cyber-border hover:border-ufs-accent/50 hover:bg-slate-950/80 transition-all duration-300 cursor-pointer"
                onClick={() => fillCredentials("admin@ufs.cr", "demo123")}
              >
                <div>
                  <span className="font-bold text-white block">Administrador / Gerencia</span>
                  <span className="text-slate-400 text-[10px] font-mono">admin@ufs.cr / demo123</span>
                </div>
                <span className="text-[10px] font-bold text-ufs-accent bg-ufs-accent/10 px-2 py-0.5 border border-ufs-accent/20 rounded">USAR</span>
              </div>
              
              <div 
                className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-cyber-border hover:border-ufs-accent/50 hover:bg-slate-950/80 transition-all duration-300 cursor-pointer"
                onClick={() => fillCredentials("supervisor@ufs.cr", "demo123")}
              >
                <div>
                  <span className="font-bold text-white block">Supervisor en Campo</span>
                  <span className="text-slate-400 text-[10px] font-mono">supervisor@ufs.cr / demo123</span>
                </div>
                <span className="text-[10px] font-bold text-ufs-accent bg-ufs-accent/10 px-2 py-0.5 border border-ufs-accent/20 rounded">USAR</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
