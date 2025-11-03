// src/routes/cuentos.routes.js
const { Router } = require('express');
const router = Router();

// 1. Importamos las *funciones* (la lógica) desde el controlador
const { getCuentos, getCuentoPorId } = require('../controllers/cuentos.controller.js');

// 2. Definimos las rutas y les asignamos una función controladora
router.get('/', getCuentos);
router.get('/:id', getCuentoPorId);

module.exports = router;
