"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  Clock, 
  Building2, 
  CornerDownRight,
  Maximize2
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { Incidente, Cliente, UserProfile } from "@/types";
import { getLocalGeminiKey, analyzeFieldIncident } from "@/lib/gemini";

export default function IncidentesPage() {
  // DB States
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [operativos, setOperativos] = useState<UserProfile[]>([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeveridad, setSelectedSeveridad] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");

  // Form reporting States
  const [reportClienteId, setReportClienteId] = useState("");
  const [reportTipo, setReportTipo] = useState("otro");
  const [reportSeveridad, setReportSeveridad] = useState<"leve" | "moderado" | "grave" | "critico">("leve");
  const [reportDescripcion, setReportDescripcion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Focus Detail Drawer State
  const [focusedIncident, setFocusedIncident] = useState<Incidente | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);

  // Load from DB
  const loadIncidentData = () => {
    MockDB.initialize();
    setIncidentes(MockDB.getIncidentes());
    setClientes(MockDB.getClientes());
    
    const profiles = MockDB.getProfiles();
    setOperativos(profiles.filter(p => p.role === "operativo"));
    
    const cls = MockDB.getClientes();
    if (cls.length > 0) setReportClienteId(cls[0].id);
  };

  useEffect(() => {
    loadIncidentData();
  }, []);

  // Web Audio Synth for radar alarms
  const playAlertChime = (severity: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      // Urgencies make high discordant beeps, mild alerts make standard beeps
      if (severity === "critico" || severity === "grave") {
        osc.frequency.setValueAtTime(660, ctx.currentTime); 
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1); 
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.2); 
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
      }
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.warn(err);
    }
  };

  // Submit Incident
  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportClienteId || !reportDescripcion) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new incident
      const newInc = MockDB.createIncidente({
        cliente_id: reportClienteId,
        reportado_por: "prof-2", // Mario Vargas
        tipo: reportTipo as any,
        severidad: reportSeveridad,
        descripcion: reportDescripcion,
        estado: "reportado"
      });

      playAlertChime(reportSeveridad);
      setReportDescripcion("");
      setIsSubmitting(false);
      loadIncidentData(); // Refresh list

      // Focus on the newly created incident to allow immediate AI Audit
      setFocusedIncident(newInc);
      setAiAuditResult(null);
    } catch (err) {
      alert("Error al reportar el incidente.");
      setIsSubmitting(false);
    }
  };

  // Trigger Gemini AI Mitigation Audit
  const handleTriggerAiAudit = async (inc: Incidente) => {
    setIsAiLoading(true);
    setAiAuditResult(null);

    try {
      // Pass a dummy base64 representation of a site accident or chemical spill
      const dummyPhotoBase64 = "data:image/jpeg;base64,mockSpillPhotoData...";
      const audit = await analyzeFieldIncident(dummyPhotoBase64, inc.descripcion);
      setAiAuditResult(audit);
      
      // Update the incident in the DB with the IA report details
      MockDB.updateIncident(inc.id, {
        descripcion_ia: `[IA AUDIT] Se clasificó como: ${audit.tipo}. Severidad sugerida: ${audit.severidad.toUpperCase()}. Acciones recomendadas: ${audit.acciones.join(", ")}`
      });
      loadIncidentData();
    } catch (err) {
      console.error(err);
      alert("No se pudo realizar el análisis de auditoría de IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtering
  const filteredIncidentes = incidentes.filter(inc => {
    const matchesSearch = inc.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inc.cliente?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeveridad = selectedSeveridad === "todos" || inc.severidad === selectedSeveridad;
    const matchesEstado = selectedEstado === "todos" || inc.estado === selectedEstado;
    return matchesSearch && matchesSeveridad && matchesEstado;
  });

  // Severity color maps
  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case "critico":
        return "bg-red-950/20 text-neon-danger border-neon-danger/40 shadow-[0_0_8px_rgba(255,59,48,0.25)] animate-pulse";
      case "grave":
        return "bg-orange-950/15 text-neon-danger border-orange-500/30";
      case "moderado":
        return "bg-yellow-950/10 text-neon-warning border-neon-warning/30";
      default:
        return "bg-slate-900 text-slate-400 border-cyber-border";
    }
  };

  // Status color maps
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "cerrado":
        return "bg-slate-950 text-slate-500 border-cyber-border/40";
      case "resuelto":
        return "bg-green-950/15 text-neon-success border-neon-success/20";
      case "en_investigacion":
        return "bg-ufs-primary/10 text-ufs-accent border-ufs-accent/20";
      default:
        return "bg-red-950/10 text-neon-danger border-neon-danger/20";
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            CONTROL DE RIESGOS & SALUD OCUPACIONAL
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            REPORTES DE INCIDENTES
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestión operacional de desviaciones, daños, fallas de equipo, derrames químicos y quejas de clientes.
          </p>
        </div>

        <div className="flex items-center text-[10px] text-slate-500 font-bold font-mono bg-cyber-surface/30 px-3 py-1.5 rounded-lg border border-cyber-border">
          <Volume2 className="w-3.5 h-3.5 mr-1 text-neon-danger" />
          <span>SIREN SYNTH ACTIVE</span>
        </div>
      </div>

      {/* Split layout: Form + List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Col 1: Report Incident Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-5 glass-panel">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-neon-danger" />
              <span>Reportar Suceso</span>
            </h3>

            <form onSubmit={handleSubmitIncident} className="space-y-4 text-xs font-medium">
              
              {/* Account select */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase">Cliente / Planta</label>
                <select
                  required
                  value={reportClienteId}
                  onChange={(e) => setReportClienteId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-slate-300 rounded px-2.5 py-2 focus:outline-none cursor-pointer"
                >
                  {clientes.map(c => (
                    <option key={c.id} value={c.id} className="bg-cyber-surface">{c.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Incident type */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase">Tipo de Incidente</label>
                <select
                  value={reportTipo}
                  onChange={(e) => setReportTipo(e.target.value)}
                  className="w-full bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-slate-300 rounded px-2.5 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="accidente_personal" className="bg-cyber-surface">Accidente de Personal</option>
                  <option value="dano_inmueble" className="bg-cyber-surface">Daño a la Infraestructura</option>
                  <option value="incidente_quimico" className="bg-cyber-surface">Derrame Químico</option>
                  <option value="falla_equipo" className="bg-cyber-surface">Falla Crítica de Equipo</option>
                  <option value="queja_cliente" className="bg-cyber-surface">Queja Operativa de Cliente</option>
                  <option value="robo" className="bg-cyber-surface">Hurto / Extravío</option>
                  <option value="otro" className="bg-cyber-surface">Otro Suceso / Incidente</option>
                </select>
              </div>

              {/* Severity selection */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase block">Severidad Inicial</label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {([
                    { val: "leve", lbl: "Leve" },
                    { val: "moderado", lbl: "Moderado" },
                    { val: "grave", lbl: "Grave" },
                    { val: "critico", lbl: "Crítico" }
                  ] as const).map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setReportSeveridad(opt.val)}
                      className={`py-1.5 px-2 rounded font-bold border text-[10px] text-center uppercase transition-all ${
                        reportSeveridad === opt.val
                          ? opt.val === "critico" || opt.val === "grave" 
                            ? "bg-red-950/20 text-neon-danger border-neon-danger/40"
                            : opt.val === "moderado"
                              ? "bg-yellow-950/10 text-neon-warning border-neon-warning/30"
                              : "bg-slate-700 border-slate-600 text-white"
                          : "border-cyber-border text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {opt.lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase">Descripción de Hechos</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detalles sobre lo ocurrido, personas presentes, equipos involucrados y condiciones climáticas o locacionales..."
                  value={reportDescripcion}
                  onChange={(e) => setReportDescripcion(e.target.value)}
                  className="w-full bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-white rounded px-2.5 py-2 focus:outline-none placeholder-slate-600 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-ufs-secondary hover:bg-ufs-secondary/85 text-white font-sans text-[10px] font-bold py-2.5 rounded-lg transition-all duration-300 shadow-lg neon-border-cyan flex items-center justify-center space-x-1.5 uppercase tracking-wider disabled:opacity-50"
              >
                <span>Reportar y Auditar</span>
              </button>

            </form>
          </div>
        </div>

        {/* Col 2 & 3: Incident List & Detail focus */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main List */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl overflow-hidden glass-panel">
            <div className="p-4 bg-slate-950/30 border-b border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-white tracking-wider uppercase">Bitácora de Desviaciones</span>
              
              {/* Search HUD */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar incidente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950/40 border border-cyber-border/80 text-xs font-semibold px-3 py-1.5 rounded focus:outline-none focus:border-ufs-accent text-slate-300 placeholder-slate-600"
                />
                
                <select
                  value={selectedSeveridad}
                  onChange={(e) => setSelectedSeveridad(e.target.value)}
                  className="bg-slate-950/40 border border-cyber-border/80 text-xs font-semibold px-2 py-1.5 rounded focus:outline-none focus:border-ufs-accent text-slate-300 cursor-pointer"
                >
                  <option value="todos" className="bg-cyber-surface">Severidad</option>
                  <option value="leve" className="bg-cyber-surface">Leve</option>
                  <option value="moderado" className="bg-cyber-surface">Moderado</option>
                  <option value="grave" className="bg-cyber-surface">Grave</option>
                  <option value="critico" className="bg-cyber-surface">Crítico</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-200">
                <thead>
                  <tr className="border-b border-cyber-border bg-slate-950/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider select-none">
                    <th className="py-3 px-5">Incidente</th>
                    <th>Cuenta</th>
                    <th>Reportó</th>
                    <th>Fecha/Hora</th>
                    <th>Severidad</th>
                    <th>Estado</th>
                    <th className="text-right px-5">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/30">
                  {filteredIncidentes.length > 0 ? (
                    filteredIncidentes.map((inc) => (
                      <tr 
                        key={inc.id} 
                        className={`hover:bg-slate-800/10 cursor-pointer transition-colors duration-200 ${
                          focusedIncident?.id === inc.id ? "bg-ufs-primary/10" : ""
                        }`}
                        onClick={() => {
                          setFocusedIncident(inc);
                          setAiAuditResult(null);
                        }}
                      >
                        <td className="py-3.5 px-5 font-bold text-white uppercase font-mono text-[10px]">
                          {inc.tipo.replace("_", " ")}
                        </td>
                        <td className="font-semibold text-slate-200">
                          {inc.cliente?.nombre || "Sin Cuenta"}
                        </td>
                        <td className="text-slate-400">
                          {inc.reporter?.full_name || "Especialista"}
                        </td>
                        <td className="text-slate-500">
                          {new Date(inc.timestamp).toLocaleString("es-CR")}
                        </td>
                        <td>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityClasses(inc.severidad)}`}>
                            {inc.severidad}
                          </span>
                        </td>
                        <td>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusClasses(inc.estado)}`}>
                            {inc.estado.replace("_", " ")}
                          </span>
                        </td>
                        <td className="text-right px-5">
                          <button className="p-1 rounded bg-slate-950/40 border border-cyber-border text-slate-500 hover:text-ufs-accent hover:border-ufs-accent transition-all duration-300">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 font-bold uppercase tracking-wider">
                        No se registran sucesos activos bajo los parámetros ingresados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Focused Incident Detail Drawer */}
          {focusedIncident && (
            <div className="bg-cyber-surface/30 border border-ufs-accent/40 rounded-xl p-6 glass-panel space-y-4 shadow-[0_8px_30px_rgba(0,48,135,0.2)]">
              <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
                <div>
                  <span className="text-[9px] text-ufs-accent font-bold tracking-wider font-mono block uppercase">
                    EXPEDIENTE DE DESVIACIÓN ACTIVA
                  </span>
                  <h4 className="font-display font-black text-sm text-white uppercase mt-0.5">
                    {focusedIncident.tipo.replace("_", " ")} — {focusedIncident.cliente?.nombre}
                  </h4>
                </div>
                
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityClasses(focusedIncident.severidad)}`}>
                  SEVERIDAD: {focusedIncident.severidad}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-normal">
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-1">Descripción de Hechos Reportados</span>
                    <p className="text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-cyber-border">
                      {focusedIncident.descripcion}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider">Reportó Suceso</span>
                      <span className="text-slate-300 font-semibold">{focusedIncident.reporter?.full_name || "Operativo en campo"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider">Fecha y Hora</span>
                      <span className="text-slate-300 font-mono text-[10.5px]">{new Date(focusedIncident.timestamp).toLocaleString("es-CR")}</span>
                    </div>
                  </div>

                  {focusedIncident.acciones_tomadas && (
                    <div>
                      <span className="text-slate-500 font-bold block uppercase text-[8.5px] tracking-wider mb-1">Acciones de Contención Realizadas</span>
                      <div className="flex items-start text-neon-success bg-green-950/10 border border-green-950/40 p-2.5 rounded-lg text-[10.5px]">
                        <CornerDownRight className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5" />
                        <span>{focusedIncident.acciones_tomadas}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gemini AI mitigation audit container */}
                <div className="bg-slate-950/50 rounded-xl p-5 border border-cyber-border space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h5 className="font-mono text-[10px] font-bold text-ufs-accent flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>AUDITORÍA OPERACIONAL CON IA (GEMINI)</span>
                    </h5>
                    
                    {aiAuditResult ? (
                      <div className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                          <div>
                            <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold">Tipo IA</span>
                            <span className="text-white font-semibold">{aiAuditResult.tipo}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold">Sugerencia Severidad</span>
                            <span className="text-neon-danger font-bold uppercase">{aiAuditResult.severidad}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold mb-1">Dictamen IA</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed italic">
                            "{aiAuditResult.descripcion}"
                          </p>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold mb-1.5">Plan de Mitigación Inmediata</span>
                          <ul className="space-y-1 text-[10.5px]">
                            {aiAuditResult.acciones.map((act: string, idx: number) => (
                              <li key={idx} className="flex items-start text-slate-300">
                                <span className="text-ufs-accent font-bold mr-1.5">{idx + 1}.</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-[10.5px] leading-relaxed">
                        Invoque el motor de Gemini Vision/Text para auditar los riesgos asociados a esta desviación, clasificar la severidad sugerida y dictaminar un plan de mitigación en 4 puntos operacionales.
                      </p>
                    )}
                  </div>

                  {/* Trigger AI Button */}
                  {!aiAuditResult && (
                    <button
                      onClick={() => handleTriggerAiAudit(focusedIncident)}
                      disabled={isAiLoading}
                      className="w-full bg-gradient-to-r from-ufs-primary/50 to-ufs-secondary/50 hover:from-ufs-primary/70 hover:to-ufs-secondary/70 border border-ufs-accent/40 hover:border-ufs-accent text-ufs-accent hover:text-white font-mono text-[10px] font-bold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all duration-300 disabled:opacity-40"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? "animate-spin" : ""}`} />
                      <span>{isAiLoading ? "AUDITANDO INCIDENTE..." : "AUDITAR INCIDENTE CON GEMINI"}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
