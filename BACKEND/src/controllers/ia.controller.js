const prisma = require("../db/prisma");
const genAI = require("../services/gemini"); // gemini.js actualizado con @google/genai
const fs = require("fs");

// Función para dormir X milisegundos
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para generar texto con reintentos en caso de 429
const generarTextoConRetry = async (prompt, retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await genAI.generarTexto(prompt);
    } catch (e) {
      if (e.status === 429 && i < retries - 1) {
        console.log(`⚠ 429 Resource exhausted. Reintentando en ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw e;
      }
    }
  }
};

const generarCuentoIA = async (req, res) => {
  const { prompt, usuarioId } = req.body;
  if (!prompt) return res.status(400).json({ error: "El prompt es obligatorio" });

  try {
    console.log("Generando cuento con GEMINI...");

    // 1️⃣ Generar texto del cuento usando el nuevo SDK con reintentos
    let textoJSON = await generarTextoConRetry(`
      Genera un cuento infantil basado en este prompt: "${prompt}".
      Devuélvelo **solo como JSON válido**, sin bloques de código ni comillas extra, usando este formato exacto:
      {
        "titulo": "Título del cuento",
        "descripcion": "Breve descripción",
        "portadaPrompt": "Prompt para generar imagen",
        "paginas": [
          { "numero": 1, "texto": "Texto página 1" },
          { "numero": 2, "texto": "Texto página 2" }
        ]
      }
    `);

    // Limpiar posibles bloques de Markdown ```json ... ```
    textoJSON = textoJSON.replace(/```json/g, "").replace(/```/g, "").trim();

    let data;
    try {
      data = JSON.parse(textoJSON);
    } catch (e) {
      console.log("⚠ Texto devuelto por IA no es JSON válido:", textoJSON);
      throw e;
    }

    // 2️⃣ Guardar cuento en DB
    const nuevoCuento = await prisma.cuentos.create({
      data: {
        tituloCuento: data.titulo,
        descripcion: data.descripcion,
        urlPortada: null,
        edadRecomentada: 5,
        idUsuario: usuarioId || null,
      },
    });

    console.log("Cuento guardado ID:", nuevoCuento.idCuento);

    // 3️⃣ Generar portada
    let urlPortadaFinal = null;
    try {
      const base64 = await genAI.generarImagen(data.portadaPrompt);
      const fileName = `portada_${nuevoCuento.idCuento}.png`;
      const filePath = `img/${fileName}`;
      fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
      urlPortadaFinal = `${process.env.SERVER_URL}/static/${fileName}`;

      await prisma.cuentos.update({
        where: { idCuento: nuevoCuento.idCuento },
        data: { urlPortada: urlPortadaFinal },
      });

      console.log("Portada generada y guardada.");
    } catch (e) {
      console.log("⚠ No se pudo generar portada:", e.message);
    }

    // 4️⃣ Guardar páginas
    for (const pag of data.paginas) {
      await prisma.paginas.create({
        data: {
          idCuento: nuevoCuento.idCuento,
          numeroPagina: pag.numero,
          texto: pag.texto,
        },
      });
    }

    return res.status(201).json({
      id: nuevoCuento.idCuento,
      titulo: data.titulo,
      urlPortada: urlPortadaFinal,
      descripcion: data.descripcion,
    });

  } catch (error) {
    console.log("ERROR GENERANDO CUENTO:", error);
    return res.status(500).json({ error: "Error generando cuento con IA" });
  }
};

module.exports = { generarCuentoIA };
