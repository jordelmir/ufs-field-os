import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines CSS class names dynamically, resolving conflicting Tailwind utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a timestamp into a clean Costa Rican date/time string.
 */
export function formatDateTime(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Returns a human-readable duration in minutes or hours.
 */
export function formatMinutes(mins?: number): string {
  if (mins === undefined || mins === null) return "N/A";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
}

/**
 * Computes remaining SLA minutes and outputs a clean text tag with coloring class tags.
 */
export function calculateSlaStatus(limitDateString?: string, completedDateString?: string) {
  if (!limitDateString) return { text: "Sin SLA", seconds: 0, color: "text-slate-400" };
  
  const end = completedDateString ? new Date(completedDateString) : new Date();
  const limit = new Date(limitDateString);
  const diffMs = limit.getTime() - end.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) {
    return {
      text: `Vencido (${Math.abs(diffMins)}m)`,
      seconds: diffMs,
      color: "text-neon-danger font-bold animate-pulse",
      isOverdue: true
    };
  }

  if (diffMins <= 60) {
    return {
      text: `En riesgo (${diffMins}m)`,
      seconds: diffMs,
      color: "text-neon-warning font-bold animate-pulse",
      isOverdue: false
    };
  }

  return {
    text: `${Math.floor(diffMins / 60)}h ${diffMins % 60}m restantes`,
    seconds: diffMs,
    color: "text-neon-success font-medium",
    isOverdue: false
  };
}

/**
 * Formats costs in Costa Rican Colones or US Dollars.
 */
export function formatCurrency(amount?: number, isUSD: boolean = false): string {
  if (amount === undefined || amount === null) return "₡0.00";
  return new Intl.NumberFormat(isUSD ? "en-US" : "es-CR", {
    style: "currency",
    currency: isUSD ? "USD" : "CRC",
  }).format(amount);
}
