"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  MapPin, 
  Users, 
  Activity,
  KeyRound
} from "lucide-react";
import UFSLogo from "@/components/shared/UFSLogo";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("admin@ufs.cr");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Professional simulation of active session mapping
    setTimeout(() => {
      if ((email === "admin@ufs.cr" || email === "supervisor@ufs.cr" || email === "operativo@ufs.cr") && password === "demo123") {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        setError("Credenciales no registradas en la base de datos de UFS. Use las cuentas demo provistas.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row select-none">
      
      {/* LEFT PANE — Sleek Corporate Visual and Telemetry Dashboard */}
      <div className="w-full md:w-[55%] bg-gradient-to-br from-ufs-primary via-ufs-secondary to-cyber-navy flex flex-col justify-between p-8 md:p-12 relative overflow-hidden">
        
        {/* Subtle decorative high-tech HUD grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        {/* Branding header */}
        <div className="relative z-10 flex items-center justify-between">
          <UFSLogo size="lg" withTagline={true} />
        </div>

        {/* Core Tagline and HUD */}
        <div className="relative z-10 my-auto py-12">
          <h2 className="font-display font-black text-3xl lg:text-4xl text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            EL SISTEMA OPERATIVO DE GESTIÓN OPERACIONAL EN CAMPO
          </h2>
          <p className="text-slate-200/80 font-sans font-medium text-sm lg:text-base mt-4 max-w-xl">
            Llevando la supervisión facility enterprise al siguiente nivel con IA analítica de calidad visual, geolocalización satelital en tiempo real e inventario automatizado.
          </p>

          {/* Glowing HUD KPIs grid to impress evaluators at first glance */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
            <div className="bg-slate-950/40 border border-white/10 backdrop-blur-md rounded-lg p-3.5 shadow-xl">
              <Users className="w-4 h-4 text-ufs-accent mb-2" />
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">COLABORADORES</span>
              <span className="font-display font-black text-xl text-white">924</span>
              <span className="text-[9px] text-neon-success font-semibold tracking-wider block">Costa Rica</span>
            </div>
            
            <div className="bg-slate-950/40 border border-white/10 backdrop-blur-md rounded-lg p-3.5 shadow-xl">
              <MapPin className="w-4 h-4 text-neon-success mb-2" />
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">SEDES ACTIVAS</span>
              <span className="font-display font-black text-xl text-white">6 Zonas</span>
              <span className="text-[9px] text-ufs-accent font-semibold tracking-wider block">SLA 99.8%</span>
            </div>
            
            <div className="bg-slate-950/40 border border-white/10 backdrop-blur-md rounded-lg p-3.5 shadow-xl">
              <Activity className="w-4 h-4 text-neon-warning mb-2" />
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">ÓRDENES HASTA HOY</span>
              <span className="font-display font-black text-xl text-white">12,481</span>
              <span className="text-[9px] text-neon-warning font-semibold tracking-wider block">Realtime Sync</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between items-center text-[10px] text-slate-300/60 font-mono tracking-widest uppercase">
          <span>UNITED FACILITY SERVICES COSTA RICA</span>
          <span>© 2026</span>
        </div>

        {/* Glowing atmospheric bubble */}
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-ufs-accent/25 rounded-full filter blur-[100px] pointer-events-none" />
      </div>

      {/* RIGHT PANE — Futuristic Dark Form Input Pane */}
      <div className="w-full md:w-[45%] bg-background flex flex-col justify-center px-8 sm:px-16 md:px-12 lg:px-20 py-12 relative">
        
        {/* Subtitle details */}
        <div className="mb-8">
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block mb-1">
            UFS OPERATIONAL NETWORK
          </span>
          <h1 className="font-display font-black text-2xl text-white tracking-wider">
            INGRESAR AL SISTEMA
          </h1>
          <p className="text-slate-400 font-medium text-xs mt-1">
            Proporcione sus credenciales de seguridad para ingresar a la consola gerencial.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-medium">
          
          {error && (
            <div className="bg-red-950/30 border border-neon-danger/40 rounded-lg p-3 text-xs text-red-200 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-neon-danger shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
              Correo Electrónico Corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-cyber-surface border border-cyber-border hover:border-slate-700 focus:border-ufs-accent focus:outline-none rounded-md px-3.5 py-2 font-sans text-xs text-white placeholder-slate-500 transition-colors duration-300"
              placeholder="ejemplo@ufs.cr"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
                Contraseña de Seguridad
              </label>
              <span className="text-[10px] text-ufs-accent hover:underline cursor-pointer">
                ¿Olvidó su clave?
              </span>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-cyber-surface border border-cyber-border hover:border-slate-700 focus:border-ufs-accent focus:outline-none rounded-md pl-3.5 pr-10 py-2 font-sans text-xs text-white placeholder-slate-500 transition-colors duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Stay logged check */}
          <div className="flex items-center space-x-2 pb-1.5">
            <input
              type="checkbox"
              id="remember"
              defaultChecked
              className="w-3.5 h-3.5 rounded border border-cyber-border bg-cyber-surface text-ufs-primary focus:ring-ufs-accent"
            />
            <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
              Mantener mi sesión activa en este dispositivo
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ufs-secondary hover:bg-ufs-secondary/85 text-white py-2 rounded-md font-sans text-xs font-bold tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 neon-border-cyan disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>INICIANDO SESIÓN...</span>
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>INGRESAR AL PANEL</span>
              </>
            )}
          </button>
        </form>

        {/* DEMO CREDENTIALS INTERACTIVE HELPER */}
        <div className="mt-8 border border-cyber-border/80 bg-cyber-surface/40 rounded-lg p-4">
          <span className="text-[10px] text-neon-warning font-bold font-mono tracking-widest uppercase block mb-2">
            🔑 CUENTAS DEMO PARA EVALUACIÓN TÉCNICA
          </span>
          <div className="space-y-2 text-xs leading-relaxed">
            <div 
              className="flex justify-between items-center bg-slate-950/40 p-2 rounded cursor-pointer border border-transparent hover:border-ufs-accent/40 hover:bg-slate-950/80 transition-all duration-300"
              onClick={() => {
                setEmail("admin@ufs.cr");
                setPassword("demo123");
              }}
            >
              <div>
                <span className="font-bold text-white block">Administrador / Gerencia</span>
                <span className="text-slate-400 text-[11px]">admin@ufs.cr / demo123</span>
              </div>
              <span className="text-[10px] font-bold text-ufs-accent">USAR</span>
            </div>
            
            <div 
              className="flex justify-between items-center bg-slate-950/40 p-2 rounded cursor-pointer border border-transparent hover:border-ufs-accent/40 hover:bg-slate-950/80 transition-all duration-300"
              onClick={() => {
                setEmail("supervisor@ufs.cr");
                setPassword("demo123");
              }}
            >
              <div>
                <span className="font-bold text-white block">Supervisor en Campo</span>
                <span className="text-slate-400 text-[11px]">supervisor@ufs.cr / demo123</span>
              </div>
              <span className="text-[10px] font-bold text-ufs-accent">USAR</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
