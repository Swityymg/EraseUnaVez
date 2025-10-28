const { Router } = require('express');
// Importa la función desde el *controlador*
const { generarCuentoIA } = require('../controllers/ia.controller');

const router = Router();

// Esta es la línea 7 u 8.
// Aquí se *usa* la función 'generarCuentoIA'
router.post('/generar-cuento', generarCuentoIA);

module.exports = router;

