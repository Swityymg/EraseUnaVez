// Importamos el cliente de Prisma centralizado
const prisma = require('../db/prisma');

/**
 * Controlador para: GET /api/cuentos
 * Lista de todos los cuentos para el catálogo.
 */
const getCuentos = async (req, res) => {
  try {
    // Prisma busca en la BD
    const cuentos = await prisma.cuentos.findMany(); 
    
    // Devolvemos los cuentos como un JSON
    res.json(cuentos);

  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error al obtener los cuentos' });
  }
};

/**
 * Controlador para: GET /api/cuentos/:id
 * Cuento específico con todas sus páginas.
 */
const getCuentoById = async (req, res) => {
  const { id } = req.params;

  try {
    const cuento = await prisma.cuentos.findUnique({
      where: {
        id: parseInt(id) // Convertimos el id de texto a número
      },
      include: {
        paginas: true 
      }
    });

    if (!cuento) {
      // Si no se encuentra el cuento, dara el error 404
      return res.status(404).json({ error: 'Cuento no encontrado' });
    }

    res.json(cuento);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el cuento' });
  }
};

// Exportamos las funciones para usarlas en las rutas
module.exports = {
  getCuentos,
  getCuentoById
};
