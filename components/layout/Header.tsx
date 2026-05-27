"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Wifi, 
  Cpu, 
  X,
  FileText
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Dashboard General" }) => {
  const [time, setTime] = useState<string>("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // High-density notifications mockup
  const notifications = [
    {
      id: "1",
      tipo: "SLA",
      titulo: "¡SLA en Riesgo Crítico!",
      mensaje: "OT-2026-0104 en Genpact CR vence en menos de 25 minutos.",
      time: "Hace 2 min",
      urgente: true
    },
    {
      id: "2",
      tipo: "Checkin",
      titulo: "Ingreso registrado en campo",
      mensaje: "Mario Vargas registró Check-in en Hospital CIMA Escazú.",
      time: "Hace 8 min",
      urgente: false
    },
    {
      id: "3",
      tipo: "Incidente",
      titulo: "Incidente reportado",
      mensaje: "Falla de compresor de climatización en Zona Franca América.",
      time: "Hace 15 min",
      urgente: true
    }
  ];

  useEffect(() => {
    // Dynamic real-time clock ticker
    const tick = () => {
      setTime(formatDateTime(new Date().toISOString()));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-cyber-navy/80 backdrop-blur-md border-b border-cyber-border/80 px-8 flex items-center justify-between select-none z-40 relative">
      
      {/* Title section with cyber decoration */}
      <div className="flex items-center space-x-3">
        <Cpu className="w-5 h-5 text-ufs-accent drop-shadow-[0_0_8px_rgba(0,163,224,0.6)]" />
        <h1 className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
          {title}
        </h1>
        <div className="w-2.5 h-2.5 rounded-full bg-neon-success animate-pulse" title="Supabase Realtime Conectado" />
        <span className="text-[10px] text-neon-success font-bold font-mono tracking-widest uppercase hidden md:inline">
          LIVE SQL FEED
        </span>
      </div>

      {/* Utilities section */}
      <div className="flex items-center space-x-6">
        
        {/* Dynamic Digital Clock */}
        <div className="hidden lg:flex items-center bg-slate-950/40 border border-cyber-border/40 px-3.5 py-1.5 rounded-md font-mono text-[11px] font-bold text-slate-300 tracking-wider">
          <span className="text-ufs-accent mr-2">SYS TIME:</span>
          <span>{time || "Cargando telemetría..."}</span>
        </div>

        {/* Global HUD Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-64 bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border/80 hover:border-cyber-border focus:border-ufs-accent focus:outline-none rounded-md pl-9 pr-4 py-1.5 font-sans text-xs font-medium text-slate-200 placeholder-slate-500 transition-all duration-300"
          />
        </div>

        {/* Dynamic Notification Bell Indicator */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-white transition-all duration-300 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 bg-neon-danger rounded-full absolute top-1.5 right-1.5 border border-cyber-navy animate-ping" />
            <span className="w-2 h-2 bg-neon-danger rounded-full absolute top-1.5 right-1.5 border border-cyber-navy" />
          </button>

          {/* Sliding notification dropdown panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-cyber-surface border border-cyber-border rounded-lg shadow-2xl p-4 z-50 glass-panel">
              <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Centro de Operaciones</span>
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-2.5 rounded border text-xs leading-relaxed transition-all duration-300 ${
                      notif.urgente 
                        ? "bg-red-950/20 border-neon-danger/40 hover:border-neon-danger/70 text-red-200" 
                        : "bg-slate-900/40 border-cyber-border/60 hover:border-ufs-accent/40 text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 font-semibold">
                      <span className={notif.urgente ? "text-neon-danger font-bold" : "text-ufs-accent font-bold"}>
                        {notif.titulo}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap ml-2">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">
                      {notif.mensaje}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-cyber-border mt-3.5 pt-2 text-center">
                <span className="text-[10px] text-ufs-accent font-bold uppercase tracking-wider cursor-pointer hover:underline">
                  Ver todas las alertas
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
export default Header;
