import React from "react";
import { OTEstado } from "@/types";

interface StatusBadgeProps {
  estado: OTEstado;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  estado, 
  className = "" 
}) => {
  const configs = {
    pendiente: {
      text: "Pendiente",
      classes: "bg-slate-900/60 text-slate-400 border border-slate-700/60"
    },
    asignada: {
      text: "Asignada",
      classes: "bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.15)]"
    },
    en_progreso: {
      text: "En Progreso",
      classes: "bg-blue-950/60 text-ufs-accent border border-ufs-accent/50 animate-pulse shadow-[0_0_12px_rgba(0,163,224,0.25)]"
    },
    en_revision: {
      text: "En Revisión",
      classes: "bg-amber-950/60 text-neon-warning border border-neon-warning/50 shadow-[0_0_10px_rgba(255,159,0,0.2)]"
    },
    completada: {
      text: "Completada",
      classes: "bg-emerald-950/80 text-neon-success border border-neon-success/60 shadow-[0_0_15px_rgba(0,255,135,0.3)]"
    },
    cancelada: {
      text: "Cancelada",
      classes: "bg-red-950/60 text-neon-danger border border-neon-danger/40 shadow-[0_0_8px_rgba(255,59,48,0.15)]"
    }
  };

  const config = configs[estado] || configs.pendiente;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-sans font-bold tracking-wide ${config.classes} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        estado === "en_progreso" ? "bg-ufs-accent animate-ping" : 
        estado === "completada" ? "bg-neon-success" :
        estado === "en_revision" ? "bg-neon-warning" : 
        estado === "cancelada" ? "bg-neon-danger" : "bg-slate-500"
      }`} />
      {config.text.toUpperCase()}
    </span>
  );
};
export default StatusBadge;
