import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ModerationResult {
  safe: boolean;
  reason: string;
}

export async function moderateImage(base64Data: string, mimeType: string): Promise<ModerationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Analyze this image for inappropriate content including nudity, sexual content, extreme violence, or hate speech (like Nazi symbols or other racist iconography). Return a JSON response with 'safe' (boolean) and 'reason' (string). If the image is a historical flag, be reasonable but strict about hate symbols.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
          },
          required: ["safe", "reason"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      return { safe: false, reason: "Unable to analyze image." };
    }

    const result = JSON.parse(resultText) as ModerationResult;
    return result;
  } catch (error) {
    console.error("Moderation error:", error);
    return { safe: false, reason: "Error during image moderation. Please try another image." };
  }
}
