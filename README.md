# UFS Enterprise Field OS

Sistema Operativo de Gestión de Operaciones en Campo (Field Operations Management System) diseñado a nivel enterprise para **United Facility Services Costa Rica** y como demostración técnica de arquitectura avanzada para la evaluación en **Genpact Costa Rica**.

## 🏗️ Visión General del Producto

UFS Enterprise Field OS no es una aplicación de pantallas estáticas; es una consola de comando centralizada que unifica el trabajo de cuadrillas en campo con la gerencia y supervisión operacional. Provee una interfaz industrial optimizada en modo oscuro con bordes y acentos neón que respetan la paleta de colores corporativos de la empresa.

### Arquitectura de Sistema

```mermaid
graph TD
    subgraph Cliente en Campo (Operador)
        Mobile[Android App / Kotlin Compose]
        Voice[TTS Voice Guidance]
    end

    subgraph Consola Central (Dashboard Web)
        Web[Next.js 15 App Router]
        Audio[Web Audio Radar Chimes]
        Sig[Canvas Signature Pad]
        PDF[React-PDF Engine]
    end

    subgraph Base de Datos & Tiempo Real
        DB[(Supabase / PostgreSQL)]
        Realtime[Realtime Subscriptions Feed]
        LocalSim[(LocalStorage Simulation Mode)]
    end

    subgraph Inteligencia Artificial
        Gemini[Google Gemini API - BYOK]
        Vision[Gemini Vision Lab]
        NLP[SLA & Priority Classifier]
    end

    Mobile <-->|Pings GPS & Check-ins| DB
    Web <-->|Consulta & Acciones| DB
    Web <-->|Auditoría Contextual| Gemini
    DB -.->|Fallback si no hay Env| LocalSim
```

---

## 🚀 Módulos Clave del Sistema

### 🛠️ MÓDULO 1: Gestión de Órdenes de Trabajo (OT)
* **Consola de Tickets:** Creación, asignación, inicio y cierre de servicios operacionales.
* **Telemetría SLA:** Contador visual dinámico del acuerdo de nivel de servicio (SLA) basado en la prioridad del ticket.
* **Firma Digital Biométrica:** Lienzo de firma digital interactivo integrado en la hoja de cierre de OT mediante HTML5 Canvas.
* **Web Audio Synthesis:** Chimes acústicos de confirmación transaccional y alarmas de radar mediante la Web Audio API.
* **Generación de Reportes PDF:** Exportación inmediata de reportes de trabajo técnicos estructurados listos para el cliente usando `@react-pdf/renderer`.

### 👥 MÓDULO 2: Clientes & Expediente de Contratos
* **Directorio Corporativo:** Expedientes de cuentas (Genpact, Intel, Hospital CIMA, Banco Nacional, Multiplaza).
* **Parámetros SLA:** Vinculación de horas de servicio contratadas y tipo de instalación (clínica, oficina, industrial, comercial).

### 📍 MÓDULO 3: Mapa Operacional en Tiempo Real
* **Cartografía Industrial:** Mapa interactivo integrado mediante Leaflet.js con estilos oscuros CartoDB.
* **Geolocalización Operativa:** Marcadores geográficos de cuentas y pings de check-in / check-out emitidos por operarios en campo.
* **Consola de Simulación GPS:** Herramienta interactiva para registrar pings en sitio y observar el flujo de telemetría instantáneo.

### 📦 MÓDULO 4: Inventario & Control de Insumos
* **Bodega SKU:** Control de existencias de químicos concentrados, herramientas, consumibles y equipos de protección personal (EPP).
* **Alertas Críticas:** Indicadores visuales automáticos sobre existencias por debajo del límite de stock mínimo de seguridad.
* **Ajuste de Stock Rápido:** Mecanismo interactivo de adición y sustracción de inventario con retroalimentación sonora direccional.

### ⚠️ MÓDULO 5: Bitácora de Incidentes & Auditoría IA
* **Seguridad Ocupacional:** Registro y severidad de desviaciones (derrames químicos, fallas mecánicas, quejas de clientes).
* **Auditoría de IA (Google Gemini):** Análisis generativo que clasifica el incidente, evalúa riesgos y formula un plan de mitigación en 4 puntos de forma inmediata.

### 🤖 MÓDULO 6: Estudio IA (BYOK)
* **Visual Lab:** Permite procesar fotografías de trabajos terminados o incidentes para auditorías de calidad visuales.
* **Chat de Despacho:** Consultas en lenguaje natural con la IA de UFS para programar servicios o calibrar equipos.

---

## 🛠️ Credenciales de Acceso (Modo Demo)

Para la evaluación del sistema, utilice las siguientes credenciales en la pantalla de inicio de sesión:

* **Administrador Operacional:**
  * **Usuario:** `admin@ufs.cr`
  * **Contraseña:** `demo123`
* **Supervisor en Campo:**
  * **Usuario:** `supervisor@ufs.cr`
  * **Contraseña:** `demo123`

---

## 📦 Instrucciones de Instalación y Ejecución

El proyecto está construido usando **Next.js** y **TypeScript**.

### Requisitos Previos
* Node.js v18.0 o superior
* npm o yarn

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
# Instalar los paquetes requeridos
npm install
```

### 2. Configurar Variables de Entorno (Opcional)
Copie el archivo de ejemplo para crear su archivo de configuración local:
```bash
cp .env.example .env.local
```
*Si no configura variables de Supabase, el sistema iniciará en **Modo Simulación Completa**, cargando una base de datos en memoria local persistente en `localStorage`. Esto permite evaluar el 100% de las funcionalidades transaccionales de forma instantánea sin configuraciones de base de datos.*

### 3. Activar Gemini AI (BYOK - Bring Your Own Key)
Para habilitar el motor de inteligencia artificial en las auditorías operacionales:
1. Inicie sesión en la aplicación.
2. Diríjase al menú **Configuración** o **Estudio IA**.
3. Ingrese su API Key de Google Gemini y presione **Guardar Clave**.
*(Si no posee una clave, el sistema proveerá respuestas técnicas simuladas realistas basadas en catálogos de servicio de UFS).*

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) en su navegador para visualizar la consola.

### 5. Compilar para Producción
```bash
npm run build
```

---

## 🚀 Tecnologías Implementadas
* **Framework:** Next.js (App Router, Server & Client Components)
* **Tipado:** TypeScript
* **Estilos:** Tailwind CSS v4 con variables CSS nativas (@theme)
* **Iconografía:** Lucide React
* **Gráficos:** Recharts (Telemetría de tickets y SLA en Dashboard)
* **Mapas:** Leaflet.js con CartoDB Dark Tiles
* **Generador de Reportes:** @react-pdf/renderer
* **Animaciones:** Framer Motion y CSS Transitions industriales
* **Efectos:** Canvas Confetti y Web Audio API (Sintetizador oscilador)
* **Servicio IA:** Google Gemini API (Modelos `gemini-2.5-flash` vía endpoints REST nativos)

---
*United Facility Services Costa Rica — "Servimos con pasión, por el bienestar"*
