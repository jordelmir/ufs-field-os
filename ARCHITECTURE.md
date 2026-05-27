# Arquitectura del Sistema — UFS Enterprise Field OS

Documentación oficial de la arquitectura técnica, base de datos y diseño del ecosistema de **UFS Enterprise Field OS** desarrollado para **United Facility Services Costa Rica** y preparado para la evaluación técnica por parte de **Genpact Costa Rica**.

---

## 🏗️ 1. Arquitectura Global (Tres Capas)

El ecosistema está diseñado bajo un modelo híbrido en la nube, optimizado para operaciones en tiempo real y resiliencia offline.

```mermaid
graph TD
    subgraph Capa de Cliente Movil (Operador de Campo)
        Mobile[Android App / Kotlin Compose]
        Voice[TTS Voice Guidance Engine]
        Camera[Camera Capture Module]
    end

    subgraph Capa de Control Central (Web Dashboard)
        Web[Next.js 15 App Router]
        Audio[Web Audio Radar Chimes]
        Sig[Canvas Signature Pad]
        PDF[React-PDF Engine]
    end

    subgraph Base de Datos & Tiempo Real (Supabase Cloud)
        DB[(Supabase / PostgreSQL)]
        Realtime[Realtime Subscriptions Feed]
        LocalSim[(LocalStorage Simulation Mode)]
    end

    subgraph Capa de Inteligencia Artificial (Google Gemini)
        Gemini[Gemini API Proxy / route.ts]
        Vision[Gemini Vision Lab]
        NLP[SLA & Priority Classifier]
    end

    Mobile <-->|Pings GPS & Check-ins| DB
    Web <-->|Consulta & Acciones| DB
    Web <-->|Auditoría Contextual| Gemini
    DB -.->|Bypass si no hay Env| LocalSim
```

### Componentes Clave:
1. **Consola Web (Next.js 15 App Router):** Panel ejecutivo de alta densidad diseñado para supervisores y directores operacionales. Implementa mapas interactivos (Leaflet.js), gráficas de rendimiento (Recharts), reportes automatizados (PDF) y simulación GPS.
2. **Aplicación Android (Kotlin + Jetpack Compose):** Cliente nativo móvil para operarios en campo. Diseñado bajo una estética de terminal industrial futurista. Cuenta con síntesis de voz interactiva, control de jornada con geolocalización, captura de firmas y módulo de cámara en tiempo real.
3. **Capa del Servidor de Base de Datos (Supabase Cloud):** Motor de base de datos PostgreSQL alojado que ofrece persistencia transaccional y feed de actualizaciones en tiempo real usando Supabase Realtime (WebSockets).

---

## 🎨 2. Sistema de Diseño & Branding UFS

La interfaz de usuario implementa la paleta de colores oficial de **United Facility Services Costa Rica** complementada con acentos neón cyber-industriales de alta visibilidad:

* **Colores Base:**
  * `Primary Blue` (`#003087`): Color institucional de UFS, utilizado en headers y barras laterales.
  * `Secondary Blue` (`#0056D2`): Tono medio para botones secundarios y acentos estructurales.
  * `Accent Cyan` (`#00A3E0` / `#00FFFF`): Tono neón para elementos interactivos y telemetría activa.
* **Colores de Estado:**
  * `Success Green` (`#00875A` / `#39FF14`): Acento verde neón para check-ins y turnos activos.
  * `Warning Orange` (`#FF8B00`): Tono de alerta para SLAs que están próximos a vencer.
  * `Danger Red` (`#DE350B`): Color rojo neón para incidentes críticos y tareas urgentes.

---

## 🗄️ 3. Esquema de Base de Datos (Supabase / PostgreSQL)

El esquema de base de datos relacional asegura la integridad referencial y rendimiento de telemetría:

### Estructura de Tablas:

