"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Map, 
  Package, 
  AlertTriangle, 
  Sparkles, 
  Sliders,
  LogOut
} from "lucide-react";
import UFSLogo from "../shared/UFSLogo";

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      name: "Órdenes de Trabajo",
      icon: ClipboardList,
      path: "/ordenes"
    },
    {
      name: "Clientes & Contratos",
      icon: Users,
      path: "/clientes"
    },
    {
      name: "Mapa en Tiempo Real",
      icon: Map,
      path: "/campo"
    },
    {
      name: "Inventario & Bodega",
      icon: Package,
      path: "/inventario"
    },
    {
      name: "Reportes de Incidentes",
      icon: AlertTriangle,
      path: "/incidentes"
    },
    {
      name: "Estudio IA (BYOK)",
      icon: Sparkles,
      path: "/ia"
    },
    {
      name: "Configuración",
      icon: Sliders,
      path: "/configuracion"
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-cyber-navy border-r border-cyber-border flex flex-col justify-between select-none">
      
      {/* Brand Header */}
      <div className="p-6">
        <Link href="/dashboard" className="block focus:outline-none">
          <UFSLogo size="md" withTagline={true} />
        </Link>
        
        {/* Decorative cyber grid line */}
        <div className="w-full h-px bg-gradient-to-r from-ufs-accent/50 to-transparent mt-6" />
        
        {/* Navigation list */}
        <nav className="mt-8 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? "bg-ufs-primary/20 text-ufs-accent border-l-2 border-ufs-accent/90 pl-3.5" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-2 border-transparent"
                }`}
              >
                {/* Glow pill behind active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-ufs-accent/5 blur-sm opacity-50 -z-10" />
                )}
                
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-ufs-accent drop-shadow-[0_0_8px_rgba(0,163,224,0.7)]" : "text-slate-500 group-hover:text-slate-300"
                }`} />
                
                <span className="font-sans font-semibold tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-cyber-border/60 bg-slate-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-ufs-primary to-ufs-accent flex items-center justify-center font-display font-black text-xs text-white border border-ufs-accent/30 shadow-[0_0_8px_rgba(0,163,224,0.3)]">
              JM
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200">Jocksan Mora</span>
              <span className="text-[10px] text-ufs-accent font-semibold tracking-wider uppercase">Technical Lead</span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="p-1.5 rounded-md text-slate-500 hover:text-neon-danger hover:bg-red-950/20 transition-all duration-300"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </aside>
  );
};
export default Sidebar;
