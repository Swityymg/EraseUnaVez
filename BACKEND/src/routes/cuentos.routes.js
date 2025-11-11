// src/routes/cuentos.routes.js
const { Router } = require('express');
const router = Router();

// 1. Importamos las *funciones* desde el controlador
const { getCuentos, getCuentoPorId, crearCuento, actualizarCuento, eliminarCuento } = require('../controllers/cuentos.controller.js');

// 2. Definimos las rutas y les asignamos una función controladora
router.get('/', getCuentos);
router.get('/:id', getCuentoPorId);
router.post('/', crearCuento);
router.put('/:id', actualizarCuento);
router.delete('/:id', eliminarCuento);

module.exports = router;
