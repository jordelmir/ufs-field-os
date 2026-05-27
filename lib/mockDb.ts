import { Cliente, OrdenTrabajo, Inventario, Incidente, UserProfile, CheckinCampo, Notificacion, MovimientoInventario } from "@/types";

// Base datasets of profiles in Costa Rica
export const mockProfiles: UserProfile[] = [
  {
    id: "prof-1",
    full_name: "Jocksan Mora",
    role: "supervisor",
    phone: "+506 8899-7711",
    zone: "Heredia",
    avatar_url: "",
    is_active: true,
    created_at: "2026-01-01T08:00:00Z",
    updated_at: "2026-01-01T08:00:00Z"
  },
  {
    id: "prof-2",
    full_name: "Mario Vargas",
    role: "operativo",
    phone: "+506 7011-2233",
    zone: "Alajuela",
    is_active: true,
    created_at: "2026-01-02T08:00:00Z",
    updated_at: "2026-01-02T08:00:00Z"
  },
  {
    id: "prof-3",
    full_name: "Jorge Del Valle",
    role: "operativo",
    phone: "+506 6022-3344",
    zone: "San José",
    is_active: true,
    created_at: "2026-01-03T08:00:00Z",
    updated_at: "2026-01-03T08:00:00Z"
  },
  {
    id: "prof-4",
    full_name: "Sofía Jiménez",
    role: "operativo",
    phone: "+506 8333-4455",
    zone: "Cartago",
    is_active: true,
    created_at: "2026-01-04T08:00:00Z",
    updated_at: "2026-01-04T08:00:00Z"
  },
  {
    id: "prof-5",
    full_name: "Carlos Mora",
    role: "operativo",
    phone: "+506 7144-5566",
    zone: "San José",
    is_active: true,
    created_at: "2026-01-05T08:00:00Z",
    updated_at: "2026-01-05T08:00:00Z"
  },
  {
    id: "prof-6",
    full_name: "Luis Cascante",
    role: "operativo",
    phone: "+506 6055-6677",
    zone: "Heredia",
    is_active: true,
    created_at: "2026-01-06T08:00:00Z",
    updated_at: "2026-01-06T08:00:00Z"
  },
  {
    id: "prof-7",
    full_name: "Andrés Calvo",
    role: "operativo",
    phone: "+506 8266-7788",
    zone: "Alajuela",
    is_active: true,
    created_at: "2026-01-07T08:00:00Z",
    updated_at: "2026-01-07T08:00:00Z"
  }
];

