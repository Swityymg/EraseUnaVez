// src/controllers/cuentos.controller.js
const prisma = require('../db/prisma');

/**
 * Construye la URL pública completa para un archivo estático.
 * Usa la info de la request para no depender de una IP hardcodeada.
 */
const construirUrlEstatica = (req, nombreArchivo) => {
  if (!nombreArchivo) return null;
  // nombreArchivo puede venir como 'img/caperucita.jpg' o solo 'caperucita.jpg'
  const nombre = nombreArchivo.replace(/^img\//, '').replace(/^portadas\//, '');
  const host = req.get('host'); // incluye puerto
  const protocol = req.protocol; // http o https
  return `${protocol}://${host}/static/${nombre}`;
};

/**
 * GET /api/cuentos
 * Devuelve un array de cuentos con propiedades:
 * { id, titulo, descripcion, urlPortada, ... }
 */
const getCuentos = async (req, res) => {
  try {
    const cuentos = await prisma.cuentos.findMany();

    // Mapear a la forma que espera el frontend
    const cuentosFormateados = cuentos.map(c => {
      return {
        id: c.idCuento, // frontend espera 'id'
        titulo: c.tituloCuento, // frontend espera 'titulo'
        descripcion: c.descripcion ?? null,
        edadRecomentada: c.edadRecomentada ?? null,
        fechaPublicacion: c.fechaPublicacion ?? null,
        urlPortada: c.urlPortada ? construirUrlEstatica(req, c.urlPortada) : null,
      };
    });

    return res.json(cuentosFormateados);
  } catch (error) {
    console.error('Error getCuentos:', error);
    return res.status(500).json({ error: 'Error al obtener los cuentos' });
  }
};

/**
 * GET /api/cuentos/:id
 * Devuelve un cuento (con sus páginas) en la misma forma.
 */
const getCuentoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const cuento = await prisma.cuentos.findUnique({
      where: { idCuento: parseInt(id) },
      include: { paginas: true }
    });

    if (!cuento) {
      return res.status(404).json({ error: 'Cuento no encontrado' });
    }

    // Formatear páginas (si las hay)
    const paginasFormateadas = (cuento.paginas || []).map(p => ({
      idPagina: p.idPagina,
      numeroPagina: p.numeroPagina,
      texto: p.texto ?? null,
      urlImagen: p.urlImagen ? construirUrlEstatica(req, p.urlImagen) : null,
      urlAudio: p.urlAudio ? construirUrlEstatica(req, p.urlAudio) : null,
    }));

    const cuentoFormateado = {
      id: cuento.idCuento,
      titulo: cuento.tituloCuento,
      descripcion: cuento.descripcion ?? null,
      edadRecomentada: cuento.edadRecomentada ?? null,
      fechaPublicacion: cuento.fechaPublicacion ?? null,
      urlPortada: cuento.urlPortada ? construirUrlEstatica(req, cuento.urlPortada) : null,
      paginas: paginasFormateadas,
    };

    return res.json(cuentoFormateado);
  } catch (error) {
    console.error('Error getCuentoPorId:', error);
    return res.status(500).json({ error: 'Error al obtener el cuento' });
  }
};

module.exports = {
  getCuentos,
  getCuentoPorId
};
