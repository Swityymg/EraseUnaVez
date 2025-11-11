// src/controllers/cuentos.controller.js
const prisma = require('../db/prisma');

const construirUrlEstatica = (req, nombreArchivo) => {
  if (!nombreArchivo) return null;
  // nombreArchivo puede venir como 'img/caperucita.jpg'
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
 * Devuelve un cuento por ID.
 */
const getCuentoPorId = async (req, res) => {
  try {
    const idNum = Number(req.params.id);

    if (isNaN(idNum)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const cuento = await prisma.cuentos.findUnique({
      where: { idCuento: idNum },
      include: { paginas: true }
    });

    if (!cuento) {
      return res.status(404).json({ error: "Cuento no encontrado" });
    }

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
      edadRecomendata: cuento.edadRecomendata ?? null,
      fechaPublicacion: cuento.fechaPublicacion ?? null,
      urlPortada: cuento.urlPortada ? construirUrlEstatica(req, cuento.urlPortada) : null,
      paginas: paginasFormateadas,
    };

    return res.json(cuentoFormateado);

  } catch (error) {
    console.error("Error getCuentoPorId:", error);
    return res.status(500).json({ error: "Error al obtener el cuento" });
  }
};


/**
 * POST /api/cuentos
 * Crea un cuento manualmente
 */
const crearCuento = async (req, res) => {
  try {
    const { 
      tituloCuento, 
      descripcion, 
      urlPortada, 
      edadRecomentada,
      idUsuario
    } = req.body;

    // Validación
    if (!tituloCuento) {
      return res.status(400).json({ error: "El tituloCuento es obligatorio" });
    }

    const nuevoCuento = await prisma.cuentos.create({
      data: {
        tituloCuento,
        descripcion,
        urlPortada,
        edadRecomentada,
        idUsuario: idUsuario ? Number(idUsuario) : null
      }
    });

    return res.json({
      message: "Cuento creado correctamente",
      data: nuevoCuento
    });

  } catch (error) {
    console.error("Error crearCuento:", error);
    return res.status(500).json({ error: "Error al crear el cuento" });
  }
};

/**
 * PUT /api/cuentos/:id
 * Actualiza un cuento
 */
const actualizarCuento = async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { 
      tituloCuento, 
      descripcion, 
      urlPortada, 
      edadRecomentada,
      idUsuario
    } = req.body;

    const cuentoActualizado = await prisma.cuentos.update({
      where: { idCuento: idNum },
      data: {
        tituloCuento,
        descripcion,
        urlPortada,
        edadRecomentada,
        idUsuario
      }
    });

    return res.json({
      message: "Cuento actualizado correctamente",
      data: cuentoActualizado
    });

  } catch (error) {
    console.error("Error actualizarCuento:", error);
    return res.status(500).json({ error: "Error al actualizar el cuento" });
  }
};


/**
 * DELETE /api/cuentos/:id
 * Elimina un cuento
 */
const eliminarCuento = async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await prisma.cuentos.delete({
      where: { idCuento: idNum }
    });

    return res.json({
      message: "Cuento eliminado correctamente"
    });

  } catch (error) {
    console.error("Error eliminarCuento:", error);
    return res.status(500).json({ error: "Error al eliminar el cuento" });
  }
};


module.exports = {
  getCuentos,
  getCuentoPorId,
  crearCuento,
  actualizarCuento,
  eliminarCuento
};
