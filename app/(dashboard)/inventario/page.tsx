"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  ShieldAlert, 
  Layers, 
  QrCode, 
  CornerDownRight,
  TrendingDown,
  Volume2
} from "lucide-react";
import { MockDB } from "@/lib/mockDb";
import { Inventario } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function InventarioPage() {
  const [items, setItems] = useState<Inventario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Load from DB
  const loadInventory = () => {
    MockDB.initialize();
    setItems(MockDB.getInventario());
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Web Audio adjust sound
  const playAdjustBeep = (isAdd: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Adjust frequencies: high slide for addition, low slide for subtraction
      if (isAdd) {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15); // A3
      }
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (err) {
      console.warn(err);
    }
  };

  // Quick adjustment
  const handleAdjustStock = (id: string, qty: number, type: 'entrada' | 'salida') => {
    try {
      MockDB.updateInventarioStock(id, qty, type, `Ajuste manual rápido`, "prof-1");
      playAdjustBeep(type === 'entrada');
      loadInventory(); // Reload state
    } catch (err) {
      alert("Error al ajustar el inventario.");
    }
  };

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.ubicacion || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // KPI Calculations
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.stock_actual < item.stock_minimo).length;
  const totalAssetValue = items.reduce((acc, curr) => acc + (curr.stock_actual * (curr.costo_unitario || 0)), 0);

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-ufs-accent font-bold tracking-widest uppercase font-mono block">
            SUPERVISIÓN DE SUMINISTROS & INSUMOS
          </span>
          <h2 className="font-display font-black text-2xl text-white tracking-wider mt-1">
            INVENTARIO & BODEGA
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Control de equipos de facility management, insumos químicos concentrados y equipos de seguridad (EPP).
          </p>
        </div>

        <div className="flex items-center text-[10px] text-slate-500 font-bold font-mono bg-cyber-surface/30 px-3 py-1.5 rounded-lg border border-cyber-border">
          <Volume2 className="w-3.5 h-3.5 mr-1 text-ufs-accent" />
          <span>INVENTORY BEAT ACTIVE</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-ufs-accent">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Artículos Únicos</span>
            <span className="font-display font-black text-xl text-white">{totalItems} SKU en bodega</span>
          </div>
        </div>

        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-neon-danger animate-pulse">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Críticos Bajo Mínimo</span>
            <span className={`font-display font-black text-xl ${lowStockItems > 0 ? "text-neon-danger" : "text-neon-success"}`}>
              {lowStockItems} Alertas activas
            </span>
          </div>
        </div>

        <div className="bg-cyber-surface/30 border border-cyber-border/60 p-4 rounded-xl flex items-center space-x-4 glass-panel">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyber-border text-neon-success">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Valor Total Suministros</span>
            <span className="font-display font-black text-xl text-neon-success">{formatCurrency(totalAssetValue)}</span>
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
            placeholder="Buscar por código, nombre o estante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/40 hover:bg-slate-950/60 focus:bg-slate-950 border border-cyber-border/80 hover:border-cyber-border focus:border-ufs-accent focus:outline-none rounded-lg pl-9 pr-4 py-2 font-sans text-xs font-semibold text-slate-200 placeholder-slate-500 transition-all duration-300"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center space-x-2 bg-slate-950/40 border border-cyber-border/80 rounded-lg px-3 py-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="todos" className="bg-cyber-surface">Categoría: Todas</option>
            <option value="quimico" className="bg-cyber-surface">Químicos</option>
            <option value="equipo" className="bg-cyber-surface">Equipos</option>
            <option value="epp" className="bg-cyber-surface">EPP (Seguridad)</option>
            <option value="consumible" className="bg-cyber-surface">Consumibles</option>
            <option value="herramienta" className="bg-cyber-surface">Herramientas</option>
          </select>
        </div>
      </div>

      {/* Main Grid/Table */}
      <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-200">
            <thead>
              <tr className="border-b border-cyber-border bg-slate-950/30 text-slate-500 text-[10px] uppercase font-bold tracking-wider select-none">
                <th className="py-3.5 px-6">Código</th>
                <th>Descripción / Artículo</th>
                <th>Categoría</th>
                <th>Ubicación Bodega</th>
                <th>Nivel de Stock</th>
                <th>Mínimo</th>
                <th>Costo Unit.</th>
                <th className="text-center px-6">Ajuste de Stock Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 font-medium">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isLow = item.stock_actual < item.stock_minimo;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-800/10 transition-colors duration-200 group ${
                        isLow ? "bg-red-950/5 border-l-2 border-neon-danger" : "border-l-2 border-transparent"
                      }`}
                    >
                      {/* Code */}
                      <td className="py-4 px-6 font-mono font-black text-ufs-accent">
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-3.5 h-3.5 text-slate-500 opacity-60" />
                          <span>{item.codigo}</span>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="font-semibold text-white">
                        <div>
                          <span>{item.nombre}</span>
                          <span className="text-[9px] text-slate-500 block font-normal">Unidad: {item.unidad}</span>
                        </div>
                      </td>

                      {/* Category badge */}
                      <td className="uppercase font-mono text-[9px] text-slate-400">
                        {item.categoria}
                      </td>

                      {/* Location */}
                      <td className="text-slate-400 font-mono text-[10.5px]">
                        <div className="flex items-center space-x-1">
                          <CornerDownRight className="w-3 h-3 text-slate-600" />
                          <span>{item.ubicacion || "Bodega General"}</span>
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td>
                        <div className="flex items-center space-x-2.5">
                          <span className={`font-display font-black text-sm ${
                            isLow ? "text-neon-danger animate-pulse" : "text-white"
                          }`}>
                            {item.stock_actual}
                          </span>

                          {/* Graphical progress bar */}
                          <div className="w-16 h-1.5 bg-slate-950 rounded overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full rounded ${
                                isLow ? "bg-neon-danger" : "bg-neon-success"
                              }`}
                              style={{ width: `${Math.min((item.stock_actual / (item.stock_minimo * 2.5)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Min stock limit */}
                      <td className="text-slate-500 font-mono">{item.stock_minimo}</td>

                      {/* Unit Cost */}
                      <td className="text-slate-300 font-mono">
                        {formatCurrency(item.costo_unitario)}
                      </td>

                      {/* Fast Adjustment buttons */}
                      <td className="text-center px-6">
                        <div className="inline-flex items-center space-x-2.5">
                          
                          {/* Decrease */}
                          <button
                            onClick={() => handleAdjustStock(item.id, 1, 'salida')}
                            className="p-1 rounded bg-slate-950/60 border border-cyber-border hover:border-neon-danger hover:bg-red-950/15 text-slate-500 hover:text-neon-danger transition-all duration-200"
                            title="Despachar/Consumir 1 unidad"
                            disabled={item.stock_actual === 0}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] text-slate-600 font-mono uppercase font-bold tracking-wider">Ajustar</span>

                          {/* Increase */}
                          <button
                            onClick={() => handleAdjustStock(item.id, 1, 'entrada')}
                            className="p-1 rounded bg-slate-950/60 border border-cyber-border hover:border-neon-success hover:bg-green-950/10 text-slate-500 hover:text-neon-success transition-all duration-200"
                            title="Suministrar/Abastecer 1 unidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-bold uppercase tracking-wider">
                    Ningún suministro coincide con el parámetro ingresado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Count footer */}
        <div className="bg-slate-950/30 border-t border-cyber-border px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredItems.length} de {totalItems} SKUs en inventario operacional</span>
          <span className="font-mono tracking-widest text-[10px]">UFS SUPPLY OS V1</span>
        </div>

      </div>

      {/* Warning EPP compliance banner */}
      <div className="bg-ufs-primary/10 border border-cyber-border/80 rounded-xl p-4 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-ufs-accent shrink-0 mt-0.5" />
        <div className="text-xs leading-normal">
          <strong className="text-white block mb-0.5">Control de Caducidad y Suministros</strong>
          <span className="text-slate-400">
            El despacho de químicos industriales concentrados requiere el registro obligatorio en la bitácora móvil de campo de United Facility Services Costa Rica. Al realizar cualquier egreso físico de bodega, asegúrese de verificar el equipo de protección personal (EPP) asignado en la orden de trabajo.
          </span>
        </div>
      </div>

    </div>
  );
}
