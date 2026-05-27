"use client";

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  KeyRound, 
  Database, 
  Clock, 
  Save, 
  Volume2, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  User
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { getLocalGeminiKey, saveLocalGeminiKey } from "@/lib/gemini";
import canvasConfetti from "canvas-confetti";

export default function ConfiguracionPage() {
  // Key state
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);

  // SLA States (Simulated configuration)
  const [slaUrgente, setSlaUrgente] = useState(1);
  const [slaAlta, setSlaAlta] = useState(4);
  const [slaMedia, setSlaMedia] = useState(12);
  const [slaBaja, setSlaBaja] = useState(24);

  // Load configuration
  useEffect(() => {
    MockDB.initialize();
    
    // API key loading
    const key = getLocalGeminiKey();
    setApiKey(key);
    if (key) setIsKeySaved(true);

    // SLA configuration loading (from local storage if exist)
    if (typeof window !== "undefined") {
      setSlaUrgente(Number(localStorage.getItem("ufs_sla_urgente") || "1"));
      setSlaAlta(Number(localStorage.getItem("ufs_sla_alta") || "4"));
      setSlaMedia(Number(localStorage.getItem("ufs_sla_media") || "12"));
      setSlaBaja(Number(localStorage.getItem("ufs_sla_baja") || "24"));
    }
  }, []);

  // Web Audio Synth for configuration confirmations
  const playConfigChime = (isReset: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      
      if (isReset) {
        // Dramatic reset chime
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);    // A4
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.2); // C#5
      } else {
        // Soft save click
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      }
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.warn(err);
    }
  };

  // Save API Key
  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalGeminiKey(apiKey);
    setIsKeySaved(!!apiKey);
    playConfigChime(false);
    
    // Confetti effect
    canvasConfetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#003087', '#0056D2', '#00A3E0', '#00ff87']
    });
  };

  // Save SLA Config
  const handleSaveSLA = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("ufs_sla_urgente", String(slaUrgente));
      localStorage.setItem("ufs_sla_alta", String(slaAlta));
      localStorage.setItem("ufs_sla_media", String(slaMedia));
      localStorage.setItem("ufs_sla_baja", String(slaBaja));
    }
    playConfigChime(false);
    alert("Configuración de SLA guardada correctamente.");
  };

  // Clear simulated database
  const handleResetDatabase = () => {
    if (confirm("¿Está seguro de que desea restablecer la base de datos de simulación? Esto borrará todas las órdenes creadas, check-ins y reportes guardados en el navegador.")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ufs_db_initialized");
        localStorage.removeItem("ufs_profiles");
        localStorage.removeItem("ufs_clientes");
        localStorage.removeItem("ufs_inventario");
        localStorage.removeItem("ufs_ordenes");
        localStorage.removeItem("ufs_incidentes");
        localStorage.removeItem("ufs_checkins");
        localStorage.removeItem("ufs_notificaciones");
        
        // Reinitialize
        MockDB.initialize();
        
        playConfigChime(true);
        
        // Huge reset confetti burst
        canvasConfetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00ff87', '#00A3E0', '#0056D2']
        });

        alert("Base de datos de simulación restablecida con éxito.");
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            CONSOLA DE ADMINISTRACIÓN DEL NODO
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            CONFIGURACIÓN GENERAL
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gestione las llaves de acceso de IA (Gemini), los parámetros operacionales y las variables del simulador.
          </p>
        </div>

        <div className="flex items-center text-[10px] text-slate-500 font-bold font-mono bg-cyber-surface/30 px-3 py-1.5 rounded-lg border border-cyber-border">
          <Volume2 className="w-3.5 h-3.5 mr-1 text-ufs-accent" />
          <span>CONFIG AUDIO FEEDBACK ON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: API Key and Reset */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Gemini API Key BYOK Card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border/60 pb-2">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-ufs-accent" />
                <span>Llave Gemini AI (BYOK)</span>
              </h3>
              <span className={`text-[8.5px] font-bold uppercase px-2 py-0.5 rounded border ${
                isKeySaved 
                  ? "bg-green-950/20 text-neon-success border-neon-success/20" 
                  : "bg-red-950/15 text-neon-danger border-neon-danger/20 animate-pulse"
              }`}>
                {isKeySaved ? "CONECTADO" : "FALTA API KEY"}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Ingrese su API Key personal de Google Gemini para habilitar el motor generativo en los módulos de visión (auditoría fotográfica de órdenes e incidentes) y generación de reportes gerenciales de texto.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg pl-4 pr-10 py-2.5 font-mono text-xs font-bold text-slate-200 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10.5px] text-slate-500 leading-normal font-mono max-w-[280px]">
                  La clave se almacena localmente en su navegador y nunca se envía a servidores externos que no sean el endpoint oficial de Google.
                </span>
                
                <button
                  type="submit"
                  className="bg-ufs-secondary hover:bg-ufs-secondary/85 text-white font-sans text-[10px] font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all duration-300 shadow-lg neon-border-cyan shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>GUARDAR CLAVE</span>
                </button>
              </div>
            </form>
          </div>

          {/* Database management Card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border/60 pb-2 flex items-center space-x-2">
              <Database className="w-4 h-4 text-neon-warning" />
              <span>Base de Datos Local (Simulación)</span>
            </h3>

            <p className="text-slate-400 text-xs leading-relaxed">
              El sistema operativo de campo corre sobre un motor de base de datos simulado persistente en el navegador para propósitos de evaluación. Puede borrar los datos y reiniciar el entorno operacional a su estado de fábrica en cualquier momento.
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[10.5px] text-slate-500 font-mono">
                PERSISTENCIA: localStorage activa
              </div>

              <button
                type="button"
                onClick={handleResetDatabase}
                className="bg-red-950/20 hover:bg-red-950/40 border border-neon-danger/40 hover:border-neon-danger text-neon-danger font-sans text-[10.5px] font-bold px-4 py-2.5 rounded-lg transition-all duration-300 shadow-md uppercase tracking-wider shrink-0"
              >
                RESTABLECER BASE DE DATOS
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Profile and SLA configurator */}
        <div className="space-y-6">
          
          {/* Active profile card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border/60 pb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-ufs-accent" />
              <span>Perfil Evaluador</span>
            </h3>

            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-ufs-primary to-ufs-accent flex items-center justify-center font-display font-black text-xs text-white border border-ufs-accent/30 shadow-[0_0_10px_rgba(0,163,224,0.3)]">
                JM
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Jocksan Mora</span>
                <span className="text-[9.5px] text-ufs-accent font-semibold tracking-wider uppercase">Technical Lead</span>
                <span className="text-[8.5px] text-slate-500 font-mono mt-0.5">Entidad: Genpact CR Evaluador</span>
              </div>
            </div>
          </div>

          {/* SLA configurations Card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-cyber-border/60 pb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-ufs-accent" />
              <span>Parámetros SLA (Horas)</span>
            </h3>

            <form onSubmit={handleSaveSLA} className="space-y-3.5 text-xs font-medium">
              
              {/* Urgente */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">SLA Urgente</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={slaUrgente}
                  onChange={(e) => setSlaUrgente(Number(e.target.value))}
                  className="w-16 bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-center text-white rounded py-1 font-mono font-bold"
                />
              </div>

              {/* Alta */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">SLA Alta</span>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={slaAlta}
                  onChange={(e) => setSlaAlta(Number(e.target.value))}
                  className="w-16 bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-center text-white rounded py-1 font-mono font-bold"
                />
              </div>

              {/* Media */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">SLA Media</span>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={slaMedia}
                  onChange={(e) => setSlaMedia(Number(e.target.value))}
                  className="w-16 bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-center text-white rounded py-1 font-mono font-bold"
                />
              </div>

              {/* Baja */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">SLA Baja</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={slaBaja}
                  onChange={(e) => setSlaBaja(Number(e.target.value))}
                  className="w-16 bg-slate-950/60 border border-cyber-border focus:border-ufs-accent text-center text-white rounded py-1 font-mono font-bold"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-slate-950/40 hover:bg-slate-950 border border-cyber-border hover:border-ufs-accent text-slate-300 hover:text-white font-bold py-2 rounded text-[10px] uppercase tracking-wider transition-all duration-300 mt-2"
              >
                APLICAR UFS SLA TIEMPOS
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
