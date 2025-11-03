const { Router } = require('express');
const { generarCuentoIA } = require('../controllers/ia.controller');

const router = Router();

// Ruta principal para generar cuentos
router.post('/generar-cuento', generarCuentoIA);

module.exports = router;
