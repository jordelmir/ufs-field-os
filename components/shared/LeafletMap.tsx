"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  clientes: any[];
  checkins: any[];
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({ clientes, checkins, center = [9.955, -84.12], zoom = 12 }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Initialize map if not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView(center, zoom);
      
      // Use cartodb dark theme tiles for high-fidelity cyber aesthetic
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(center, zoom);
    }

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Define custom SVG neon icons
    const clientIcon = L.divIcon({
      className: "custom-client-marker",
      html: `<div class="w-6 h-6 rounded-full bg-[#00A3E0]/15 border border-[#00A3E0] flex items-center justify-center shadow-[0_0_12px_rgba(0,163,224,0.6)] animate-pulse">
               <div class="w-2 h-2 rounded-full bg-[#00A3E0]"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const checkinIcon = L.divIcon({
      className: "custom-checkin-marker",
      html: `<div class="w-6 h-6 rounded-full bg-[#00ff87]/15 border border-[#00ff87] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,135,0.6)]">
               <div class="w-2 h-2 rounded-full bg-[#00ff87]"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add Client markers
    clientes.forEach(c => {
      if (c.lat && c.lng) {
        const marker = L.marker([c.lat, c.lng], { icon: clientIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: var(--font-dm-sans), sans-serif; min-width: 180px;">
              <strong style="color: #ffffff; font-size: 11px; display: block; border-bottom: 1px solid #1e2d4d; padding-bottom: 3px; margin-bottom: 3px;">
                ${c.nombre}
              </strong>
              <p style="color: #94a3b8; font-size: 9.5px; margin: 2px 0;">${c.direccion}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 9px;">
                <span style="color: #00A3E0; font-weight: bold; text-transform: uppercase;">${c.tipo_inmueble}</span>
                <span style="color: #00ff87; font-weight: bold;">SLA: ${c.sla_horas}H</span>
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    // Add Checkin markers
    checkins.forEach(chk => {
      if (chk.lat && chk.lng) {
        const marker = L.marker([chk.lat, chk.lng], { icon: checkinIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: var(--font-dm-sans), sans-serif; min-width: 180px;">
              <strong style="color: #00ff87; font-size: 11px; display: block; border-bottom: 1px solid #1e2d4d; padding-bottom: 3px; margin-bottom: 3px;">
                Especialista en Campo
              </strong>
              <p style="color: #ffffff; font-size: 10px; margin: 2px 0;">${chk.operativo?.full_name || "Operador"}</p>
              <p style="color: #94a3b8; font-size: 9px; margin: 1px 0;">Tipo: ${chk.tipo === "entrada" ? "CHECK-IN" : "CHECK-OUT"}</p>
              <p style="color: #64748b; font-size: 8px; margin: 1px 0;">${new Date(chk.timestamp).toLocaleString("es-CR")}</p>
              ${chk.notas ? `<p style="color: #e2e8f0; font-size: 9px; font-style: italic; margin-top: 3px; border-left: 2px solid #00ff87; padding-left: 4px;">"${chk.notas}"</p>` : ""}
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    // Invalidate size to ensure proper rendering inside dashboard grids
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  }, [clientes, checkins, center, zoom]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full min-h-[480px] rounded-xl border border-cyber-border/80 shadow-2xl overflow-hidden" 
    />
  );
}
