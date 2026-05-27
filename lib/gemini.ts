/**
 * UFS Field OS — Gemini AI Service Client (BYOK)
 */

interface GeminiAnalysisResult {
  descripcion: string;
  calidad: 'excelente' | 'buena' | 'regular' | 'deficiente';
  seguridad: string;
  recomendaciones: string[];
}

interface GeminiIncidentResult {
  tipo: string;
  severidad: 'leve' | 'moderado' | 'grave' | 'critico';
  descripcion: string;
  acciones: string[];
  requiere_atencion_medica: boolean;
}

/**
 * Retrieves the user's custom Gemini API key from browser storage.
 */
export function getLocalGeminiKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ufs_gemini_api_key") || "";
  }
  return "";
}

/**
 * Saves the user's custom Gemini API key to browser storage.
 */
export function saveLocalGeminiKey(key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("ufs_gemini_api_key", key);
  }
}

/**
 * Calls Gemini Vision API to analyze work order completion photos.
 * Gracioulsy fallbacks to highly realistic mock technical reports if no key is provided.
 */
export async function analyzeWorkPhoto(base64Image: string, serviceType: string): Promise<GeminiAnalysisResult> {
  const apiKey = getLocalGeminiKey();

  if (!apiKey) {
    // Elegant and professional demo fallback
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API lag
    return {
      descripcion: `Se completó satisfactoriamente el servicio de ${serviceType.replace("_", " ")} en las instalaciones principales de oficinas. Las superficies de alto contacto fueron desinfectadas de forma exhaustiva, cumpliendo con los estándares sanitarios e institucionales de United Facility Services Costa Rica.`,
      calidad: "excelente",
      seguridad: "El operario utilizó el equipo de protección personal (EPP) completo: mascarilla protectora, guantes de nitrilo y calzado antideslizante para evitar caídas sobre piso húmedo.",
      recomendaciones: [
        "Ventilar el área durante los próximos 15 minutos para disipar vapores residuales.",
        "Repetir inspección de desinfección en las próximas 24 horas debido al flujo constante de personal.",
        "Asegurar el reabastecimiento del stock de desinfectante biodegradable en la bodega de servicios auxiliares."
      ]
    };
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
                text: `Analiza esta foto de trabajo de campo de facility management para un servicio de ${serviceType}. Proporciona un objeto JSON estricto con los siguientes campos en español:\n` +
                      `1. "descripcion": Explicación técnica del trabajo realizado\n` +
                      `2. "calidad": Calidad del trabajo ('excelente', 'buena', 'regular', 'deficiente')\n` +
                      `3. "seguridad": Observaciones de uso de EPP o riesgos detectados\n` +
                      `4. "recomendaciones": Arreglo de strings con 3 sugerencias de mantenimiento.`
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image.split(",")[1] || base64Image
                }
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
    return JSON.parse(textResult) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Error invoking Gemini Vision API:", error);
    throw new Error("No se pudo realizar el análisis de imagen con la API Key proporcionada.");
  }
}

/**
 * Calls Gemini Vision API to analyze field incident visual hazards.
 */
