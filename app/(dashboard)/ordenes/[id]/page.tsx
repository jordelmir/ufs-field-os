"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Building, 
  User, 
  Clock, 
  ShieldAlert, 
  FileDown, 
  Sparkles,
  Camera,
  Signature,
  CheckSquare,
  Play
} from "lucide-react";
import { PrioridadBadge } from "@/components/shared/PrioridadBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatMinutes } from "@/lib/utils";
import { OTEstado, OTPrioridad } from "@/types";
import { UFSReportDocument } from "@/lib/pdf-generator";

// Programmatic Web Audio Synthesizer to trigger high-tech chimes without external asset dependencies!
function playHudChime(frequency: number = 880, type: OscillatorType = "sine", duration: number = 0.15) {
  if (typeof window === "undefined") return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    // Futuristic envelope curve
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.error("Audio Synthesis error: ", err);
  }
}

// Speaks messages aloud using browser synthesized voice
function speakSynthesizedVoice(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel(); // Mute pending queues
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-CR";
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    
    // Check voice support
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("TTS Speech Synthesis failed: ", err);
  }
}

export default function DetalleOrdenPage() {
  const router = useRouter();
  
  const [ot, setOt] = useState({
    id: "1",
    numero: "OT-2026-0104",
    cliente: {
      nombre: "Genpact Costa Rica",
      tipo_inmueble: "oficina",
      direccion: "Zona Franca Cariari, Edificio C, Piso 3, Heredia",
      zona: "Heredia",
      sla_horas: 2
    },
    tipo_servicio: "Limpieza General y Preventivo",
    prioridad: "urgente" as OTPrioridad,
    estado: "en_progreso" as OTEstado,
    titulo: "Sanitización e Higienización del Piso 3",
    descripcion: "Desinfección profunda de superficies de contacto de alto tránsito (escritorios, perillas, teclados, pasillos) con amonio cuaternario de quinta generación. Limpieza y cambio preventivo de filtros de climatización HVAC en área de cubículos A.",
    tecnico: "Mario Vargas",
    supervisor: "Lic. Jocksan Mora",
    fecha_programada: "27/05/2026",
    fecha_inicio: "27/05/2026 08:15 AM",
    tiempo_real: 65,
    reporte_ia: "",
    isRisk: true,
  });

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Desinfección profunda de superficies de contacto", checked: true },
    { id: 2, text: "Mantenimiento y limpieza de filtros de aire HVAC", checked: true },
    { id: 3, text: "Inspección de luminarias y cambio de focos", checked: false },
    { id: 4, text: "Sanitización de pasillos y recepciones", checked: false }
  ]);

  const [hasPhotoBefore, setHasPhotoBefore] = useState(true);
  const [hasPhotoAfter, setHasPhotoAfter] = useState(false);
  const [clientSigned, setClientSigned] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Digital signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#00A3E0"; // Glowing sky cyan signature color
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    // Detect click position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    playHudChime(950, "sine", 0.05); // Subtle tactile slide audio
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setClientSigned(false);
    setSignatureUrl("");
    playHudChime(220, "triangle", 0.25); // Cleared sound
  };

  const saveCanvasSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Generate base64
    const dataUrl = canvas.toDataURL("image/png");
    setSignatureUrl(dataUrl);
    setClientSigned(true);
    
    // Tactile positive sound + vocal confirmation
    playHudChime(1200, "sine", 0.2);
    speakSynthesizedVoice("Firma de conformidad del cliente capturada y validada.");
  };

  // Toggle checklist tasks
  const handleCheckTask = (id: number, currentChecked: boolean) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    
    if (!currentChecked) {
      // Check sound (tactile modern chime: two quick clean synth tones!)
      playHudChime(660, "sine", 0.08);
      setTimeout(() => playHudChime(880, "sine", 0.12), 60);
      
      speakSynthesizedVoice(`Tarea número ${id} completada.`);
    } else {
      playHudChime(330, "triangle", 0.1);
    }
  };

  // Triggers Gemini AI Quality diagnostic
  const triggerAiAudit = () => {
    if (!hasPhotoAfter) {
      playHudChime(220, "sawtooth", 0.2);
      speakSynthesizedVoice("Error. Registre primero la foto de trabajo finalizado para realizar la auditoría con inteligencia artificial.");
      alert("Es necesario registrar la foto del trabajo finalizado (DESPUÉS) antes de auditar con Gemini.");
      return;
    }

    playHudChime(523, "sine", 0.25);
    speakSynthesizedVoice("Iniciando auditoría visual con inteligencia artificial Google Gemini.");
    setIsClosing(true);

    setTimeout(() => {
      setOt(prev => ({
        ...prev,
        reporte_ia: "El servicio fue auditado visualmente por la red de IA corporativa de UFS. Se concluye un nivel de calidad EXCELENTE con cobertura de sanitización completa en superficies e instrumental. Uso de EPP verificado y conforme a las normas de seguridad ocupacional."
      }));
      setIsClosing(false);
      playHudChime(1567, "sine", 0.3);
      speakSynthesizedVoice("Auditoría de inteligencia artificial completada. Reporte técnico generado satisfactoriamente.");
    }, 2000);
  };

  const handleCloseOrder = () => {
    setOt(prev => ({ ...prev, estado: "completada" as OTEstado }));
    
    // Final positive chimes: 3 harmonic glowing notes!
    playHudChime(523, "sine", 0.1);
    setTimeout(() => playHudChime(659, "sine", 0.1), 100);
    setTimeout(() => playHudChime(784, "sine", 0.1), 200);
    setTimeout(() => playHudChime(1046, "sine", 0.35), 300);

    speakSynthesizedVoice("Orden de trabajo número ciento cuatro cerrada exitosamente en base de datos. Buen trabajo.");
  };

  const triggerDownloadPdf = () => {
    playHudChime(880, "sine", 0.15);
    speakSynthesizedVoice("Generando y exportando reporte de servicio en formato PDF.");
    alert("Reporte PDF generado de forma local. En la demo real, esto descarga el PDF corporativo.");
  };

  const allTasksCompleted = checklist.every(item => item.checked);

  return (
    <div className="space-y-6 select-none font-medium text-slate-300">
      
      {/* Header breadcrumb bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border/40 pb-5">
        <div className="flex items-center space-x-3">
          <Link 
            href="/ordenes" 
            className="p-2 bg-slate-950/40 border border-cyber-border hover:border-ufs-accent rounded-lg text-slate-400 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-mono font-black text-sm text-ufs-accent">{ot.numero}</span>
              <PrioridadBadge prioridad={ot.prioridad} />
              <StatusBadge estado={ot.estado} />
            </div>
            <h2 className="font-display font-black text-xl text-white tracking-wider mt-1">
              {ot.titulo}
            </h2>
          </div>
        </div>

        {/* Action button header (PDF) */}
        {ot.estado === "completada" && (
          <button 
            onClick={triggerDownloadPdf}
            className="bg-slate-950/60 border border-cyber-border hover:border-ufs-accent hover:bg-ufs-primary/10 text-slate-300 hover:text-white font-sans text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
          >
            <FileDown className="w-4 h-4" />
            <span>EXPORTAR REPORTE PDF</span>
          </button>
        )}
      </div>

      {/* Grid: 2 columns (70% info and checkin/checklists, 30% AI Audit and Sign) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (70%) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Metadata site details card */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2">
              <Building className="w-4 h-4 text-ufs-accent" />
              <span>Detalles del Contrato & Ubicación</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">CLIENTE ADJUDICADO</span>
                <span className="text-white font-semibold text-sm block mt-0.5">{ot.cliente.nombre}</span>
                <span className="text-slate-400 block mt-0.5">{ot.cliente.direccion}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">SERVICIO CONTRATADO</span>
                <span className="text-white font-semibold text-sm block mt-0.5">{ot.tipo_servicio}</span>
                <span className="text-slate-400 block mt-0.5">Zona de Cobertura: {ot.cliente.zona}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">SUPERVISOR DE ÁREA</span>
                <span className="text-slate-200 font-semibold block mt-0.5">{ot.supervisor}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">TÉCNICO ESPECIALISTA</span>
                <span className="text-slate-200 font-semibold block mt-0.5">{ot.tecnico}</span>
              </div>
            </div>
            
            <div className="border-t border-cyber-border/40 pt-4 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">DESCRIPCIÓN DEL REQUERIMIENTO</span>
              <p className="text-slate-300 leading-relaxed mt-1">{ot.descripcion}</p>
            </div>
          </div>

          {/* Timeline & SLA countdown tracking */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-neon-success" />
              <span>Cronología & Registro de Tiempos (SLA)</span>
            </h3>

            <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3 bg-slate-950/40 border border-cyber-border px-4 py-2.5 rounded-lg flex-1">
                <div className="w-2.5 h-2.5 bg-neon-success rounded-full animate-pulse" />
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">HORA INICIO</span>
                  <span className="text-white font-semibold">{ot.fecha_inicio}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950/40 border border-cyber-border px-4 py-2.5 rounded-lg flex-1">
                <div className="w-2.5 h-2.5 bg-ufs-accent rounded-full" />
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">DURACIÓN REAL</span>
                  <span className="text-white font-semibold">{formatMinutes(ot.tiempo_real)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950/40 border border-cyber-border px-4 py-2.5 rounded-lg flex-1">
                <div className="w-2.5 h-2.5 bg-neon-danger rounded-full animate-ping" />
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">TIEMPO LÍMITE ANS</span>
                  <span className="text-neon-danger font-bold">25 min restantes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive tasks checklists */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-ufs-accent" />
                <span>Lista de Verificación Operativa</span>
              </h3>
              <span className="font-mono text-xs font-bold text-neon-success">
                {checklist.filter(c => c.checked).length} / {checklist.length} COMPLETADOS
              </span>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleCheckTask(item.id, item.checked)}
                  className={`flex items-center space-x-3.5 p-3 rounded-lg border cursor-pointer select-none transition-all duration-300 ${
                    item.checked 
                      ? "bg-slate-950/30 border-neon-success/35 text-slate-400" 
                      : "bg-slate-950/10 border-cyber-border/80 text-slate-200 hover:border-slate-600 hover:bg-slate-800/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="w-4 h-4 rounded border-cyber-border text-neon-success focus:ring-neon-success"
                  />
                  <span className={`text-xs ${item.checked ? "line-through text-slate-500" : "font-semibold"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (30%) — Audit & Sign */}
        <div className="space-y-6">
          
          {/* Photo uploads validation box */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-ufs-accent" />
              <span>Evidencia Fotográfica</span>
            </h3>

            <div className="space-y-4">
              {/* Photo before */}
              <div className="relative group overflow-hidden rounded-lg border border-neon-success/30">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300&auto=format&fit=crop" 
                  alt="Foto antes"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] text-white font-bold tracking-wider font-mono">FOTO INICIAL (ANTES)</span>
                </div>
                <div className="absolute top-2 left-2 bg-emerald-950/80 border border-neon-success/60 text-neon-success font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                  ANEXO ANTES
                </div>
              </div>

              {/* Photo after */}
              <div 
                onClick={() => {
                  setHasPhotoAfter(true);
                  playHudChime(880, "sine", 0.15);
                  speakSynthesizedVoice("Foto de trabajo finalizado capturada correctamente.");
                }}
                className={`relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                  hasPhotoAfter ? "border-neon-success/30 h-32" : "border-dashed border-cyber-border hover:border-slate-500 h-32 flex flex-col items-center justify-center bg-slate-950/30"
                }`}
              >
                {hasPhotoAfter ? (
                  <>
                    <img 
                      src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=300&auto=format&fit=crop" 
                      alt="Foto despues"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-950/80 border border-neon-success/60 text-neon-success font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                      ANEXO DESPUÉS
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-slate-500 mb-2 group-hover:text-slate-300" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Capturar Después</span>
                    <span className="text-[9px] text-slate-500 mt-1">Haga clic para simular cámara</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Gemini IA Quality Audit Console */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-ufs-accent" />
              <span>Auditoría de Calidad Gemini</span>
            </h3>

            {ot.reporte_ia ? (
              <div className="bg-slate-950/40 border border-cyber-border p-3.5 rounded-lg text-xs leading-relaxed">
                <span className="text-[9px] text-neon-success font-bold font-mono tracking-widest uppercase block mb-1">
                  ✓ CALIDAD APROBADA (EXCELENTE)
                </span>
                <p className="text-slate-300 font-medium italic">
                  "{ot.reporte_ia}"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-400 text-xs leading-relaxed">
                  Utilice la red neuronal Gemini para auditar el anexo fotográfico final. El modelo extraerá detalles de limpieza y evaluará el uso de EPP de forma autónoma.
                </p>
                
                <button 
                  onClick={triggerAiAudit}
                  disabled={isClosing}
                  className="w-full bg-ufs-primary hover:bg-ufs-primary/85 border border-ufs-accent/40 text-ufs-accent py-2 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  {isClosing ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-ufs-accent border-t-transparent rounded-full animate-spin" />
                      <span>ANALIZANDO IMAGEN...</span>
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>AUDITAR CON GEMINI IA</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Client conformance digital signature pad */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-cyber-border pb-2.5 flex items-center space-x-2">
              <Signature className="w-4 h-4 text-ufs-accent" />
              <span>Firma Digital de Conformidad</span>
            </h3>

            {clientSigned ? (
              <div className="space-y-3">
                <div className="bg-slate-950/50 border border-neon-success/35 rounded-lg p-2 flex justify-center items-center h-24">
                  {signatureUrl ? (
                    <img src={signatureUrl} alt="Firma digital" className="max-h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,163,224,0.35)]" />
                  ) : (
                    <span className="text-[10px] text-neon-success font-bold">🖊️ FIRMA BIOMÉTRICA CONFORME</span>
                  )}
                </div>
                <button 
                  onClick={clearCanvas}
                  className="w-full text-slate-500 hover:text-white hover:underline text-[10px] font-mono tracking-widest text-center"
                >
                  BORRAR Y VOLVER A FIRMAR
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* HTML5 Canvas Drawing space */}
                <div className="bg-slate-950/60 rounded-lg border border-cyber-border/80 overflow-hidden relative">
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={100}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full cursor-crosshair h-[100px]"
                  />
                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-600 font-mono tracking-widest pointer-events-none">
                    ÁREA DE FIRMA
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={clearCanvas}
                    className="flex-1 bg-slate-950/40 border border-cyber-border hover:border-slate-700 text-slate-400 py-1.5 rounded text-[10px] font-bold"
                  >
                    LIMPIAR
                  </button>
                  <button 
                    onClick={saveCanvasSignature}
                    className="flex-1 bg-ufs-primary hover:bg-ufs-primary/80 border border-ufs-accent/40 text-ufs-accent py-1.5 rounded text-[10px] font-bold"
                  >
                    REGISTRAR FIRMA
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Closure triggering button */}
          {ot.estado === "en_progreso" && (
            <button
              onClick={handleCloseOrder}
              disabled={!allTasksCompleted || !hasPhotoAfter || !clientSigned || !ot.reporte_ia}
              className="w-full bg-ufs-secondary hover:bg-ufs-secondary/85 disabled:bg-slate-900/60 disabled:border-cyber-border disabled:text-slate-600 text-white py-3.5 rounded-xl font-sans text-xs font-black tracking-widest shadow-xl flex items-center justify-center space-x-2 transition-all duration-300 neon-border-cyan border border-transparent"
            >
              <CheckSquare className="w-4 h-4" />
              <span>CERRAR ÓRDEN DE TRABAJO</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