// Costa Rican corporate client accounts
export const mockClientes: Cliente[] = [
  {
    id: "cli-1",
    nombre: "Genpact Costa Rica",
    tipo_inmueble: "oficina",
    direccion: "Zona Franca América, Edificio D3, Real Cariari, Heredia",
    zona: "Heredia",
    lat: 9.9723,
    lng: -84.1539,
    contacto_nombre: "Ing. Roberto Chacón",
    contacto_telefono: "+506 4000-1122",
    contacto_email: "roberto.chacon@genpact.com",
    contrato_inicio: "2025-01-15",
    contrato_fin: "2027-01-15",
    servicios_activos: ["Limpieza General", "Sanitizado", "Mantenimiento Eléctrico"],
    sla_horas: 2,
    is_active: true,
    notas: "Facilidad de acceso restringida; requiere credenciales de Zona Franca.",
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2025-01-15T08:00:00Z"
  },
  {
    id: "cli-2",
    nombre: "Hospital CIMA Escazú",
    tipo_inmueble: "hospital",
    direccion: "Autopista Próspero Fernández, Escazú, San José",
    zona: "San José",
    lat: 9.9388,
    lng: -84.1458,
    contacto_nombre: "Dra. Carolina Méndez",
    contacto_telefono: "+506 2208-1000",
    contacto_email: "c.mendez@cima.co.cr",
    contrato_inicio: "2024-06-01",
    contrato_fin: "2026-06-01",
    servicios_activos: ["Desinfección Profunda", "Gestión de Desechos Bioinfecciosos"],
    sla_horas: 1,
    is_active: true,
    notas: "Protocolo estricto de EPP biológico completo en áreas clínicas.",
    created_at: "2024-06-01T08:00:00Z",
    updated_at: "2024-06-01T08:00:00Z"
  },
  {
    id: "cli-3",
    nombre: "Intel Costa Rica",
    tipo_inmueble: "industrial",
    direccion: "San Antonio de Belén, Heredia",
    zona: "Heredia",
    lat: 9.9839,
    lng: -84.1818,
    contacto_nombre: "Ing. Carlos Aguilar",
    contacto_telefono: "+506 2298-6000",
    contacto_email: "carlos.aguilar@intel.com",
    contrato_inicio: "2024-03-10",
    contrato_fin: "2026-03-10",
    servicios_activos: ["Mantenimiento HVAC", "Limpieza de Cuartos Limpios", "Control Plagas"],
    sla_horas: 3,
    is_active: true,
    notas: "Laboratorio de semiconductores requiere vestimenta antiestática certificada (ESD).",
    created_at: "2024-03-10T08:00:00Z",
    updated_at: "2024-03-10T08:00:00Z"
  },
  {
    id: "cli-4",
    nombre: "Banco Nacional — Sede Central",
    tipo_inmueble: "oficina",
    direccion: "Avenida 1, Calles 2 y 4, San José Centro",
    zona: "San José",
    lat: 9.9348,
    lng: -84.0792,
    contacto_nombre: "Lic. Minor Cordero",
    contacto_telefono: "+506 2212-2000",
    contacto_email: "mcordero@bncr.fi.cr",
    contrato_inicio: "2023-11-01",
    contrato_fin: "2026-11-01",
    servicios_activos: ["Limpieza General", "Control Plagas", "Jardinería Fachada"],
    sla_horas: 4,
    is_active: true,
    notas: "Ingreso de cuadrilla nocturna a tesorería debe ser acompañado por escolta de seguridad.",
    created_at: "2023-11-01T08:00:00Z",
    updated_at: "2023-11-01T08:00:00Z"
  },
  {
    id: "cli-5",
    nombre: "Multiplaza Escazú",
    tipo_inmueble: "comercio",
    direccion: "Frente a Autopista Próspero Fernández, Escazú",
    zona: "San José",
    lat: 9.9372,
    lng: -84.1481,
    contacto_nombre: "Diana Escalante",
    contacto_telefono: "+506 2201-5000",
    contacto_email: "descalante@grupo-roble.com",
    contrato_inicio: "2025-05-01",
    contrato_fin: "2027-05-01",
    servicios_activos: ["Jardinería Ornamental", "Limpieza de Áreas Comunes"],
    sla_horas: 3,
    is_active: true,
    notas: "Los trabajos en la zona de comidas (Food Court) solo se programan de 11:00 PM a 5:00 AM.",
    created_at: "2025-05-01T08:00:00Z",
    updated_at: "2025-05-01T08:00:00Z"
  },
  {
    id: "cli-6",
    nombre: "Zona Franca América",
    tipo_inmueble: "industrial",
    direccion: "San Francisco de Heredia, frente a Mall Las Flores",
    zona: "Heredia",
    lat: 9.9815,
    lng: -84.1462,
    contacto_nombre: "Ing. Marvin Solís",
    contacto_telefono: "+506 2209-3000",
    contacto_email: "msolis@zfa.com",
    contrato_inicio: "2024-08-01",
    contrato_fin: "2026-08-01",
    servicios_activos: ["Mantenimiento Correctivo", "Pintura Industrial", "Mantenimiento Electromecánico"],
    sla_horas: 2,
    is_active: true,
    notas: "Áreas perimetrales de alta tensión; obligatorio usar guantes dieléctricos.",
    created_at: "2024-08-01T08:00:00Z",
    updated_at: "2024-08-01T08:00:00Z"
  }
];