export async function analyzeFieldIncident(base64Image: string, reportDetails: string): Promise<GeminiIncidentResult> {
  const apiKey = getLocalGeminiKey();

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      tipo: "Derrame de líquido químico e inflamable",
      severidad: "grave",
      descripcion: `Se evidencia derrame accidental de desinfectante clorado concentrado en el pasillo de tránsito logístico, lo que representa un peligro inminente de deslizamiento y emanación de gases irritantes.`,
      acciones: [
        "Acordonar el área afectada con conos de advertencia de peligro en un radio de 5 metros.",
        "Utilizar el kit absorbente de derrames químicos ubicado en el rack central de mantenimiento.",
        "Desplegar ventilador extractor portátil para disipar la concentración de vapores clorados.",
        "Notificar de inmediato al supervisor de salud ocupacional de la planta."
      ],
      requiere_atencion_medica: false
    };
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
                text: `Eres el evaluador de incidentes de UFS Costa Rica. Analiza esta foto de incidente y el reporte adjunto ("${reportDetails}"). Devuelve un JSON estricto en español con los campos:\n` +
                      `1. "tipo": Tipo de incidente detectado\n` +
                      `2. "severidad": Nivel ('leve', 'moderado', 'grave', 'critico')\n` +
                      `3. "descripcion": Resumen objetivo de lo observado\n` +
                      `4. "acciones": Arreglo de 4 acciones de mitigación inmediata\n` +
                      `5. "requiere_atencion_medica": booleano`
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image.split(",")[1] || base64Image
                }
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
    return JSON.parse(textResult) as GeminiIncidentResult;
  } catch (error) {
    console.error("Error invoking Gemini Incident API:", error);
    throw new Error("No se pudo analizar el incidente con la API Key proporcionada.");
  }
}

/**
 * Summarizes operational statistics into executive prose.
 */
export async function generateExecutiveSummary(stats: {
  periodo: string;
  otCompletadas: number;
  otPendientes: number;
  slaCumplimiento: number;
  incidentes: number;
  clientesAtendidos: number;
  topClientes: string;
}): Promise<string> {
  const apiKey = getLocalGeminiKey();

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `### Resumen Operacional de United Facility Services — Periodo: ${stats.periodo}

Durante este ciclo operativo, el equipo en campo de United Facility Services Costa Rica ha registrado una sólida productividad con un total de **${stats.otCompletadas} órdenes de trabajo completadas** y una tasa de **cumplimiento de SLA del ${stats.slaCumplimiento}%**. 

#### Aspectos Clave Destacados:
* **Cobertura y Servicio:** Se brindó atención integral a **${stats.clientesAtendidos} cuentas activas**, destacando un alto volumen logístico y operativo en **${stats.topClientes}**.
* **Gestión de Riesgos:** Se registraron **${stats.incidentes} incidentes operativos**, los cuales fueron atendidos y controlados bajo los tiempos de resolución estipulados por los protocolos de seguridad.
* **Control de Pendientes:** Se mantienen **${stats.otPendientes} órdenes pendientes** programadas para la siguiente rotación horaria, sin reportar retrasos críticos en el cumplimiento de los contratos de servicio.

#### Recomendaciones Estratégicas:
1. **Optimización de Despliegue:** Fortalecer la asignación de supervisores en la zona oeste para reducir tiempos de traslado.
2. **Reabastecimiento Inteligente:** Adelantar reabastecimiento en bodegas del sector hospitalario debido al incremento de servicios de desinfección profunda.
3. **Mantenimiento Preventivo:** Agendar la calibración técnica de equipos pesados de limpieza durante las horas de bajo tránsito de oficinas para mantener la excelencia operativa.`;
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
                text: `Genera un resumen ejecutivo profesional y robusto en español con formato Markdown para United Facility Services Costa Rica. Datos del periodo:\n` +
                      `- Periodo: ${stats.periodo}\n` +
                      `- OTs completadas: ${stats.otCompletadas}\n` +
                      `- OTs pendientes: ${stats.otPendientes}\n` +
                      `- SLA cumplimiento: ${stats.slaCumplimiento}%\n` +
                      `- Incidentes: ${stats.incidentes}\n` +
                      `- Clientes atendidos: ${stats.clientesAtendidos}\n` +
                      `- Cuentas principales: ${stats.topClientes}\n\n` +
                      `Describe la efectividad operacional en campo, haz un balance del SLA e incidentes, y genera 3 recomendaciones estratégicas para gerencia.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el reporte ejecutivo.";
  } catch (error) {
    console.error("Error generating executive report:", error);
    return "Error al invocar la API de Gemini para el reporte ejecutivo. Por favor, valide la API key.";
  }
}
