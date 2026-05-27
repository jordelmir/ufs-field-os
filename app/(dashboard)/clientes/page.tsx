"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Building2, 
  Search, 
  Filter, 
  ChevronRight, 
  MapPin, 
  Activity, 
  ShieldAlert 
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { Cliente } from "@/types";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZona, setSelectedZona] = useState("todos");
  const [selectedTipo, setSelectedTipo] = useState("todos");

  useEffect(() => {
    MockDB.initialize();
    setClientes(MockDB.getClientes());
  }, []);

  const filteredClientes = clientes.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.contacto_nombre || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = selectedZona === "todos" || c.zona === selectedZona;
    const matchesTipo = selectedTipo === "todos" || c.tipo_inmueble === selectedTipo;
    return matchesSearch && matchesZona && matchesTipo;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar */}
      <div>
        <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
          REGISTRO DE CUENTAS ENTERPRISE
        </span>
        <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
          CLIENTES & CONTRATOS
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Directorio centralizado de cuentas de United Facility Services y acuerdos de nivel de servicio (SLA).
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-ufs-accent">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Cuentas Activas</span>
            <span className="font-display font-black text-xl text-white">{clientes.length} corporaciones</span>
          </div>
        </div>
        
        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-neon-success">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">SLA Objetivo Promedio</span>
            <span className="font-display font-black text-xl text-neon-success">2.5 horas</span>
          </div>
        </div>

        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-neon-warning">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Zonas Cobertura</span>
            <span className="font-display font-black text-xl text-neon-warning">Heredia / SJ / Cartago / Alajuela</span>
          </div>
        </div>
      </div>

      {/* Filters HUD */}
      <div className="bg-cyber-surface/20 border border-cyber-border/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 glass-panel">
        
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, dirección o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border/80 hover:border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg pl-9 pr-4 py-2 font-sans text-xs font-semibold text-slate-200 placeholder-slate-500 transition-all duration-300"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          
          {/* Zona filter */}
          <div className="flex items-center space-x-2 bg-slate-950/40 border border-cyber-border/80 rounded-lg px-3 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={selectedZona}
              onChange={(e) => setSelectedZona(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-cyber-surface">Provincia/Zona: Todos</option>
              <option value="Heredia" className="bg-cyber-surface">Heredia</option>
              <option value="San José" className="bg-cyber-surface">San José</option>
              <option value="Cartago" className="bg-cyber-surface">Cartago</option>
              <option value="Alajuela" className="bg-cyber-surface">Alajuela</option>
            </select>
          </div>

          {/* Tipo filter */}
          <div className="flex items-center space-x-2 bg-slate-950/40 border border-cyber-border/80 rounded-lg px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-cyber-surface">Tipo Inmueble: Todos</option>
              <option value="oficina" className="bg-cyber-surface">Oficina</option>
              <option value="hospital" className="bg-cyber-surface">Hospital</option>
              <option value="industrial" className="bg-cyber-surface">Industrial</option>
              <option value="comercio" className="bg-cyber-surface">Comercio</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid structure of client cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClientes.length > 0 ? (
          filteredClientes.map((c) => (
            <div 
              key={c.id}
              className="bg-cyber-surface/30 border border-cyber-border/60 hover:border-ufs-accent/70 p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950/50 border border-cyber-border text-ufs-accent flex items-center justify-center font-display font-black text-sm group-hover:neon-border-cyan transition-all duration-300">
                      {c.nombre.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-sm text-white group-hover:text-ufs-accent transition-colors duration-300">
                        {c.nombre}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                        ID: {c.id}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neon-success bg-green-950/15 border border-neon-success/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Activo
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-normal mb-4 font-sans line-clamp-2">
                  {c.direccion}
                </p>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/30 rounded-lg p-3 border border-cyber-border/50 text-[11px] mb-4">
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px] tracking-wider">Zona Geográfica</span>
                    <span className="text-slate-300 font-semibold">{c.zona}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px] tracking-wider">SLA Máximo</span>
                    <span className="text-neon-warning font-bold">{c.sla_horas} Hora{c.sla_horas > 1 ? "s" : ""}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px] tracking-wider">Tipo Inmueble</span>
                    <span className="text-slate-300 font-semibold uppercase font-mono text-[9px]">{c.tipo_inmueble}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8px] tracking-wider">Finaliza Contrato</span>
                    <span className="text-slate-400 font-semibold">{c.contrato_fin || "Indefinido"}</span>
                  </div>
                </div>

                {/* Active Services pills */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Servicios Habilitados</span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.servicios_activos.map((srv, i) => (
                      <span key={i} className="text-[9px] text-slate-300 bg-cyber-surface border border-cyber-border/80 px-2 py-0.5 rounded font-mono font-medium">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-cyber-border/40 pt-4 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-semibold font-mono">
                  CONTACTO: {c.contacto_nombre || "No Registrado"}
                </div>
                <Link
                  href={`/clientes/${c.id}`}
                  className="flex items-center space-x-1.5 text-[10px] font-bold text-ufs-accent group-hover:text-white transition-colors duration-300 font-mono tracking-wider"
                >
                  <span>EXPEDIENTE OPERATIVO</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 py-12 text-center text-slate-500 font-bold uppercase tracking-wider border border-cyber-border/40 bg-cyber-surface/10 rounded-xl">
            Ninguna cuenta coincide con los parámetros de búsqueda.
          </div>
        )}
      </div>

    </div>
  );
}
