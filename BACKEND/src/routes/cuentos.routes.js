const { Router } = require('express');
const { getCuentos, getCuentoById } = require('../controllers/cuentos.controller');

const router = Router();

// GET /api/cuentos/
router.get('/', getCuentos);

// GET /api/cuentos/:id
router.get('/:id', getCuentoById);

module.exports = router;