```sql
-- 1. Perfiles de Usuario (Extensión de Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gerente', 'supervisor', 'operativo')),
  phone TEXT,
  zone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Clientes (Inmuebles y Contratos de Servicio)
CREATE TABLE clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo_inmueble TEXT CHECK (tipo_inmueble IN ('oficina', 'hospital', 'bodega', 'comercio', 'residencial', 'industrial', 'otro')),
  direccion TEXT NOT NULL,
  zona TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  contacto_nombre TEXT,
  contacto_telefono TEXT,
  contacto_email TEXT,
  contrato_inicio DATE,
  contrato_fin DATE,
  servicios_activos TEXT[],
  sla_horas INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Órdenes de Trabajo (OT)
CREATE TABLE ordenes_trabajo (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL, -- Formato automático: OT-YYYY-XXXX
  cliente_id UUID REFERENCES clientes(id) NOT NULL,
  tipo_servicio TEXT NOT NULL CHECK (tipo_servicio IN (
    'limpieza_general', 'limpieza_profunda', 'mantenimiento_preventivo',
    'mantenimiento_correctivo', 'jardineria', 'control_plagas',
    'desinfeccion', 'trabajo_altura', 'remodelacion', 'otro'
  )),
  prioridad TEXT NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')) DEFAULT 'media',
  estado TEXT NOT NULL CHECK (estado IN (
    'pendiente', 'asignada', 'en_progreso', 'en_revision', 'completada', 'cancelada'
  )) DEFAULT 'pendiente',
  titulo TEXT NOT NULL,
  descripcion TEXT,
  supervisor_id UUID REFERENCES profiles(id),
  operativo_id UUID REFERENCES profiles(id),
  fecha_programada TIMESTAMPTZ,
  fecha_inicio TIMESTAMPTZ,
  fecha_cierre TIMESTAMPTZ,
  sla_limite TIMESTAMPTZ,
  tiempo_real_minutos INTEGER,
  ubicacion_lat DECIMAL(10, 8),
  ubicacion_lng DECIMAL(11, 8),
  fotos_antes TEXT[],
  fotos_despues TEXT[],
  firma_cliente_url TEXT,
  calificacion_cliente INTEGER CHECK (calificacion_cliente BETWEEN 1 AND 5),
  comentario_cliente TEXT,
  observaciones_operativo TEXT,
  reporte_ia TEXT,
  costo_estimado DECIMAL(10, 2),
  costo_real DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Check-ins de Campo (Telemetría de Turno)
CREATE TABLE checkins_campo (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  operativo_id UUID REFERENCES profiles(id) NOT NULL,
  orden_id UUID REFERENCES ordenes_trabajo(id),
  cliente_id UUID REFERENCES clientes(id),
  tipo TEXT CHECK (tipo IN ('entrada', 'salida')) NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  foto_url TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notas TEXT
);

-- 5. Inventario de Bodega
CREATE TABLE inventario (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  categoria TEXT CHECK (categoria IN ('quimico', 'herramienta', 'equipo', 'consumible', 'epp', 'otro')),
  unidad TEXT NOT NULL,
  stock_actual DECIMAL(10, 2) DEFAULT 0,
  stock_minimo DECIMAL(10, 2) DEFAULT 0,
  ubicacion TEXT,
  qr_code TEXT,
  proveedor TEXT,
  costo_unitario DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Incidentes y Desviaciones
CREATE TABLE incidentes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  orden_id UUID REFERENCES ordenes_trabajo(id),
  cliente_id UUID REFERENCES clientes(id) NOT NULL,
  reportado_por UUID REFERENCES profiles(id) NOT NULL,
  tipo TEXT CHECK (tipo IN (
    'accidente_personal', 'dano_inmueble', 'robo', 'falla_equipo',
    'queja_cliente', 'incidente_quimico', 'caida', 'otro'
  )) NOT NULL,
  severidad TEXT CHECK (severidad IN ('leve', 'moderado', 'grave', 'critico')) NOT NULL,
  descripcion TEXT NOT NULL,
  descripcion_ia TEXT, -- Generada por Gemini Vision
  fotos TEXT[],
  estado TEXT CHECK (estado IN ('reportado', 'en_investigacion', 'resuelto', 'cerrado')) DEFAULT 'reportado',
  acciones_tomadas TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📸 4. Módulo de Cámara Nativa en la Aplicación Android

La captura de evidencia física de los trabajos realizados se implementa utilizando las APIs de Actividades para Resultados nativas en Jetpack Compose, garantizando compatibilidad y estabilidad en cualquier dispositivo Android moderno (ej. Honor Magic V2):

* **Flujo Operacional del Operario:**
  1. El operario hace clic en la tarjeta de captura visual ("ANTES" o "DESPUÉS").
  2. La app invoca el contrato nativo `ActivityResultContracts.TakePicturePreview()`.
  3. El sistema operativo abre la cámara por defecto del dispositivo de forma aislada.
  4. Una vez capturada la fotografía, el sistema devuelve un objeto `Bitmap` a la app.
  5. La app actualiza el estado local (`photoBeforeBitmap` o `photoAfterBitmap`), renderizando la imagen directamente en el contenedor correspondiente con un filtro de acento verde neón y marca de conformidad ("✓ OK"), además de notificar de forma audible mediante síntesis de voz costarricense ("Foto del estado inicial registrada").

---

## 🤖 5. Arquitectura del Proxy de Inteligencia Artificial (BYOK)

Para evitar la exposición directa de la clave de API de Google Gemini en el cliente móvil o el navegador, la aplicación utiliza una arquitectura de **Proxy Seguro**:

```
[Cliente Web / Móvil] 
        │
        ▼ (POST /api/gemini)
[Next.js API Route (Backend)] ──(Obtiene la API Key Encriptada)
        │
        ▼ (Conecta vía HTTPS Seguro)
[Google Gemini API v1beta Endpoint]
```

### Casos de Uso Activos de la IA:
1. **Clasificación de Prioridad:** Determina automáticamente la urgencia del ticket según la descripción técnica ingresada al crear una orden de trabajo.
2. **Mitigación de Incidentes:** Al reportar un daño o accidente, el operario sube una foto. Gemini Vision analiza la imagen y responde en formato JSON detallando el plan de contingencia inmediato de 4 puntos.
3. **Auditoría de Calidad:** Analiza fotos de trabajos terminados y evalúa si cumplen con el estándar de calidad y seguridad de UFS.

---

## 🔒 6. Seguridad y Despliegue de Producción

1. **Protección de Credenciales:** Toda configuración sensible y llaves de acceso se cargan exclusivamente en tiempo de compilación/ejecución mediante variables de entorno en el archivo `.env.local` (el cual está protegido bajo las directrices estrictas del archivo `.gitignore`).
2. **Pila de Despliegue:**
   * **Web:** Vercel Production Deployments.
   * **Android:** Compilación nativa optimizada mediante R8/Proguard para minimizar el tamaño de la APK (7.4 MB).
   * **Database:** Supabase Cloud con Row Level Security (RLS) habilitado.
