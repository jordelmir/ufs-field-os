"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { Cliente, OrdenTrabajo } from "@/types";
import { PrioridadBadge } from "@/components/shared/PrioridadBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    MockDB.initialize();
    
    const clientData = MockDB.getClienteById(id);
    if (!clientData) {
      router.push("/clientes");
      return;
    }
    
    setCliente(clientData);
    
    // Filter orders by this client
    const allOrders = MockDB.getOrdenes();
    const clientOrders = allOrders.filter(o => o.cliente_id === id);
    setOrdenes(clientOrders);
    
    setLoading(false);
  }, [id, router]);

  if (loading || !cliente) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-ufs-accent font-mono text-xs font-bold animate-pulse">
          CARGANDO EXPEDIENTE DE CUENTA...
        </div>
      </div>
    );
  }

  // Analytics for this specific client
  const activeOrders = ordenes.filter(o => o.estado !== "completada" && o.estado !== "cancelada");
  const completedOrders = ordenes.filter(o => o.estado === "completada");
  const criticalOrders = ordenes.filter(o => o.prioridad === "urgente" && o.estado !== "completada");

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* Back button & header */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/clientes"
          className="p-2 rounded-lg bg-cyber-surface/50 border border-cyber-border hover:border-ufs-accent text-slate-400 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            EXPEDIENTE ENTERPRISE DE CLIENTE
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            {cliente.nombre}
          </h2>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Account Information */}
        <div className="space-y-6">
          
          {/* Main Account details Card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-5">
            <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
              <span className="text-xs font-bold text-white tracking-wider uppercase">Ficha de Contrato</span>
              <span className="text-[9px] text-neon-success bg-green-950/15 border border-neon-success/20 px-2 py-0.5 rounded font-mono font-bold">
                ESTADO: VIGENTE
              </span>
            </div>

            <div className="space-y-4 text-xs font-medium">
              
              {/* Type */}
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-0.5">Tipo de Instalación</span>
                <span className="text-slate-200 capitalize font-semibold">{cliente.tipo_inmueble} corporativo</span>
              </div>

              {/* SLA */}
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-0.5">Acuerdo de Nivel de Servicio (SLA)</span>
                <span className="text-neon-warning font-bold">Máximo {cliente.sla_horas} hora{cliente.sla_horas > 1 ? "s" : ""} de respuesta técnica</span>
              </div>

              {/* Geography */}
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-0.5">Ubicación Operativa</span>
                <span className="text-slate-200 flex items-start mt-1">
                  <MapPin className="w-3.5 h-3.5 text-ufs-accent mr-1 shrink-0 mt-0.5" />
                  <span>{cliente.direccion}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Coordenadas: Lat {cliente.lat.toFixed(4)} / Lng {cliente.lng.toFixed(4)}
                </span>
              </div>

              {/* Dates */}
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-0.5">Vigencia del Contrato</span>
                <div className="flex items-center space-x-2 text-slate-300 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{cliente.contrato_inicio || "N/D"} al {cliente.contrato_fin || "Indefinido"}</span>
                </div>
              </div>

              {/* Notes */}
              {cliente.notas && (
                <div className="pt-2 border-t border-cyber-border/40">
                  <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-1">Notas de Seguridad e Ingreso</span>
                  <div className="p-2.5 bg-slate-950/40 border border-cyber-border rounded-lg text-slate-400 leading-normal text-[11px]">
                    {cliente.notas}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Contact Person Card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border/60 pb-2">
              Contacto Autorizado
            </h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="font-semibold text-white">
                {cliente.contacto_nombre || "Sin contacto registrado"}
              </div>
              
              {cliente.contacto_telefono && (
                <div className="flex items-center space-x-2.5 text-slate-400 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 text-ufs-accent" />
                  <a href={`tel:${cliente.contacto_telefono}`} className="font-mono">{cliente.contacto_telefono}</a>
                </div>
              )}

              {cliente.contacto_email && (
                <div className="flex items-center space-x-2.5 text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-ufs-accent" />
                  <a href={`mailto:${cliente.contacto_email}`} className="font-mono truncate">{cliente.contacto_email}</a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Telemetry Summary and Work Order Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Telemetry metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950/40 border border-cyber-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Total Histórico</span>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="font-display font-black text-2xl text-white">{ordenes.length}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">OTs</span>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-cyber-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Activas / En Cola</span>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className={`font-display font-black text-2xl ${activeOrders.length > 0 ? "text-ufs-accent" : "text-slate-400"}`}>
                  {activeOrders.length}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Tickets</span>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-cyber-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">SLA Críticos</span>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className={`font-display font-black text-2xl ${criticalOrders.length > 0 ? "text-neon-danger animate-pulse" : "text-neon-success"}`}>
                  {criticalOrders.length}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Pendientes</span>
              </div>
            </div>
          </div>

          {/* Table of historic services */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl overflow-hidden glass-panel">
            <div className="p-4 bg-slate-950/30 border-b border-cyber-border flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wider uppercase">Historial de Órdenes de Trabajo</span>
              <span className="font-mono text-[9px] text-slate-500">ORDENADO POR FECHA DE PROGRAMACIÓN</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-200">
                <thead>
                  <tr className="border-b border-cyber-border/50 bg-slate-950/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider select-none">
                    <th className="py-3 px-5">N° Orden</th>
                    <th>Servicio / Título</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Especialista</th>
                    <th>Programado</th>
                    <th className="text-right px-5">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/30">
                  {ordenes.length > 0 ? (
                    ordenes.map((ot) => (
                      <tr key={ot.id} className="hover:bg-slate-800/10 transition-colors duration-200 group">
                        <td className="py-3.5 px-5 font-mono font-black text-ufs-accent">
                          {ot.numero}
                        </td>
                        <td>
                          <div className="flex flex-col max-w-[200px]">
                            <span className="font-semibold text-white truncate">{ot.titulo}</span>
                            <span className="text-[9px] text-slate-500 truncate mt-0.5">{ot.tipo_servicio}</span>
                          </div>
                        </td>
                        <td>
                          <PrioridadBadge prioridad={ot.prioridad} />
                        </td>
                        <td>
                          <StatusBadge estado={ot.estado} />
                        </td>
                        <td className="text-slate-300">
                          {ot.operativo?.full_name || "Sin Asignar"}
                        </td>
                        <td className="text-slate-400">
                          {ot.fecha_programada ? new Date(ot.fecha_programada).toLocaleDateString("es-CR") : "N/D"}
                        </td>
                        <td className="text-right px-5">
                          <Link 
                            href={`/ordenes/${ot.id}`}
                            className="p-1 rounded bg-slate-950/40 border border-cyber-border group-hover:border-ufs-accent text-slate-500 group-hover:text-ufs-accent hover:bg-ufs-primary/20 inline-flex items-center transition-all duration-300"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                        No se registran órdenes de trabajo históricas para este cliente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