// Pre-configured inventory items
export const mockInventario: Inventario[] = [
  {
    id: "inv-1",
    codigo: "INV-CH-001",
    nombre: "Amonio Cuaternario 5ta Generación",
    categoria: "quimico",
    unidad: "Galón",
    stock_actual: 45,
    stock_minimo: 15,
    ubicacion: "Bodega Central — Estante A2",
    qr_code: "UFS-AMON-001",
    proveedor: "Químicos de Centroamérica S.A.",
    costo_unitario: 8500,
    is_active: true,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-05-20T14:30:00Z"
  },
  {
    id: "inv-2",
    codigo: "INV-CH-002",
    nombre: "Cloro Concentrado Industrial 12%",
    categoria: "quimico",
    unidad: "Galón",
    stock_actual: 8,
    stock_minimo: 10,
    ubicacion: "Bodega Central — Estante A3",
    qr_code: "UFS-CLOR-002",
    proveedor: "Químicos de Centroamérica S.A.",
    costo_unitario: 4200,
    is_active: true,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-05-25T08:15:00Z"
  },
  {
    id: "inv-3",
    codigo: "INV-EQ-010",
    nombre: "Aspiradora Industrial Húmedo/Seco Kärcher NT 30/1",
    categoria: "equipo",
    unidad: "Unidad",
    stock_actual: 12,
    stock_minimo: 4,
    ubicacion: "Bodega Equipos — Riel Central",
    qr_code: "UFS-ASP-KA-01",
    proveedor: "Kärcher Costa Rica",
    costo_unitario: 185000,
    is_active: true,
    created_at: "2026-02-05T09:00:00Z",
    updated_at: "2026-05-26T16:00:00Z"
  },
  {
    id: "inv-4",
    codigo: "INV-EP-050",
    nombre: "Guantes de Nitrilo Azules (Caja x 100 uds)",
    categoria: "epp",
    unidad: "Caja",
    stock_actual: 85,
    stock_minimo: 30,
    ubicacion: "Bodega EPP — Cajón B12",
    qr_code: "UFS-GUAN-NIT",
    proveedor: "Meditec S.A.",
    costo_unitario: 6500,
    is_active: true,
    created_at: "2026-01-15T11:00:00Z",
    updated_at: "2026-05-26T08:00:00Z"
  },
  {
    id: "inv-5",
    codigo: "INV-EP-051",
    nombre: "Mascarillas de Carbón Activo 3M 8247",
    categoria: "epp",
    unidad: "Caja",
    stock_actual: 4,
    stock_minimo: 8,
    ubicacion: "Bodega EPP — Cajón B13",
    qr_code: "UFS-MASC-3M-CARB",
    proveedor: "Distribuidora 3M Costa Rica",
    costo_unitario: 15400,
    is_active: true,
    created_at: "2026-01-15T11:05:00Z",
    updated_at: "2026-05-26T10:10:00Z"
  },
  {
    id: "inv-6",
    codigo: "INV-CO-200",
    nombre: "Paños de Microfibra Amarillos 40x40cm",
    categoria: "consumible",
    unidad: "Paquete x 10 uds",
    stock_actual: 62,
    stock_minimo: 20,
    ubicacion: "Bodega Consumibles — Caja C1",
    qr_code: "UFS-PAN-MIC-AM",
    proveedor: "Suministros Industriales Ticos",
    costo_unitario: 3500,
    is_active: true,
    created_at: "2026-01-20T08:00:00Z",
    updated_at: "2026-05-24T12:00:00Z"
  }
];

