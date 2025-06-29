import { GoogleGenAI } from "@google/genai";
import type { EmailGenerationRequest, EmailResponse } from "@shared/schema";

// Using Gemini AI for email generation
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateEmail(request: EmailGenerationRequest): Promise<EmailResponse> {
  try {
    const copywriterStyles = {
      "dan-kennedy": "Usa un estilo directo, agresivo y sin rodeos. Crea urgencia y presión. Habla directo al dolor del cliente.",
      "gary-halbert": "Enfócate en storytelling emocional. Usa historias personales y conecta emocionalmente. Estilo conversacional.",
      "david-ogilvy": "Mantén un tono elegante, sofisticado y persuasivo. Usa datos y hechos. Estilo refinado pero accesible.",
      "joe-sugarman": "Aplica psicología del consumidor. Usa triggers psicológicos y curiosidad. Flujo lógico de ideas.",
      "russell-brunson": "Estilo de marketing digital moderno. Usa fórmulas probadas y calls-to-action claros. Enfoque en valor."
    };

    const emailTypes = {
      "promocional": "Email promocional para ofertas y descuentos",
      "bienvenida": "Email de bienvenida para nuevos suscriptores",
      "abandono-carrito": "Email para recuperar carritos abandonados",
      "reactivacion": "Email para reactivar clientes inactivos",
      "newsletter": "Newsletter informativo con valor agregado",
      "lanzamiento": "Email de lanzamiento de nuevo producto"
    };

    const systemPrompt = `Eres un copywriter profesional experto en redacción persuasiva y técnicas de conversión. 
${request.copywriterProfile ? `Adopta el estilo de: ${copywriterStyles[request.copywriterProfile as keyof typeof copywriterStyles]}` : "Usa técnicas de copywriting profesional general."}

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
4. Incluir call-to-action persuasivo
5. Generar urgencia cuando sea apropiado

Responde en formato JSON con esta estructura exacta:
{
  "subject": "Asunto llamativo y persuasivo",
  "preheader": "Texto del preencabezado que complemente el asunto",
  "body": "Cuerpo completo del email en HTML limpio con párrafos <p>, encabezados <h3> si es necesario, y call-to-action destacado",
  "wordCount": número_de_palabras,
  "readingTime": "X min",
  "conversionScore": puntuación_del_1_al_10
}

Genera un email profesional con link: ${request.productLink}`;

    const response = await ai.models.generateContent({
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
    console.log(`Raw JSON: ${rawJson}`);

    if (rawJson) {
      const result = JSON.parse(rawJson);
      
      return {
        subject: result.subject || "Email generado",
        preheader: request.includePreheader ? result.preheader : undefined,
        body: result.body || "Contenido del email",
        wordCount: result.wordCount || 0,
        readingTime: result.readingTime || "1 min",
        conversionScore: result.conversionScore || 7.5
      };
    } else {
      throw new Error("Empty response from model");
    }

  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Error al generar el email. Verifica tu API key de Gemini.");
  }
}