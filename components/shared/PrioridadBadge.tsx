import React from "react";
import { OTPrioridad } from "@/types";

interface PrioridadBadgeProps {
  prioridad: OTPrioridad;
  className?: string;
}

export const PrioridadBadge: React.FC<PrioridadBadgeProps> = ({ 
  prioridad, 
  className = "" 
}) => {
  const configs = {
    baja: {
      text: "Baja",
      classes: "bg-slate-900/60 text-slate-400 border border-slate-700/60"
    },
    media: {
      text: "Media",
      classes: "bg-cyan-950/60 text-ufs-accent border border-ufs-accent/40 shadow-[0_0_8px_rgba(0,163,224,0.15)]"
    },
    alta: {
      text: "Alta",
      classes: "bg-amber-950/60 text-neon-warning border border-neon-warning/40 shadow-[0_0_10px_rgba(255,159,0,0.2)]"
    },
    urgente: {
      text: "Urgente",
      classes: "bg-red-950/80 text-neon-danger border border-neon-danger/60 animate-pulse shadow-[0_0_15px_rgba(255,59,48,0.35)]"
    }
  };

  const config = configs[prioridad] || configs.media;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider ${config.classes} ${className}`}>
      {config.text.toUpperCase()}
    </span>
  );
};
export default PrioridadBadge;
