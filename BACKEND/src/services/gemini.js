const { GoogleGenerativeAI } = require("@google/generative-ai");

// Se inicializa el cliente de IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Puedes exportar el modelo directamente para usarlo en los controladores
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

module.exports = model;
