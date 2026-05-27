"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  FileText, 
  ShieldAlert, 
  Volume2 
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { Cliente, UserProfile, OTPrioridad } from "@/types";
import { getLocalGeminiKey } from "@/lib/gemini";

export default function NuevaOrdenPage() {
  const router = useRouter();
  
  // Lists
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [supervisores, setSupervisores] = useState<UserProfile[]>([]);
  const [operativos, setOperativos] = useState<UserProfile[]>([]);
  
  // Form State
  const [clienteId, setClienteId] = useState("");
  const [tipoServicio, setTipoServicio] = useState("Limpieza General");
  const [prioridad, setPrioridad] = useState<OTPrioridad>("media");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [operativoId, setOperativoId] = useState("");
  const [fechaProgramada, setFechaProgramada] = useState("");
  const [costoEstimado, setCostoEstimado] = useState(0);
  
  // UI states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReport, setAiReport] = useState("");
  
  // Load data
  useEffect(() => {
    MockDB.initialize();
    setClientes(MockDB.getClientes());
    
    const profiles = MockDB.getProfiles();
    setSupervisores(profiles.filter(p => p.role === "supervisor"));
    setOperativos(profiles.filter(p => p.role === "operativo"));
    
    // Set default select values
    const cl = MockDB.getClientes();
    if (cl.length > 0) setClienteId(cl[0].id);
    
    const sups = profiles.filter(p => p.role === "supervisor");
    if (sups.length > 0) setSupervisorId(sups[0].id);
    
    const ops = profiles.filter(p => p.role === "operativo");
    if (ops.length > 0) setOperativoId(ops[0].id);
    
    // Set default date: today + 1 day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    setFechaProgramada(tomorrow.toISOString().slice(0, 16));
  }, []);

  // Web Audio Synth for confirmation
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = "sine";
      osc2.type = "sine";
      
      // Cyber neon chime frequencies
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.1);  // A5
      
      osc2.frequency.setValueAtTime(293.66, ctx.currentTime); // D4
      osc2.frequency.setValueAtTime(440, ctx.currentTime + 0.1);  // A4
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.warn("Audio Context failed to trigger:", err);
    }
  };

  // AI Priority and Complexity Classifier
  const analyzeWithAI = async () => {
    if (!titulo || !descripcion) {
      alert("Por favor ingrese un título y descripción para que la IA los evalúe.");
      return;
    }
    
    setIsAnalyzing(true);
    setAiReport("");
    
    const apiKey = getLocalGeminiKey();
    
    // Artificial intelligence call to classify priority
    if (!apiKey) {
      // Mock analysis fallback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let recommendedPriority: OTPrioridad = "media";
      let costSuggestion = 45000;
      let rationale = "";
      
      const textToAnalyze = (titulo + " " + descripcion).toLowerCase();
      if (textToAnalyze.includes("urgente") || textToAnalyze.includes("inundacion") || textToAnalyze.includes("fuga") || textToAnalyze.includes("corto") || textToAnalyze.includes("quirófano") || textToAnalyze.includes("cima")) {
        recommendedPriority = "urgente";
        costSuggestion = 95000;
        rationale = "Detección de términos de riesgo de infraestructura o parada médica inminente.";
      } else if (textToAnalyze.includes("alto") || textToAnalyze.includes("riesgo") || textToAnalyze.includes("fallo") || textToAnalyze.includes("rotura")) {
        recommendedPriority = "alta";
        costSuggestion = 75000;
        rationale = "Falla técnica que compromete la continuidad operativa regular.";
      } else if (textToAnalyze.includes("jardinería") || textToAnalyze.includes("pintar") || textToAnalyze.includes("limpiar")) {
        recommendedPriority = "baja";
        costSuggestion = 25000;
        rationale = "Mantenimiento preventivo regular sin afección de flujo principal.";
      } else {
        rationale = "Clasificación estándar para tareas operacionales rutinarias de mantenimiento.";
      }
      
      setPrioridad(recommendedPriority);
      setCostoEstimado(costSuggestion);
      setAiReport(`[IA ANALYTICS] Prioridad sugerida: ${recommendedPriority.toUpperCase()}. Razón: ${rationale}. Costo sugerido para esta categoría: ₡${costSuggestion.toLocaleString()}`);
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analiza esta solicitud de orden de trabajo operacional:\n` +
                        `Título: ${titulo}\n` +
                        `Descripción: ${descripcion}\n\n` +
                        `Eres el despachador de inteligencia artificial de United Facility Services Costa Rica. Clasifica la solicitud y devuelve un objeto JSON con los campos:\n` +
                        `1. "prioridad": ('baja', 'media', 'alta', 'urgente')\n` +
                        `2. "costo_sugerido": número de colones estimado para este tipo de servicio\n` +
                        `3. "analisis": explicación de 20 palabras de por qué elegiste esta prioridad.\n\n` +
                        `Responde únicamente con el JSON estricto.`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });
      
      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const parsed = JSON.parse(textResult);
      
      if (parsed.prioridad) setPrioridad(parsed.prioridad);
      if (parsed.costo_sugerido) setCostoEstimado(parsed.costo_sugerido);
      if (parsed.analisis) {
        setAiReport(`[IA GEMINI] Prioridad clasificada: ${parsed.prioridad.toUpperCase()}. ${parsed.analisis}`);
      }
    } catch (err) {
      console.error(err);
      setAiReport("Error al contactar al motor de IA. Prioridad clasificada localmente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !titulo || !fechaProgramada) {
      alert("Por favor complete los campos obligatorios: Cliente, Título y Fecha Programada.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      MockDB.createOrden({
        cliente_id: clienteId,
        tipo_servicio: tipoServicio,
        prioridad,
        estado: "pendiente",
        titulo,
        descripcion,
        supervisor_id: supervisorId,
        operativo_id: operativoId,
        fecha_programada: new Date(fechaProgramada).toISOString(),
        costo_estimado: Number(costoEstimado),
      });
      
      playChime();
      
      setTimeout(() => {
        router.push("/ordenes");
      }, 800);
    } catch (err) {
      console.error(err);
      alert("Error al guardar la orden de trabajo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 select-none">
      
      {/* Back button & title */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/ordenes"
          className="p-2 rounded-lg bg-cyber-surface/50 border border-cyber-border hover:border-ufs-accent text-slate-400 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            NUEVA ORDEN DE SERVICIO
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            AGENDAR ORDEN DE TRABAJO (OT)
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Main Info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* General Data Card */}
            <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2">
                Información del Servicio
              </h3>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Título de la Solicitud *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fuga de agua en tubería de condensado de chiller 2"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg px-4 py-2.5 font-sans text-xs font-semibold text-white placeholder-slate-600 transition-all duration-300"
                />
              </div>

              {/* Description input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Descripción Detallada
                </label>
                <textarea
                  rows={4}
                  placeholder="Detalles sobre el requerimiento de mantenimiento, EPP obligatorio, herramientas necesarias y alcance del trabajo..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg px-4 py-2.5 font-sans text-xs font-semibold text-white placeholder-slate-600 transition-all duration-300 resize-none"
                />
              </div>

              {/* IA Assist trigger button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 bg-gradient-to-r from-ufs-primary/40 to-ufs-secondary/40 hover:from-ufs-primary/60 hover:to-ufs-secondary/60 border border-ufs-accent/40 hover:border-ufs-accent text-ufs-accent hover:text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-300 disabled:opacity-40"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  <span>{isAnalyzing ? "ANALIZANDO CON IA..." : "PRE EVALUAR CON GEMINI IA"}</span>
                </button>

                <div className="flex items-center text-[10px] text-slate-500 font-bold font-mono">
                  <Volume2 className="w-3.5 h-3.5 mr-1" />
                  <span>WEB AUDIO CHIME ACTIVO</span>
                </div>
              </div>

              {/* AI result feedback banner */}
              {aiReport && (
                <div className="bg-ufs-primary/10 border border-ufs-accent/30 rounded-lg p-3 text-ufs-accent text-[11px] font-mono leading-relaxed select-all">
                  {aiReport}
                </div>
              )}
            </div>

            {/* Assignments Card */}
            <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2">
                Planificación & Personal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Scheduled Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Fecha y Hora Programada *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="datetime-local"
                      required
                      value={fechaProgramada}
                      onChange={(e) => setFechaProgramada(e.target.value)}
                      className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg pl-9 pr-4 py-2.5 font-sans text-xs font-semibold text-white transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Estimated Cost */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Costo Estimado (Colones)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={costoEstimado}
                      onChange={(e) => setCostoEstimado(Number(e.target.value))}
                      className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg pl-9 pr-4 py-2.5 font-sans text-xs font-semibold text-white transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Supervisor */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Supervisor Responsable
                  </label>
                  <select
                    value={supervisorId}
                    onChange={(e) => setSupervisorId(e.target.value)}
                    className="w-full bg-slate-950/40 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg px-3 py-2.5 font-sans text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    {supervisores.map((sup) => (
                      <option key={sup.id} value={sup.id} className="bg-cyber-surface">
                        {sup.full_name} ({sup.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field operative */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Especialista Operativo
                  </label>
                  <select
                    value={operativoId}
                    onChange={(e) => setOperativoId(e.target.value)}
                    className="w-full bg-slate-950/40 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg px-3 py-2.5 font-sans text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    {operativos.map((op) => (
                      <option key={op.id} value={op.id} className="bg-cyber-surface">
                        {op.full_name} — {op.zone}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

          </div>

          {/* Col 3: Side classification metadata */}
          <div className="space-y-6">
            
            {/* Account Card */}
            <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2">
                Cuenta Corporativa
              </h3>

              {/* Client select */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Cliente / Inmueble *
                </label>
                <select
                  required
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full bg-slate-950/40 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg px-3 py-2.5 font-sans text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id} className="bg-cyber-surface">
                      {c.nombre} ({c.zona})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type select */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Tipo de Servicio
                </label>
                <select
                  value={tipoServicio}
                  onChange={(e) => setTipoServicio(e.target.value)}
                  className="w-full bg-slate-950/40 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg px-3 py-2.5 font-sans text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  <option value="Limpieza General" className="bg-cyber-surface">Limpieza General</option>
                  <option value="Desinfección Profunda" className="bg-cyber-surface">Desinfección Profunda</option>
                  <option value="Mantenimiento HVAC" className="bg-cyber-surface">Mantenimiento HVAC</option>
                  <option value="Control Plagas" className="bg-cyber-surface">Control Plagas</option>
                  <option value="Jardinería Ornamental" className="bg-cyber-surface">Jardinería Ornamental</option>
                  <option value="Mantenimiento Correctivo" className="bg-cyber-surface">Mantenimiento Correctivo</option>
                  <option value="Servicios Especiales" className="bg-cyber-surface">Servicios Especiales</option>
                </select>
              </div>
            </div>

            {/* SLA Priority Card */}
            <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border pb-2">
                Nivel de Prioridad & SLA
              </h3>

              <div className="space-y-4">
                
                {/* Priority Selector */}
                <div className="space-y-2">
                  {([
                    { value: "baja", label: "Baja (24h+)", color: "border-slate-800 text-slate-400 hover:border-slate-500 hover:bg-slate-950/20" },
                    { value: "media", label: "Media (12h)", color: "border-ufs-accent/40 text-ufs-accent hover:border-ufs-accent hover:bg-ufs-primary/10" },
                    { value: "alta", label: "Alta (4h)", color: "border-neon-warning/40 text-neon-warning hover:border-neon-warning hover:bg-yellow-950/10" },
                    { value: "urgente", label: "Urgente (1-2h)", color: "border-neon-danger/40 text-neon-danger hover:border-neon-danger hover:bg-red-950/15" }
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrioridad(opt.value)}
                      className={`w-full text-left font-sans text-xs font-bold px-4 py-2.5 rounded-lg border transition-all duration-300 ${
                        prioridad === opt.value 
                          ? opt.value === "urgente" ? "bg-neon-danger border-neon-danger text-white shadow-[0_0_10px_#ff3b30]"
                            : opt.value === "alta" ? "bg-neon-warning border-neon-warning text-slate-950"
                            : opt.value === "media" ? "bg-ufs-accent border-ufs-accent text-white shadow-[0_0_10px_#00A3E0]"
                            : "bg-slate-600 border-slate-600 text-white"
                          : opt.color
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* SLA alert telemetry box */}
                <div className="bg-slate-950/50 rounded-lg p-3 border border-cyber-border flex items-start space-x-2.5">
                  <ShieldAlert className="w-4 h-4 text-ufs-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    La prioridad define el acuerdo de nivel de servicio (SLA). Una vez agendada, el sistema iniciará el reloj de telemetría y notificará automáticamente al dispositivo móvil del especialista asignado.
                  </p>
                </div>

              </div>
            </div>

            {/* Actions button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ufs-secondary hover:bg-ufs-secondary/85 text-white font-sans text-xs font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg neon-border-cyan flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{isSubmitting ? "GUARDANDO..." : "AGENDAR Y ACTIVAR ORDEN"}</span>
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}
