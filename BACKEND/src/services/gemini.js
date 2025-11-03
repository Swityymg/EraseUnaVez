// gemini.js actualizado
const { GoogleGenAI } = require("@google/genai");

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Función para generar texto
const generarTexto = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Ajusta al modelo que quieras usar
      contents: prompt,
      // Opciones extra:
      // maxOutputTokens: 500,
      // temperature: 0.7,
    });
    // El texto generado normalmente está en response.text
    return response.text;
  } catch (error) {
    console.log("ERROR generando texto:", error);
    throw error;
  }
};

// Función para generar imágenes
const generarImagen = async (prompt) => {
  try {
    const response = await ai.models.generateImage({
      model: "image-alpha-001", // modelo de ejemplo
      prompt: prompt,
      size: "1024x1024",
    });
    // La imagen viene en base64 en response.images[0].b64_json
    return response.images[0].b64_json;
  } catch (error) {
    console.log("ERROR generando imagen:", error);
    throw error;
  }
};

module.exports = { generarTexto, generarImagen };
