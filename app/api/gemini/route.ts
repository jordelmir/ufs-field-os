/**
 * UFS Field OS — Gemini API Proxy Route
 * 
 * Server-side proxy for Gemini API calls.
 * The BYOK (Bring Your Own Key) model sends the API key in the request body
 * instead of exposing it as a URL query parameter in the browser.
 * This prevents the key from leaking into browser history, network logs, or proxies.
 */

import { NextRequest } from "next/server";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, model, contents, generationConfig } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
      return Response.json(
        { error: "API Key inválida o no proporcionada." },
        { status: 400 }
      );
    }

    const targetModel = model || "gemini-2.5-flash";
    const geminiUrl = `${GEMINI_BASE_URL}/${targetModel}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig,
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      return Response.json(
        { error: `Gemini API error: ${geminiResponse.status}`, details: errorData },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error("[UFS API Proxy] Gemini request failed:", error);
    return Response.json(
      { error: "Error interno del servidor al procesar la solicitud de IA." },
      { status: 500 }
    );
  }
}
