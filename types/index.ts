export interface UserProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'gerente' | 'supervisor' | 'operativo';
  phone?: string;
  zone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  tipo_inmueble: 'oficina' | 'hospital' | 'bodega' | 'comercio' | 'residencial' | 'industrial' | 'otro';
  direccion: string;
  zona: string;
  lat: number;
  lng: number;
  contacto_nombre?: string;
  contacto_telefono?: string;
  contacto_email?: string;
  contrato_inicio?: string;
  contrato_fin?: string;
  servicios_activos: string[];
  sla_horas: number;
  is_active: boolean;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export type OTPrioridad = 'baja' | 'media' | 'alta' | 'urgente';
export type OTEstado = 'pendiente' | 'asignada' | 'en_progreso' | 'en_revision' | 'completada' | 'cancelada';

export interface OrdenTrabajo {
  id: string;
  numero: string;
  cliente_id: string;
  cliente?: Cliente;
  tipo_servicio: string;
  prioridad: OTPrioridad;
  estado: OTEstado;
  titulo: string;
  descripcion?: string;
  supervisor_id?: string;
  supervisor?: UserProfile;
  operativo_id?: string;
  operativo?: UserProfile;
  fecha_programada?: string;
  fecha_inicio?: string;
  fecha_cierre?: string;
  sla_limite?: string;
  tiempo_real_minutos?: number;
  ubicacion_lat?: number;
  ubicacion_lng?: number;
  fotos_antes?: string[];
  fotos_despues?: string[];
  firma_cliente_url?: string;
  calificacion_cliente?: number;
  comentario_cliente?: string;
  observaciones_operativo?: string;
  reporte_ia?: string;
  costo_estimado?: number;
  costo_real?: number;
  created_at: string;
  updated_at: string;
}

export interface CheckinCampo {
  id: string;
  operativo_id: string;
  operativo?: UserProfile;
  orden_id?: string;
  cliente_id?: string;
  cliente?: Cliente;
  tipo: 'entrada' | 'salida';
  lat: number;
  lng: number;
  foto_url?: string;
  timestamp: string;
  notas?: string;
}

export interface Inventario {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'quimico' | 'herramienta' | 'equipo' | 'consumible' | 'epp' | 'otro';
  unidad: string;
  stock_actual: number;
  stock_minimo: number;
  ubicacion?: string;
  qr_code?: string;
  proveedor?: string;
  costo_unitario?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MovimientoInventario {
  id: string;
  inventario_id: string;
  inventario?: Inventario;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  referencia?: string;
  operativo_id?: string;
  operativo?: UserProfile;
  notas?: string;
  timestamp: string;
}

export interface Incidente {
  id: string;
  orden_id?: string;
  orden?: OrdenTrabajo;
  cliente_id: string;
  cliente?: Cliente;
  reportado_por: string;
  reporter?: UserProfile;
  tipo: 'accidente_personal' | 'dano_inmueble' | 'robo' | 'falla_equipo' | 'queja_cliente' | 'incidente_quimico' | 'caida' | 'otro';
  severidad: 'leve' | 'moderado' | 'grave' | 'critico';
  descripcion: string;
  descripcion_ia?: string;
  fotos?: string[];
  estado: 'reportado' | 'en_investigacion' | 'resuelto' | 'cerrado';
  acciones_tomadas?: string;
  lat?: number;
  lng?: number;
  timestamp: string;
  updated_at: string;
}

export interface Notificacion {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  url?: string;
  created_at: string;
}