// Initial preloaded orders (synchronized with detail ids and SLA counters)
const initialOrders: OrdenTrabajo[] = [
  {
    id: "1",
    numero: "OT-2026-0104",
    cliente_id: "cli-1",
    tipo_servicio: "Limpieza General",
    prioridad: "urgente",
    estado: "en_progreso",
    titulo: "Limpieza profunda de salas de conferencias principales",
    descripcion: "Se requiere desinfección total de los pisos, pantallas y mobiliario tras evento ejecutivo regional corporativo. Prestar especial atención a la sala A1 y A3.",
    supervisor_id: "prof-1",
    operativo_id: "prof-2",
    fecha_programada: "2026-05-27T08:00:00Z",
    fecha_inicio: "2026-05-27T08:15:00Z",
    sla_limite: "2026-05-27T10:15:00Z",
    costo_estimado: 45000,
    created_at: "2026-05-27T08:00:00Z",
    updated_at: "2026-05-27T08:15:00Z"
  },
  {
    id: "2",
    numero: "OT-2026-0105",
    cliente_id: "cli-2",
    tipo_servicio: "Desinfección Profunda",
    prioridad: "urgente",
    estado: "pendiente",
    titulo: "Sanitización quirófano B por sospecha de contaminación externa",
    descripcion: "Urgente realizar protocolo de aspersión con amonio de quinta generación antes de la cirugía de las 11:00 AM.",
    supervisor_id: "prof-1",
    operativo_id: "prof-3",
    fecha_programada: "2026-05-27T09:30:00Z",
    sla_limite: "2026-05-27T10:30:00Z",
    costo_estimado: 95000,
    created_at: "2026-05-27T09:00:00Z",
    updated_at: "2026-05-27T09:00:00Z"
  },
  {
    id: "3",
    numero: "OT-2026-0106",
    cliente_id: "cli-3",
    tipo_servicio: "Mantenimiento HVAC",
    prioridad: "alta",
    estado: "asignada",
    titulo: "Inspección de extractores de aire de cuarto limpio F2",
    descripcion: "Monitorear presiones de filtros HEPA y evaluar vibraciones mecánicas reportadas por el equipo de ingeniería de Intel.",
    supervisor_id: "prof-1",
    operativo_id: "prof-4",
    fecha_programada: "2026-05-27T10:00:00Z",
    sla_limite: "2026-05-27T13:00:00Z",
    costo_estimado: 120000,
    created_at: "2026-05-27T08:30:00Z",
    updated_at: "2026-05-27T08:30:00Z"
  },
  {
    id: "4",
    numero: "OT-2026-0107",
    cliente_id: "cli-4",
    tipo_servicio: "Control Plagas",
    prioridad: "media",
    estado: "completada",
    titulo: "Termonebulización de sótano y parqueos centrales",
    descripcion: "Control de insectos rastreros y voladores en zonas de parqueo subterráneo y archivos pasivos del banco.",
    supervisor_id: "prof-1",
    operativo_id: "prof-5",
    fecha_programada: "2026-05-26T19:00:00Z",
    fecha_inicio: "2026-05-26T19:10:00Z",
    fecha_cierre: "2026-05-26T21:40:00Z",
    tiempo_real_minutos: 150,
    costo_estimado: 35000,
    costo_real: 35000,
    firma_cliente_url: "data:image/png;base64,mockSignatureSignature...",
    calificacion_cliente: 5,
    comentario_cliente: "Servicio impecable y rápido, sin perturbar el horario de guardias de seguridad.",
    observaciones_operativo: "Se gastó 1 galón de insecticida diluido. Sótano completamente nebulizado y ventilado.",
    reporte_ia: "El análisis visual certifica que las alcantarillas de desagüe de sótano fueron debidamente selladas con trampas de cebo sólido, minimizando un 95% el riesgo de vectores bacteriológicos.",
    created_at: "2026-05-26T18:00:00Z",
    updated_at: "2026-05-26T21:40:00Z"
  },
  {
    id: "5",
    numero: "OT-2026-0108",
    cliente_id: "cli-5",
    tipo_servicio: "Jardinería Ornamental",
    prioridad: "baja",
    estado: "completada",
    titulo: "Poda y rediseño de jardineras en pasillo oeste exterior",
    descripcion: "Mantenimiento periódico de plantas y colocación de abono orgánico en accesos peatonales externos.",
    supervisor_id: "prof-1",
    operativo_id: "prof-6",
    fecha_programada: "2026-05-25T08:00:00Z",
    fecha_inicio: "2026-05-25T08:05:00Z",
    fecha_cierre: "2026-05-25T11:30:00Z",
    tiempo_real_minutos: 205,
    costo_estimado: 28000,
    costo_real: 28000,
    firma_cliente_url: "data:image/png;base64,mockSignature...",
    calificacion_cliente: 4,
    observaciones_operativo: "Poda completada. Se plantaron 15 metros cuadrados de césped San Agustín.",
    created_at: "2026-05-25T07:30:00Z",
    updated_at: "2026-05-25T11:30:00Z"
  },
  {
    id: "6",
    numero: "OT-2026-0109",
    cliente_id: "cli-6",
    tipo_servicio: "Mantenimiento Correctivo",
    prioridad: "alta",
    estado: "en_revision",
    titulo: "Soldadura y anclaje de baranda en andén de carga 4",
    descripcion: "Se reportó fisura en el soporte de acero estructural. Urge reparar antes del ingreso del camión articulado de las 2:00 PM.",
    supervisor_id: "prof-1",
    operativo_id: "prof-7",
    fecha_programada: "2026-05-27T07:00:00Z",
    fecha_inicio: "2026-05-27T07:10:00Z",
    fecha_cierre: "2026-05-27T09:45:00Z",
    tiempo_real_minutos: 155,
    costo_estimado: 78000,
    costo_real: 82000,
    observaciones_operativo: "Baranda reforzada con soldadura 7018. Se aplicó pintura anticorrosiva de secado rápido. Requiere inspección final por vibración.",
    created_at: "2026-05-27T06:30:00Z",
    updated_at: "2026-05-27T09:45:00Z"
  }
];

