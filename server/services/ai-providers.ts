import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { EmailGenerationRequest, EmailResponse } from "@shared/schema";

// AI Provider interfaces
export interface AIProvider {
  generateEmail(request: EmailGenerationRequest): Promise<EmailResponse>;
  name: string;
  requiresKey: string;
}

// Gemini Provider
class GeminiProvider implements AIProvider {
  name = "Gemini";
  requiresKey = "GEMINI_API_KEY";
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  async generateEmail(request: EmailGenerationRequest): Promise<EmailResponse> {
    const systemPrompt = this.buildSystemPrompt(request);

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            preheader: { type: "string" },
            body: { type: "string" },
            wordCount: { type: "number" },
            readingTime: { type: "string" },
            conversionScore: { type: "number" }
          },
          required: ["subject", "body", "wordCount", "readingTime", "conversionScore"]
        }
      },
      contents: systemPrompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const result = JSON.parse(rawJson);
      return this.formatResponse(result, request);
    } else {
      throw new Error("Empty response from Gemini");
    }
  }

  private buildSystemPrompt(request: EmailGenerationRequest): string {
    const copywriterStyles = {
      "dan-kennedy": "Usa un estilo directo, agresivo y sin rodeos. Crea urgencia y presión.",
      "gary-halbert": "Enfócate en storytelling emocional. Usa historias personales y conecta emocionalmente.",
      "david-ogilvy": "Mantén un tono elegante, sofisticado y persuasivo. Usa datos y hechos.",
      "joe-sugarman": "Aplica psicología del consumidor. Usa triggers psicológicos y curiosidad.",
      "russell-brunson": "Estilo de marketing digital moderno. Usa fórmulas probadas y calls-to-action claros."
    };

    const emailTypes = {
      "promocional": "Email promocional para ofertas y descuentos",
      "bienvenida": "Email de bienvenida para nuevos suscriptores",
      "abandono-carrito": "Email para recuperar carritos abandonados",
      "reactivacion": "Email para reactivar clientes inactivos",
      "newsletter": "Newsletter informativo con valor agregado",
      "lanzamiento": "Email de lanzamiento de nuevo producto"
    };

    return `Eres un copywriter profesional experto en redacción persuasiva y técnicas de conversión. 
${request.copywriterProfile && request.copywriterProfile !== "general" ? `Adopta el estilo de: ${copywriterStyles[request.copywriterProfile as keyof typeof copywriterStyles]}` : "Usa técnicas de copywriting profesional general."}

Debes crear un email ${emailTypes[request.emailType as keyof typeof emailTypes]} con las siguientes características:
- Tono: ${request.clientTone}
- Producto: ${request.productName}
- Descripción: ${request.productDescription}
- Audiencia: ${request.targetAudience}
${request.elementsToAvoid ? `- EVITA: ${request.elementsToAvoid}` : ""}

El email debe:
1. Captar la atención desde el asunto
2. Crear conexión emocional
3. Presentar el valor del producto
4. Incluir call-to-action persuasivo con link: ${request.productLink}
5. Generar urgencia cuando sea apropiado

Responde en formato JSON con esta estructura exacta:
{
  "subject": "Asunto llamativo y persuasivo",
  "preheader": "Texto del preencabezado que complemente el asunto",
  "body": "Cuerpo completo del email en HTML limpio con párrafos <p>, encabezados <h3> si es necesario, y call-to-action destacado",
  "wordCount": número_de_palabras,
  "readingTime": "X min",
  "conversionScore": puntuación_del_1_al_10
}`;
  }

  private formatResponse(result: any, request: EmailGenerationRequest): EmailResponse {
    return {
      subject: result.subject || "Email generado",
      preheader: request.includePreheader ? result.preheader : undefined,
      body: result.body || "Contenido del email",
      wordCount: result.wordCount || 0,
      readingTime: result.readingTime || "1 min",
      conversionScore: result.conversionScore || 7.5
    };
  }
}

