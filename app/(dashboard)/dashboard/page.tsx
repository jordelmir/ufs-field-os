"use client";

import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  AlertTriangle,
  Play,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function DashboardPage() {
  const [feed, setFeed] = useState([
    { id: 1, text: "Mario Vargas completó OT-2026-0104 en Genpact CR", time: "Hace 3 min", type: "complete" },
    { id: 2, text: "Nueva OT urgente asignada en Hospital CIMA Escazú", time: "Hace 7 min", type: "urgente" },
    { id: 3, text: "Sofía Jiménez registró Entrada (GPS) en Intel Belén", time: "Hace 12 min", type: "checkin" },
    { id: 4, text: "Cierre de OT de plagas en Multiplaza Escazú", time: "Hace 20 min", type: "complete" }
  ]);

  // Telemetry real-time generator to show Genpact technical leads live database feed updates!
  useEffect(() => {
    const feedsList = [
      "Ana Rodríguez reportó incidente en Banco Nacional Sede Central",
      "Carlos Mora completó preventivo en Zona Franca América",
      "Check-in satelital registrado por Luis Cascante en Intel Costa Rica",
      "Reabastecimiento de bodega principal completado por bodega central"
    ];
    
    const interval = setInterval(() => {
      const randomText = feedsList[Math.floor(Math.random() * feedsList.length)];
      setFeed(prev => [
        { id: Date.now(), text: randomText, time: "Hace 1s", type: "realtime" },
        ...prev.slice(0, 3)
      ]);
    }, 12000); // Feed tick

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Órdenes Activas Hoy", value: "47", label: "↑ 12% vs ayer", icon: ClipboardList, glow: "group-hover:border-ufs-accent/80", textGlow: "text-ufs-accent" },
    { title: "Completadas Hoy", value: "23", label: "↑ 8% vs ayer", icon: CheckCircle2, glow: "group-hover:border-neon-success/80", textGlow: "text-neon-success" },
    { title: "SLA en Riesgo", value: "3", label: "¡ROJO urgente!", icon: Clock, glow: "group-hover:border-neon-danger/80", textGlow: "text-neon-danger" },
    { title: "Operativos en Campo", value: "38", label: "📍 en mapa central", icon: MapPin, glow: "group-hover:border-neon-warning/80", textGlow: "text-neon-warning" }
  ];

  // Recharts high density telemetry datasets
  const barData = [
    { name: "Limpieza", volumen: 32 },
    { name: "Mantenimiento", volumen: 24 },
    { name: "Jardinería", volumen: 15 },
    { name: "Plagas", volumen: 10 },
    { name: "Desinfección", volumen: 18 }
  ];

  const pieData = [
    { name: "Completadas", value: 45, color: "#00ff87" },
    { name: "En Progreso", value: 30, color: "#00A3E0" },
    { name: "Pendientes", value: 15, color: "#ff9f00" },
    { name: "Canceladas", value: 5, color: "#ff3b30" }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Welcome HUD bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel">
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            CONSOLA OPERATIVA GENERAL
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            BUENOS DÍAS, LIC. JOCKSAN
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            United Facility Services Costa Rica está operando con normalidad. 6 zonas activas en monitoreo de cuadrilla.
          </p>
        </div>
        
        {/* Dynamic Telemetry Bead */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0 bg-slate-950/50 border border-cyber-border px-4 py-2.5 rounded-lg">
          <Activity className="w-5 h-5 text-neon-success animate-pulse" />
          <div>
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">TELEMETRÍA SATELITAL</span>
            <span className="text-xs font-bold text-slate-200">92 GPS PINGS / SEC</span>
          </div>
        </div>
      </div>

      {/* ROW 1 — Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className={`group bg-cyber-surface/40 hover:bg-cyber-surface/75 border border-cyber-border/60 rounded-xl p-5 cursor-pointer glass-panel transition-all duration-300 relative overflow-hidden ${stat.glow}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                    {stat.title}
                  </span>
                  <span className={`font-display font-black text-3xl leading-none block ${stat.textGlow}`}>
                    {stat.value}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border/80 group-hover:scale-110 transition-transform duration-300 ${stat.textGlow}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{stat.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              {/* Subtle ambient light bar */}
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-${stat.textGlow} to-transparent opacity-30`} />
            </div>
          );
        })}
      </div>

      {/* ROW 2 — High Density Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly service volume bar chart */}
        <div className="lg:col-span-2 bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel">
          <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3 mb-6">
            <div className="flex items-center space-x-2.5">
              <TrendingUp className="w-4.5 h-4.5 text-ufs-accent" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Volumen Operativo por Categoría</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Datos semanales</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#5E6C84" fontSize={10} tickLine={false} />
                <YAxis stroke="#5E6C84" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#101c36", borderColor: "#1e2d4d", borderRadius: 8, color: "#f4f5f7", fontSize: 11 }} 
                  labelStyle={{ fontWeight: "bold", color: "#00A3E0" }}
                />
                <Bar dataKey="volumen" fill="#0056D2" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "#003087" : index === 1 ? "#0056D2" : index === 4 ? "#00A3E0" : "#1e2d4d"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution pie chart */}
        <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel">
          <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3 mb-6">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4.5 h-4.5 text-neon-success" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Estado de Trabajo</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total 90 OTs</span>
          </div>

          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#101c36", borderColor: "#1e2d4d", borderRadius: 8, color: "#f4f5f7", fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center metric */}
            <div className="absolute text-center">
              <span className="font-display font-black text-xl text-white block">90</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Órdenes</span>
            </div>
          </div>

          {/* Map details custom legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-[10px] font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROW 3 — Urgent Orders Table & Real-Time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent OTs list */}
        <div className="lg:col-span-2 bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel">
          <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3 mb-5">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-neon-danger shrink-0" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Alertas SLA Críticas & Vencidas</span>
            </div>
            <span className="text-[9px] bg-red-950/60 border border-neon-danger/30 text-neon-danger px-2 py-0.5 rounded font-mono font-bold">
              3 EN RIESGO
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-200">
              <thead>
                <tr className="border-b border-cyber-border text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5">N° Orden</th>
                  <th>Cliente</th>
                  <th>Tipo Servicio</th>
                  <th>Prioridad</th>
                  <th>SLA Límite</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/50">
                <tr className="hover:bg-slate-800/10 transition-colors duration-200">
                  <td className="py-3.5 font-mono font-bold text-ufs-accent">OT-2026-0104</td>
                  <td className="font-semibold text-white">Genpact Costa Rica</td>
                  <td className="text-slate-400">Limpieza General</td>
                  <td>
                    <span className="bg-red-950/50 text-neon-danger border border-neon-danger/40 px-2 py-0.5 rounded text-[10px] font-bold">URGENTE</span>
                  </td>
                  <td className="text-neon-danger font-bold animate-pulse">Vence en 25m</td>
                  <td className="text-right">
                    <Link href="/ordenes/1" className="text-ufs-accent hover:underline font-bold text-[11px] inline-flex items-center">
                      Monitorear <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/10 transition-colors duration-200">
                  <td className="py-3.5 font-mono font-bold text-ufs-accent">OT-2026-0105</td>
                  <td className="font-semibold text-white">Hospital CIMA Escazú</td>
                  <td className="text-slate-400">Desinfección Quirófano</td>
                  <td>
                    <span className="bg-red-950/50 text-neon-danger border border-neon-danger/40 px-2 py-0.5 rounded text-[10px] font-bold">URGENTE</span>
                  </td>
                  <td className="text-neon-danger font-bold animate-pulse">Vence en 42m</td>
                  <td className="text-right">
                    <Link href="/ordenes/2" className="text-ufs-accent hover:underline font-bold text-[11px] inline-flex items-center">
                      Monitorear <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/10 transition-colors duration-200">
                  <td className="py-3.5 font-mono font-bold text-ufs-accent">OT-2026-0106</td>
                  <td className="font-semibold text-white">Intel Belén</td>
                  <td className="text-slate-400">Mantenimiento HVAC</td>
                  <td>
                    <span className="bg-amber-950/40 text-neon-warning border border-neon-warning/30 px-2 py-0.5 rounded text-[10px] font-bold">ALTA</span>
                  </td>
                  <td className="text-neon-warning font-semibold">Vence en 58m</td>
                  <td className="text-right">
                    <Link href="/ordenes/3" className="text-ufs-accent hover:underline font-bold text-[11px] inline-flex items-center">
                      Monitorear <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time telemetry activity logs feed */}
        <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3 mb-5">
              <div className="flex items-center space-x-2.5">
                <Activity className="w-4.5 h-4.5 text-ufs-accent" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Actividad en Tiempo Real</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-neon-success animate-ping" />
            </div>

            <div className="space-y-4">
              {feed.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 text-xs leading-relaxed transition-all duration-300">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.type === "complete" ? "bg-neon-success" :
                    item.type === "urgente" ? "bg-neon-danger" : 
                    item.type === "checkin" ? "bg-ufs-accent" : "bg-neon-warning"
                  }`} />
                  
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">
                      {item.text}
                    </p>
                    <span className="text-[9px] text-slate-500 font-bold block mt-0.5 uppercase tracking-wider">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/campo"
            className="w-full bg-slate-950/60 border border-cyber-border hover:border-ufs-accent text-slate-300 hover:text-white mt-6 py-2.5 rounded-lg text-center text-xs font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>ABRIR SEGUIMIENTO SATELITAL</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