// Preloaded Incident logs
const initialIncidents: Incidente[] = [
  {
    id: "inc-1",
    cliente_id: "cli-1",
    reportado_por: "prof-2",
    tipo: "incidente_quimico",
    severidad: "grave",
    descripcion: "Derrame menor de solvente dieléctrico durante limpieza del rack de transformadores. No hubo contacto dérmico.",
    descripcion_ia: "Se evidencia derrame accidental de desinfectante clorado concentrado en el pasillo de tránsito logístico, representando peligro de deslizamiento y emanación de gases. Mitigado con kit de derrames químicos.",
    estado: "resuelto",
    acciones_tomadas: "Se utilizó material absorbente, se neutralizó el área y se confinaron los residuos químicos en contenedores etiquetados.",
    lat: 9.9725,
    lng: -84.1537,
    timestamp: "2026-05-25T10:15:00Z",
    updated_at: "2026-05-25T11:00:00Z"
  },
  {
    id: "inc-2",
    cliente_id: "cli-3",
    reportado_por: "prof-4",
    tipo: "falla_equipo",
    severidad: "moderado",
    descripcion: "Presión fuera de rango detectada en la bomba neumática de succión en la planta de tratamiento de aguas Intel.",
    estado: "en_investigacion",
    acciones_tomadas: "Válvula de alivio abierta manualmente. Se espera llegada del proveedor técnico de la bomba.",
    lat: 9.9841,
    lng: -84.1820,
    timestamp: "2026-05-27T08:20:00Z",
    updated_at: "2026-05-27T08:30:00Z"
  }
];

// Operative check-ins in the field
const initialCheckins: CheckinCampo[] = [
  {
    id: "chk-1",
    operativo_id: "prof-2",
    cliente_id: "cli-1",
    tipo: "entrada",
    lat: 9.9723,
    lng: -84.1539,
    timestamp: "2026-05-27T08:15:00Z",
    notas: "Ingreso autorizado con EPP completo."
  },
  {
    id: "chk-2",
    operativo_id: "prof-7",
    cliente_id: "cli-6",
    tipo: "entrada",
    lat: 9.9815,
    lng: -84.1462,
    timestamp: "2026-05-27T07:10:00Z",
    notas: "Herramienta de soldadura ingresada sin contratiempos."
  },
  {
    id: "chk-3",
    operativo_id: "prof-7",
    cliente_id: "cli-6",
    tipo: "salida",
    lat: 9.9814,
    lng: -84.1461,
    timestamp: "2026-05-27T09:50:00Z",
    notas: "Orden de baranda finalizada, entrega con firma de supervisor local."
  }
];

// Helper to interact with DB state stored in browser LocalStorage
export class MockDB {
  private static initKey = "ufs_db_initialized";