// OpenAI Provider
class OpenAIProvider implements AIProvider {
  name = "OpenAI";
  requiresKey = "OPENAI_API_KEY";
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "" 
    });
  }

  async generateEmail(request: EmailGenerationRequest): Promise<EmailResponse> {
    const systemPrompt = this.buildSystemPrompt(request);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Genera un email profesional con link: ${request.productLink}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return this.formatResponse(result, request);
  }

  private buildSystemPrompt(request: EmailGenerationRequest): string {
    const copywriterStyles = {
      "dan-kennedy": "Usa un estilo directo, agresivo y sin rodeos. Crea urgencia y presión.",
      "gary-halbert": "Enfócate en storytelling emocional. Usa historias personales y conecta emocionalmente.",
      "david-ogilvy": "Mantén un tono elegante, sofisticado y persuasivo. Usa datos y hechos.",
      "joe-sugarman": "Aplica psicología del consumidor. Usa triggers psicológicos y curiosidad.",
      "russell-brunson": "Estilo de marketing digital moderno. Usa fórmulas probadas y calls-to-action claros."
    };

    const emailTypes = {
      "promocional": "Email promocional para ofertas y descuentos",
      "bienvenida": "Email de bienvenida para nuevos suscriptors",
      "abandono-carrito": "Email para recuperar carritos abandonados",
      "reactivacion": "Email para reactivar clientes inactivos",
      "newsletter": "Newsletter informativo con valor agregado",
      "lanzamiento": "Email de lanzamiento de nuevo producto"
    };

    return `Eres un copywriter profesional experto en redacción persuasiva y técnicas de conversión. 
${request.copywriterProfile && request.copywriterProfile !== "general" ? `Adopta el estilo de: ${copywriterStyles[request.copywriterProfile as keyof typeof copywriterStyles]}` : "Usa técnicas de copywriting profesional general."}

Debes crear un email ${emailTypes[request.emailType as keyof typeof emailTypes]} con las siguientes características:
- Tono: ${request.clientTone}
- Producto: ${request.productName}
- Descripción: ${request.productDescription}
- Audiencia: ${request.targetAudience}
${request.elementsToAvoid ? `- EVITA: ${request.elementsToAvoid}` : ""}

El email debe incluir call-to-action persuasivo y generar urgencia cuando sea apropiado.

Responde en formato JSON con esta estructura exacta:
{
  "subject": "Asunto llamativo y persuasivo",
  "preheader": "Texto del preencabezado que complemente el asunto",
  "body": "Cuerpo completo del email en HTML limpio con párrafos <p>, encabezados <h3> si es necesario, y call-to-action destacado",
  "wordCount": número_de_palabras,
  "readingTime": "X min",
  "conversionScore": puntuación_del_1_al_10
}`;
  }

  private formatResponse(result: any, request: EmailGenerationRequest): EmailResponse {
    return {
      subject: result.subject || "Email generado",
      preheader: request.includePreheader ? result.preheader : undefined,
      body: result.body || "Contenido del email",
      wordCount: result.wordCount || 0,
      readingTime: result.readingTime || "1 min",
      conversionScore: result.conversionScore || 7.5
    };
  }
}

// Provider Manager
class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.providers.set("gemini", new GeminiProvider());
    this.providers.set("openai", new OpenAIProvider());
  }

  getProvider(name: string = "gemini"): AIProvider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`AI provider '${name}' not found`);
    }
    return provider;
  }

  getAvailableProviders(): Array<{name: string, key: string, available: boolean}> {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      key: provider.requiresKey,
      available: !!process.env[provider.requiresKey]
    }));
  }
}

// Export main function
export const aiManager = new AIProviderManager();

export async function generateEmail(request: EmailGenerationRequest, provider: string = "gemini"): Promise<EmailResponse> {
  try {
    const aiProvider = aiManager.getProvider(provider);
    return await aiProvider.generateEmail(request);
  } catch (error) {
    console.error(`Error generating email with ${provider}:`, error);
    throw new Error(`Error al generar el email con ${provider}. Verifica tu API key.`);
  }
}