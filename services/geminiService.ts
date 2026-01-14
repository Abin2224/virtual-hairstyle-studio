
import { GoogleGenAI } from "@google/genai";
import { Gender, HairLength } from "../types";

/**
 * Service to handle image generation using Gemini 2.5 Flash Image.
 * We use the image-to-image capabilities by passing the source image and a prompt.
 */
export const generateHairstyle = async (
  base64Image: string,
  gender: Gender,
  styleName: string,
  length: HairLength
): Promise<string> => {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean the base64 string if it contains the prefix
  const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    TASK: Edit this photo to change the person's hairstyle.
    GENDER: ${gender}
    NEW HAIRSTYLE: ${styleName}
    HAIR LENGTH: ${length}

    CONSTRAINTS:
    1. Maintain the person's identity, facial features, skin tone, and expression EXACTLY as they appear in the original image.
    2. Change ONLY the hair. Do not modify the background, clothing, or pose unless necessary to blend the hair.
    3. Ensure the hair looks realistic and fits naturally on the person's head.
    4. Keep the lighting and environmental conditions consistent with the original photo.
    5. No text, logos, or watermarks in the generated image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanedBase64,
            },
          },
          { text: prompt },
        ],
      },
    });

    // Locate the image part by iterating through parts to find inlineData, as recommended in guidelines.
    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No candidates returned from Gemini.");

    const imagePart = candidate.content.parts.find((p) => p.inlineData);
    if (!imagePart || !imagePart.inlineData) {
      throw new Error("No image data returned in response.");
    }

    return `data:image/png;base64,${imagePart.inlineData.data}`;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate hairstyle preview.");
  }
};