  public static initialize() {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(this.initKey)) {
      localStorage.setItem("ufs_profiles", JSON.stringify(mockProfiles));
      localStorage.setItem("ufs_clientes", JSON.stringify(mockClientes));
      localStorage.setItem("ufs_inventario", JSON.stringify(mockInventario));
      localStorage.setItem("ufs_ordenes", JSON.stringify(initialOrders));
      localStorage.setItem("ufs_incidentes", JSON.stringify(initialIncidents));
      localStorage.setItem("ufs_checkins", JSON.stringify(initialCheckins));
      localStorage.setItem("ufs_notificaciones", JSON.stringify([
        {
          id: "not-1",
          usuario_id: "prof-1",
          tipo: "sla",
          titulo: "¡ALERTA DE SLA CRÍTICO!",
          mensaje: "La Orden OT-2026-0104 en Genpact tiene menos de 25 minutos para expirar.",
          leida: false,
          url: "/ordenes/1",
          created_at: new Date().toISOString()
        },
        {
          id: "not-2",
          usuario_id: "prof-1",
          tipo: "incidente",
          titulo: "Incidente en Intel Costa Rica",
          mensaje: "Sofía Jiménez reportó falla de equipo en planta de tratamiento de aguas.",
          leida: false,
          url: "/incidentes",
          created_at: new Date().toISOString()
        }
      ]));
      localStorage.setItem(this.initKey, "true");
    }
  }

  private static get<T>(key: string): T[] {
    this.initialize();
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  }

  private static save<T>(key: string, data: T[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // User Profiles
  public static getProfiles(): UserProfile[] {
    return this.get<UserProfile>("ufs_profiles");
  }

  // Clientes
  public static getClientes(): Cliente[] {
    return this.get<Cliente>("ufs_clientes");
  }

  public static getClienteById(id: string): Cliente | undefined {
    return this.getClientes().find(c => c.id === id);
  }

  // Ordenes de Trabajo
  public static getOrdenes(): OrdenTrabajo[] {
    const ordenes = this.get<OrdenTrabajo>("ufs_ordenes");
    const clientes = this.getClientes();
    const profiles = this.getProfiles();

    return ordenes.map(ot => ({
      ...ot,
      cliente: clientes.find(c => c.id === ot.cliente_id),
      supervisor: profiles.find(p => p.id === ot.supervisor_id),
      operativo: profiles.find(p => p.id === ot.operativo_id)
    }));
  }

  public static getOrdenById(id: string): OrdenTrabajo | undefined {
    return this.getOrdenes().find(o => o.id === id);
  }

  public static createOrden(ot: Partial<OrdenTrabajo>): OrdenTrabajo {
    const ordenes = this.get<OrdenTrabajo>("ufs_ordenes");
    const count = ordenes.length + 105;
    const num = `OT-2026-0${count}`;
    
    const newOT: OrdenTrabajo = {
      id: Math.random().toString(36).substring(2, 9),
      numero: num,
      cliente_id: ot.cliente_id || "",
      tipo_servicio: ot.tipo_servicio || "Limpieza General",
      prioridad: ot.prioridad || "media",
      estado: ot.estado || "pendiente",
      titulo: ot.titulo || "",
      descripcion: ot.descripcion || "",
      supervisor_id: ot.supervisor_id || "prof-1",
      operativo_id: ot.operativo_id || "prof-2",
      fecha_programada: ot.fecha_programada || new Date().toISOString(),
      costo_estimado: ot.costo_estimado || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    ordenes.unshift(newOT); // Put newest first
    this.save("ufs_ordenes", ordenes);
    return newOT;
  }

  public static updateOrden(id: string, updates: Partial<OrdenTrabajo>): OrdenTrabajo {
    const ordenes = this.get<OrdenTrabajo>("ufs_ordenes");
    const idx = ordenes.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Orden de trabajo no encontrada.");

    ordenes[idx] = {
      ...ordenes[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.save("ufs_ordenes", ordenes);
    return ordenes[idx];
  }

  // Inventario
  public static getInventario(): Inventario[] {
    return this.get<Inventario>("ufs_inventario");
  }

  public static updateInventarioStock(id: string, qty: number, type: 'entrada' | 'salida' | 'ajuste', ref?: string, opId?: string): Inventario {
    const items = this.get<Inventario>("ufs_inventario");
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error("Artículo no encontrado en inventario.");

    const item = items[idx];
    let newStock = item.stock_actual;
    if (type === "entrada") newStock += qty;
    if (type === "salida") newStock -= qty;
    if (type === "ajuste") newStock = qty;

    if (newStock < 0) newStock = 0;

    items[idx] = {
      ...item,
      stock_actual: newStock,
      updated_at: new Date().toISOString()
    };

    this.save("ufs_inventario", items);

    // Log movements
    const movements = this.get<MovimientoInventario>("ufs_movimientos");
    movements.unshift({
      id: Math.random().toString(36).substring(2, 9),
      inventario_id: id,
      tipo: type,
      cantidad: qty,
      referencia: ref,
      operativo_id: opId,
      timestamp: new Date().toISOString()
    });
    this.save("ufs_movimientos", movements);

    return items[idx];
  }

  public static getMovimientosInventario(): MovimientoInventario[] {
    const movs = this.get<MovimientoInventario>("ufs_movimientos");
    const items = this.getInventario();
    const profiles = this.getProfiles();

    return movs.map(m => ({
      ...m,
      inventario: items.find(i => i.id === m.inventario_id),
      operativo: profiles.find(p => p.id === m.operativo_id)
    }));
  }

  // Incidentes
  public static getIncidentes(): Incidente[] {
    const incs = this.get<Incidente>("ufs_incidentes");
    const clientes = this.getClientes();
    const profiles = this.getProfiles();

    return incs.map(i => ({
      ...i,
      cliente: clientes.find(c => c.id === i.cliente_id),
      reporter: profiles.find(p => p.id === i.reportado_por)
    }));
  }

  public static createIncidente(inc: Partial<Incidente>): Incidente {
    const incs = this.get<Incidente>("ufs_incidentes");
    const newInc: Incidente = {
      id: Math.random().toString(36).substring(2, 9),
      cliente_id: inc.cliente_id || "",
      reportado_por: inc.reportado_por || "prof-2",
      tipo: inc.tipo || "otro",
      severidad: inc.severidad || "leve",
      descripcion: inc.descripcion || "",
      descripcion_ia: inc.descripcion_ia || "",
      estado: inc.estado || "reportado",
      lat: inc.lat,
      lng: inc.lng,
      timestamp: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    incs.unshift(newInc);
    this.save("ufs_incidentes", incs);
    return newInc;
  }

  public static updateIncident(id: string, updates: Partial<Incidente>): Incidente {
    const incs = this.get<Incidente>("ufs_incidentes");
    const idx = incs.findIndex(i => i.id === id);
    if (idx === -1) throw new Error("Incidente no encontrado.");

    incs[idx] = {
      ...incs[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.save("ufs_incidentes", incs);
    return incs[idx];
  }

  // Checkins
  public static getCheckins(): CheckinCampo[] {
    const chks = this.get<CheckinCampo>("ufs_checkins");
    const profiles = this.getProfiles();
    const clientes = this.getClientes();

    return chks.map(c => ({
      ...c,
      operativo: profiles.find(p => p.id === c.operativo_id),
      cliente: clientes.find(cl => cl.id === c.cliente_id)
    }));
  }

  public static createCheckin(chk: Partial<CheckinCampo>): CheckinCampo {
    const chks = this.get<CheckinCampo>("ufs_checkins");
    const newChk: CheckinCampo = {
      id: Math.random().toString(36).substring(2, 9),
      operativo_id: chk.operativo_id || "prof-2",
      cliente_id: chk.cliente_id,
      tipo: chk.tipo || "entrada",
      lat: chk.lat || 9.9723,
      lng: chk.lng || -84.1539,
      timestamp: new Date().toISOString(),
      notas: chk.notas
    };

    chks.unshift(newChk);
    this.save("ufs_checkins", chks);
    return newChk;
  }

  // Notifications
  public static getNotifications(): Notificacion[] {
    return this.get<Notificacion>("ufs_notificaciones");
  }

  public static markNotificationsRead(): void {
    const nots = this.get<Notificacion>("ufs_notificaciones");
    nots.forEach(n => n.leida = true);
    this.save("ufs_notificaciones", nots);
  }
}
