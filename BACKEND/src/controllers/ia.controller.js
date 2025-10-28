const prisma = require('../db/prisma');
const geminiModel = require('../services/gemini'); // Importamos el modelo de Gemini

/**
 * Controlador para: POST /api/ia/generar-cuento
 * Generar un cuento nuevo con IA y guardarlo en la BD
 */
const generarCuentoIA = async (req, res) => {
  const { prompt, usuarioId } = req.body; 

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  try {
    // 1. Llama a la API de Gemini
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const textoDelCuento = response.text();

    // 2. Guarda el nuevo cuento en tu base de datos
    const nuevoCuento = await prisma.cuentos.create({
      data: {
        titulo: `Cuento sobre ${prompt.substring(0, 20)}...`,
        descripcion: textoDelCuento.substring(0, 100),
        // (Aquí podrías agregar 'autorId: usuarioId' si tu BD lo soporta)
      },
    });

    // 3. Responde a React Native con el cuento creado
    res.status(201).json(nuevoCuento);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el cuento con GEMINI' });
  }
};

// Exportamos la función para que las rutas puedan usarla
module.exports = {
  generarCuentoIA
};

