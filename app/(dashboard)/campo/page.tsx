"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Map, 
  MapPin, 
  Clock, 
  UserCheck, 
  Activity, 
  Plus, 
  Volume2 
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { Cliente, CheckinCampo, UserProfile } from "@/types";

// Dynamic import with SSR disabled to prevent Leaflet execution on Next.js server
const LeafletMap = dynamic(
  () => import("@/components/shared/LeafletMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] rounded-xl border border-cyber-border bg-slate-950/40 flex items-center justify-center">
        <span className="text-xs font-bold text-ufs-accent font-mono animate-pulse">
          INICIALIZANDO MOTOR CARTOGRÁFICO DE TELEMETRÍA...
        </span>
      </div>
    )
  }
);

export default function CampoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [checkins, setCheckins] = useState<CheckinCampo[]>([]);
  const [operativos, setOperativos] = useState<UserProfile[]>([]);
  
  // Simulator states
  const [selectedOperativo, setSelectedOperativo] = useState("");
  const [selectedCliente, setSelectedCliente] = useState("");
  const [chkTipo, setChkTipo] = useState<"entrada" | "salida">("entrada");
  const [chkNotas, setChkNotas] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.955, -84.12]);
  const [mapZoom, setMapZoom] = useState(12);

  // Load from DB
  const loadDatabase = () => {
    MockDB.initialize();
    setClientes(MockDB.getClientes());
    setCheckins(MockDB.getCheckins());
    
    const profiles = MockDB.getProfiles();
    const ops = profiles.filter(p => p.role === "operativo");
    setOperativos(ops);
    
    if (ops.length > 0) setSelectedOperativo(ops[0].id);
    const cls = MockDB.getClientes();
    if (cls.length > 0) setSelectedCliente(cls[0].id);
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Web Audio chime for checkin
  const playCheckinBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Dual high pitch radar beep
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (err) {
      console.warn(err);
    }
  };

  // Focus map on a client
  const handleFocusClient = (c: Cliente) => {
    setMapCenter([c.lat, c.lng]);
    setMapZoom(15);
  };

  // Focus map on a checkin
  const handleFocusCheckin = (chk: CheckinCampo) => {
    setMapCenter([chk.lat, chk.lng]);
    setMapZoom(16);
  };

  // Submit Simulated Check-in
  const handleSimulateCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperativo || !selectedCliente) return;

    const op = operativos.find(p => p.id === selectedOperativo);
    const cl = clientes.find(c => c.id === selectedCliente);
    if (!op || !cl) return;

    // Jitter coordinates slightly around the client center to represent field accuracy
    const latJitter = cl.lat + (Math.random() - 0.5) * 0.0015;
    const lngJitter = cl.lng + (Math.random() - 0.5) * 0.0015;

    MockDB.createCheckin({
      operativo_id: selectedOperativo,
      cliente_id: selectedCliente,
      tipo: chkTipo,
      lat: latJitter,
      lng: lngJitter,
      notas: chkNotas || (chkTipo === "entrada" 
        ? "Iniciando despliegue de mantenimiento programado." 
        : "Servicio cerrado, orden firmada e inspeccionada.")
    });

    playCheckinBeep();
    setChkNotas("");
    
    // Refresh
    loadDatabase();
    
    // Auto pan map to new marker
    setMapCenter([latJitter, lngJitter]);
    setMapZoom(15);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            SUPERVISIÓN CARTOGRÁFICA
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            MONITORIZACIÓN EN TIEMPO REAL
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Localización geográfica de cuentas activas y eventos de check-in / check-out de especialistas.
          </p>
        </div>

        <div className="flex items-center text-[10px] text-slate-500 font-bold font-mono bg-cyber-surface/30 px-3 py-1.5 rounded-lg border border-cyber-border">
          <Volume2 className="w-3.5 h-3.5 mr-1 text-ufs-accent" />
          <span>RADAR CHIME ACTIVO</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Operatives list and telemetry logs */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Active operatives card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-5 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2 flex items-center justify-between">
              <span>Cuadrillas en Campo</span>
              <span className="w-2 h-2 rounded-full bg-neon-success animate-ping shrink-0" />
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {operativos.map((op) => {
                // Find latest checkin for this operative
                const opChks = checkins.filter(c => c.operativo_id === op.id);
                const latestChk = opChks[0]; // Ordered newest first
                
                return (
                  <div 
                    key={op.id}
                    className="p-3 bg-slate-950/40 border border-cyber-border/70 hover:border-ufs-accent rounded-lg flex items-center justify-between transition-all duration-300 group cursor-pointer"
                    onClick={() => latestChk && handleFocusCheckin(latestChk)}
                  >
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-ufs-accent transition-colors block">
                        {op.full_name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">
                        Zona base: {op.zone}
                      </span>
                    </div>

                    <div className="text-right">
                      {latestChk ? (
                        <>
                          <span className={`text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            latestChk.tipo === "entrada" 
                              ? "bg-green-950/20 text-neon-success border border-neon-success/20" 
                              : "bg-slate-900 text-slate-400 border border-cyber-border"
                          }`}>
                            {latestChk.tipo === "entrada" ? "En Sitio" : "En Ruta"}
                          </span>
                          <span className="text-[8px] text-slate-500 font-mono block mt-1">
                            {new Date(latestChk.timestamp).toLocaleTimeString("es-CR", {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </>
                      ) : (
                        <span className="text-[8.5px] text-slate-600 font-bold uppercase">
                          Sin Check-in
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulate Action Box */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-5 glass-panel">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2 mb-4 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-ufs-accent" />
              <span>Simulador GPS App</span>
            </h3>

            <form onSubmit={handleSimulateCheckin} className="space-y-3.5 text-xs font-medium">
              
              {/* Operative select */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase">Especialista</label>
                <select
                  value={selectedOperativo}
                  onChange={(e) => setSelectedOperativo(e.target.value)}
                  className="w-full bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  {operativos.map(op => (
                    <option key={op.id} value={op.id} className="bg-cyber-surface">{op.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Client select */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase">Ubicación Cliente</label>
                <select
                  value={selectedCliente}
                  onChange={(e) => setSelectedCliente(e.target.value)}
                  className="w-full bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  {clientes.map(c => (
                    <option key={c.id} value={c.id} className="bg-cyber-surface">{c.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Action type */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChkTipo("entrada")}
                  className={`py-1.5 px-2 rounded font-bold border transition-all text-[10px] ${
                    chkTipo === "entrada"
                      ? "bg-green-950/20 text-neon-success border-neon-success/40"
                      : "border-cyber-border text-slate-500 hover:text-slate-300"
                  }`}
                >
                  ENTRADA (CHECK-IN)
                </button>
                <button
                  type="button"
                  onClick={() => setChkTipo("salida")}
                  className={`py-1.5 px-2 rounded font-bold border transition-all text-[10px] ${
                    chkTipo === "salida"
                      ? "bg-slate-800 text-slate-300 border-slate-600"
                      : "border-cyber-border text-slate-500 hover:text-slate-300"
                  }`}
                >
                  SALIDA (CHECK-OUT)
                </button>
              </div>

              {/* Comment notes */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase">Comentario Operativo</label>
                <input
                  type="text"
                  placeholder="Ej: Iniciando limpieza de oficinas"
                  value={chkNotas}
                  onChange={(e) => setChkNotas(e.target.value)}
                  className="w-full bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-white rounded px-2.5 py-1.5 text-xs focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-ufs-accent hover:bg-ufs-accent/90 text-slate-950 font-bold py-2 rounded text-[10px] uppercase tracking-wider transition-all duration-300"
              >
                REGISTRAR PING GPS
              </button>

            </form>
          </div>

        </div>

        {/* Right Side: Map & Map controls */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Map view container */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-3 glass-panel relative">
            
            {/* Map overlay controls */}
            <div className="absolute top-6 right-6 z-10 bg-slate-950/90 border border-cyber-border/80 px-4 py-2.5 rounded-lg max-w-sm flex items-center space-x-3 shadow-2xl backdrop-blur">
              <Activity className="w-4 h-4 text-ufs-accent shrink-0 animate-pulse" />
              <div className="text-[10px] font-medium leading-tight">
                <span className="text-white font-bold block">Consola de Telemetría Activa</span>
                <span className="text-slate-500 font-mono">Pings recibidos: {checkins.length} totales</span>
              </div>
            </div>

            <LeafletMap 
              clientes={clientes} 
              checkins={checkins} 
              center={mapCenter} 
              zoom={mapZoom} 
            />
          </div>

          {/* Quick Client map filters shortcut bar */}
          <div className="bg-cyber-surface/20 border border-cyber-border/50 rounded-xl p-4 glass-panel">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-3">
              CENTRAR MAPA EN CUENTAS PRINCIPALES
            </span>
            <div className="flex flex-wrap gap-2.5">
              {clientes.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleFocusClient(c)}
                  className="bg-slate-950/40 border border-cyber-border/80 hover:border-ufs-accent text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all duration-300 hover:bg-ufs-primary/10"
                >
                  <MapPin className="w-3.5 h-3.5 text-ufs-accent" />
                  <span>{c.nombre}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
