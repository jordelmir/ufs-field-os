"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Building,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { PrioridadBadge } from "@/components/shared/PrioridadBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, calculateSlaStatus } from "@/lib/utils";
import { OTPrioridad, OTEstado } from "@/types";

import { useEffect } from "react";
import { MockDB } from "@/lib/mockDb";

export default function OrdenesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedPrioridad, setSelectedPrioridad] = useState<string>("todos");

  // Load from MockDB
  useEffect(() => {
    MockDB.initialize();
    setOrders(MockDB.getOrdenes());
  }, []);

  // Filtering calculations
  const filteredOrders = orders.filter(ot => {
    const otNo = ot.numero || "";
    const clientName = ot.cliente?.nombre || "";
    const serviceType = ot.tipo_servicio || "";
    const opName = ot.operativo?.full_name || "";
    
    const matchesSearch = otNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === "todos" || ot.estado === selectedEstado;
    const matchesPrioridad = selectedPrioridad === "todos" || ot.prioridad === selectedPrioridad;
    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar and button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            CENTRO DE CONTROL OPERACIONAL
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            ÓRDENES DE TRABAJO
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestión en tiempo real de servicios programados, cuadrillas activas y ANS.
          </p>
        </div>
        
        {/* Glowing primary trigger */}
        <Link 
          href="/ordenes/nueva"
          className="bg-ufs-secondary hover:bg-ufs-secondary/85 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg neon-border-cyan shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>AGENDAR NUEVA ORDEN</span>
        </Link>
      </div>

      {/* Row Metrics counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-ufs-accent">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Órdenes Totales</span>
            <span className="font-display font-black text-xl text-white">{orders.length} activas</span>
          </div>
        </div>
        
        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-neon-danger animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Críticas en Riesgo</span>
            <span className="font-display font-black text-xl text-neon-danger">2 tickets</span>
          </div>
        </div>

        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-neon-success">
            <Plus className="w-5 h-5 rotate-45" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Tasa de Cierre</span>
            <span className="font-display font-black text-xl text-neon-success">98.2% mensual</span>
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
            placeholder="Buscar por OT, cliente, servicio, técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border/80 hover:border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg pl-9 pr-4 py-2 font-sans text-xs font-semibold text-slate-200 placeholder-slate-500 transition-all duration-300"
          />
        </div>

        {/* Filters dropdown simulator triggers */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          
          {/* Status filter */}
          <div className="flex items-center space-x-2 bg-slate-950/40 border border-cyber-border/80 rounded-lg px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-cyber-surface">Estado: Todos</option>
              <option value="pendiente" className="bg-cyber-surface">Pendiente</option>
              <option value="asignada" className="bg-cyber-surface">Asignada</option>
              <option value="en_progreso" className="bg-cyber-surface">En Progreso</option>
              <option value="en_revision" className="bg-cyber-surface">En Revisión</option>
              <option value="completada" className="bg-cyber-surface">Completada</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center space-x-2 bg-slate-950/40 border border-cyber-border/80 rounded-lg px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={selectedPrioridad}
              onChange={(e) => setSelectedPrioridad(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-cyber-surface">Prioridad: Todos</option>
              <option value="baja" className="bg-cyber-surface">Baja</option>
              <option value="media" className="bg-cyber-surface">Media</option>
              <option value="alta" className="bg-cyber-surface">Alta</option>
              <option value="urgente" className="bg-cyber-surface">Urgente</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main High-Density Table */}
      <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-200">
            <thead>
              <tr className="border-b border-cyber-border bg-slate-950/30 text-slate-500 text-[10px] uppercase font-bold tracking-wider select-none">
                <th className="py-3.5 px-6">N° Orden</th>
                <th>Cliente / Contrato</th>
                <th>Tipo de Servicio</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Especialista Asignado</th>
                <th>Programado</th>
                <th>Límite SLA</th>
                <th className="text-right px-6">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ot) => (
                  <tr 
                    key={ot.id} 
                    className="hover:bg-slate-800/10 transition-colors duration-200 group"
                  >
                    {/* Glowing side border matching priority */}
                    <td className="py-4 px-6 font-mono font-black text-ufs-accent flex items-center">
                      <div className={`w-1.5 h-6 rounded mr-3 shrink-0 ${
                        ot.prioridad === "urgente" ? "bg-neon-danger shadow-[0_0_8px_#ff3b30]" :
                        ot.prioridad === "alta" ? "bg-neon-warning" :
                        ot.prioridad === "media" ? "bg-ufs-accent" : "bg-slate-600"
                      }`} />
                      {ot.numero}
                    </td>
                    
                    <td className="font-semibold text-white">
                      <div className="flex items-center space-x-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ot.cliente?.nombre || "Sin Cliente"}</span>
                      </div>
                    </td>
                    
                    <td className="text-slate-400">{ot.tipo_servicio}</td>
                    
                    <td>
                      <PrioridadBadge prioridad={ot.prioridad} />
                    </td>
                    
                    <td>
                      <StatusBadge estado={ot.estado} />
                    </td>
                    
                    <td>
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ot.operativo?.full_name || "Sin Asignar"}</span>
                      </div>
                    </td>
                    
                    <td className="text-slate-400">{ot.fecha_programada ? new Date(ot.fecha_programada).toLocaleDateString("es-CR") : "N/D"}</td>
                    
                    <td className={ot.estado === "completada" ? "text-neon-success font-medium" : ot.estado === "cancelada" ? "text-slate-500" : ot.sla_limite ? calculateSlaStatus(ot.sla_limite).color : "text-slate-400"}>
                      {ot.estado === "completada" ? "Completado" : ot.estado === "cancelada" ? "Cancelado" : ot.sla_limite ? calculateSlaStatus(ot.sla_limite).text : "N/D"}
                    </td>
                    
                    <td className="text-right px-6">
                      <Link 
                        href={`/ordenes/${ot.id}`}
                        className="p-1.5 rounded bg-slate-950/40 border border-cyber-border group-hover:border-ufs-accent text-slate-500 group-hover:text-ufs-accent hover:bg-ufs-primary/25 inline-flex items-center transition-all duration-300"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-bold uppercase tracking-wider">
                    Ninguna órden de trabajo coincide con los parámetros ingresados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Count footer */}
        <div className="bg-slate-950/30 border-t border-cyber-border px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredOrders.length} de {orders.length} tickets operacionales</span>
          <span className="font-mono tracking-widest text-[10px]">UFS ENTERPRISE NODE V1</span>
        </div>

      </div>

    </div>
  );
}
