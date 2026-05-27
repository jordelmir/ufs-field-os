"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Camera, 
  Send, 
  Bot, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Cpu
} from "lucide-react";
import { getLocalGeminiKey, saveLocalGeminiKey, analyzeWorkPhoto } from "@/lib/gemini";

export default function IASuitePage() {
  const [apiKey, setApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  
  // Vision Lab states
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const [visionImgSelected, setVisionImgSelected] = useState<string>("");
  const [visionType, setVisionType] = useState("limpieza_profunda");
  const [visionReport, setVisionReport] = useState<{
    descripcion: string;
    calidad: string;
    seguridad: string;
    recomendaciones: string[];
  } | null>(null);

  // Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", text: "Buenos días. Soy el agente inteligente de UFS Field OS. ¿En qué puedo apoyar en la gestión operativa hoy?" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    // Check if a local key exists on load
    const saved = getLocalGeminiKey();
    if (saved) {
      setApiKey(saved);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    saveLocalGeminiKey(apiKey);
    setIsKeySaved(true);
    alert("API Key guardada de forma segura en la memoria de su navegador.");
  };

  const handleClearKey = () => {
    saveLocalGeminiKey("");
    setApiKey("");
    setIsKeySaved(false);
    alert("API Key eliminada del navegador.");
  };

  // Simulate vision photo analysis
  const runVisionAnalysis = async () => {
    setIsVisionLoading(true);
    setVisionReport(null);
    
    try {
      // Use sample or dynamic analysis
      const report = await analyzeWorkPhoto("mock_base64", visionType);
      setVisionReport(report);
    } catch (err) {
      console.error(err);
      alert("Error al analizar la imagen.");
    } finally {
      setIsVisionLoading(false);
    }
  };

  // Pre-load a high-density operations image sample for evaluation!
  const loadSampleImage = (type: string) => {
    setVisionType(type);
    if (type === "limpieza_profunda") {
      setVisionImgSelected("https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop");
    } else if (type === "mantenimiento_preventivo") {
      setVisionImgSelected("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop");
    } else {
      setVisionImgSelected("https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop");
    }
  };

  // Assistant chatbot response simulator
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatHistory(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    setIsChatLoading(true);

    setTimeout(() => {
      let assistantReply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("sla") || lower.includes("vencid")) {
        assistantReply = "En este momento, tenemos **3 órdenes de trabajo en riesgo crítico de vencimiento de SLA**:\n\n1. **OT-2026-0104** (Genpact CR) - Limpieza General (vence en 25 minutos).\n2. **OT-2026-0105** (Hospital CIMA) - Desinfección Profunda (vence en 42 minutos).\n3. **OT-2026-0106** (Intel Belén) - HVAC Mantenimiento (vence en 58 minutos).\n\nLe recomiendo reasignar un técnico de apoyo a la zona de Escazú de inmediato.";
      } else if (lower.includes("reporte") || lower.includes("resumen")) {
        assistantReply = "### Resumen Operativo Semanal — UFS Costa Rica\n\n- **Órdenes completadas:** 47\n- **Órdenes pendientes:** 23\n- **Cumplimiento global de SLA:** 96.5%\n- **Incidentes críticos:** 0\n- **Operativos activos en campo:** 38 técnicos\n\n**Recomendación de IA:** Se observa una saturación del 92% de tickets en el cuadrante oeste (Escazú). Se sugiere redistribuir 2 técnicos de San José Centro hacia Escazú para amortiguar el flujo del próximo fin de semana.";
      } else if (lower.includes("supervisor")) {
        assistantReply = "El supervisor con mayor volumen de órdenes y mejor satisfacción del cliente (NPS) este mes es **Lic. Jocksan Mora** en la zona de Heredia/Cariari, registrando un NPS promedio de **4.92 / 5.0** en 28 servicios auditados por Gemini.";
      } else {
        assistantReply = `Entendido. Analizando sus registros en campo con respecto a "${userText}". La red de IA de United Facility Services Costa Rica reporta que todas las cuadrillas de limpieza, plagas y mantenimiento están geolocalizadas correctamente en sus cuadrantes de trabajo. ¿Desea que redacte un reporte detallado del estado de algún inmueble?`;
      }

      setChatHistory(prev => [...prev, { role: "assistant", text: assistantReply }]);
      setIsChatLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none text-slate-300 font-medium">
      
      {/* Header title */}
      <div>
        <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
          CENTRO COGNITIVO ENTERPRISE
        </span>
        <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
          ESTUDIO INTELIGENTE DE IA (BYOK)
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Procesamiento de imágenes con visión artificial, auditoría de seguridad y asistentes de lenguaje natural.
        </p>
      </div>

      {/* Grid: 2 columns (Left: BYOK setup & Vision Lab, Right: Interactive chatbot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column Left (BYOK + Vision Lab) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bring Your Own Key setup panel */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-ufs-accent" />
              <span>Configuración de API Key Corporativa (Gemini API)</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                placeholder={isKeySaved ? "••••••••••••••••••••••••••••••••" : "Ingrese su Google Gemini API Key..."}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isKeySaved}
                className="flex-grow bg-slate-950/40 border border-cyber-border/80 focus:border-ufs-accent focus:outline-none rounded-lg px-4 py-2 font-sans text-xs text-white placeholder-slate-500 transition-colors duration-300"
              />
              
              {isKeySaved ? (
                <button 
                  onClick={handleClearKey}
                  className="bg-red-950/40 border border-neon-danger/40 hover:border-neon-danger text-neon-danger font-sans text-xs font-bold px-4 py-2 rounded-lg transition-all duration-300 shrink-0"
                >
                  ELIMINAR CLAVE
                </button>
              ) : (
                <button 
                  onClick={handleSaveKey}
                  disabled={!apiKey.trim()}
                  className="bg-ufs-secondary hover:bg-ufs-secondary/85 text-white font-sans text-xs font-bold px-4 py-2 rounded-lg transition-all duration-300 neon-border-cyan shrink-0 disabled:opacity-50"
                >
                  GUARDAR CLAVE
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              ⚠️ La clave se guarda de manera 100% segura en el almacenamiento local de su navegador (localStorage). Las peticiones se realizan de forma directa y cifrada a los servidores oficiales de Google Generative Language.
            </p>
          </div>

          {/* Gemini Vision Lab */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-ufs-accent" />
              <span>Laboratorio de Visión Artificial (Auditoría Técnica)</span>
            </h3>

            {/* Selector de samples y carga */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Photo preview zone */}
              <div className="space-y-3">
                <div 
                  className={`h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-slate-950/30 overflow-hidden relative transition-all duration-300 ${
                    visionImgSelected ? "border-neon-success/40" : "border-cyber-border hover:border-slate-500"
                  }`}
                >
                  {visionImgSelected ? (
                    <img src={visionImgSelected} alt="Vista previa de auditoría" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Sin imagen cargada</span>
                      <span className="text-[9px] text-slate-500 mt-1">Seleccione un caso de prueba abajo</span>
                    </>
                  )}
                </div>

                {/* Preloads actions row */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Simuladores de campo (Costa Rica)</span>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => loadSampleImage("limpieza_profunda")}
                      className={`flex-1 text-[10px] font-bold p-1.5 rounded border transition-colors duration-300 ${
                        visionType === "limpieza_profunda" ? "bg-ufs-primary/20 border-ufs-accent text-ufs-accent" : "bg-slate-950/40 border-cyber-border text-slate-400"
                      }`}
                    >
                      Limpieza Quirófano
                    </button>
                    <button 
                      onClick={() => loadSampleImage("mantenimiento_preventivo")}
                      className={`flex-1 text-[10px] font-bold p-1.5 rounded border transition-colors duration-300 ${
                        visionType === "mantenimiento_preventivo" ? "bg-ufs-primary/20 border-ufs-accent text-ufs-accent" : "bg-slate-950/40 border-cyber-border text-slate-400"
                      }`}
                    >
                      Tablero Eléctrico
                    </button>
                  </div>
                </div>
              </div>

              {/* Action config panel */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">1. Seleccionar tipo de análisis</span>
                  <select 
                    value={visionType}
                    onChange={(e) => setVisionType(e.target.value)}
                    className="w-full bg-slate-950/50 border border-cyber-border rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer mt-1"
                  >
                    <option value="limpieza_profunda">Limpieza Profunda e Higienización</option>
                    <option value="mantenimiento_preventivo">Mantenimiento de Infraestructura / HVAC</option>
                    <option value="jardineria">Jardinería y Control de Malezas</option>
                  </select>

                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                    La inteligencia artificial auditará el cumplimiento técnico, identificará anomalías visuales e inspeccionará si el personal usó el EPP requerido.
                  </p>
                </div>

                <button 
                  onClick={runVisionAnalysis}
                  disabled={isVisionLoading || !visionImgSelected}
                  className="w-full bg-ufs-secondary hover:bg-ufs-secondary/85 disabled:bg-slate-900/60 disabled:border-cyber-border disabled:text-slate-600 text-white font-sans text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg neon-border-cyan mt-4"
                >
                  {isVisionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ANALIZANDO VISUALMENTE...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>AUDITAR FOTO CON GEMINI</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Visual diagnostic results */}
            {visionReport && (
              <div className="bg-slate-950/40 border border-cyber-border/80 rounded-lg p-5 mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-2 mb-2">
                  <span className="text-[10px] text-ufs-accent font-bold font-mono tracking-widest uppercase flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-ufs-accent" />
                    <span>✓ DIAGNÓSTICO TÉCNICO DE LA IA</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    visionReport.calidad === "excelente" ? "bg-emerald-950 text-neon-success border border-neon-success/30" : "bg-amber-950 text-neon-warning border border-neon-warning/30"
                  }`}>
                    CALIDAD: {visionReport.calidad}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">DESCRIPCIÓN OPERATIVA</span>
                    <p className="text-slate-200 mt-0.5">{visionReport.descripcion}</p>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">OBSERVACIONES DE SEGURIDAD (EPP)</span>
                    <p className="text-slate-300 mt-0.5 font-semibold">{visionReport.seguridad}</p>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">ACCIONES RECOMENDADAS</span>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400">
                      {visionReport.recomendaciones.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Column Right — High-tech HUD Chat Assistant */}
        <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl glass-panel p-5 flex flex-col justify-between h-[620px]">
          
          {/* Chat header */}
          <div>
            <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <Bot className="w-4.5 h-4.5 text-ufs-accent drop-shadow-[0_0_8px_rgba(0,163,224,0.6)]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Asistente Operativo UFS</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-neon-success animate-ping" />
            </div>

            {/* Chat conversation box */}
            <div className="space-y-4 h-[400px] overflow-y-auto pr-1">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                    msg.role === "user" 
                      ? "bg-ufs-primary/30 border border-ufs-accent/40 text-slate-200" 
                      : "bg-slate-950/40 border border-cyber-border text-slate-300"
                  }`}>
                    {msg.role === "assistant" && (
                      <span className="text-[8px] text-ufs-accent font-bold font-mono tracking-widest block mb-1">
                        SISTEMA COGNITIVO
                      </span>
                    )}
                    <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/40 border border-cyber-border p-3 rounded-lg flex items-center space-x-2">
                    <span className="w-2 h-2 bg-ufs-accent rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-ufs-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-ufs-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Form & Quick Questions */}
          <div className="space-y-3">
            {/* Quick selectors triggers */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setChatInput("¿Cuáles órdenes están en riesgo de SLA hoy?")}
                className="text-[9px] bg-slate-950/50 hover:bg-slate-950 border border-cyber-border hover:border-ufs-accent text-slate-400 hover:text-white px-2 py-1 rounded transition-colors duration-300 font-mono"
              >
                ¿Órdenes SLA en riesgo?
              </button>
              <button 
                onClick={() => setChatInput("Genera el reporte operacional semanal.")}
                className="text-[9px] bg-slate-950/50 hover:bg-slate-950 border border-cyber-border hover:border-ufs-accent text-slate-400 hover:text-white px-2 py-1 rounded transition-colors duration-300 font-mono"
              >
                ¿Reporte operacional?
              </button>
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Preguntar al asistente..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow bg-slate-950/50 border border-cyber-border/80 focus:border-ufs-accent focus:outline-none rounded-lg px-3.5 py-2 font-sans text-xs text-white placeholder-slate-500 transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 bg-ufs-secondary hover:bg-ufs-secondary/85 text-white rounded-lg transition-all duration-300 neon-border-cyan shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
