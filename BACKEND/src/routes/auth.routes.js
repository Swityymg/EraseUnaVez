const { Router } = require('express');
const { registerUsuario, loginUsuario } = require('../controllers/auth.controller');

const router = Router();

// POST /api/auth/register
router.post('/register', registerUsuario);

// POST /api/auth/login
router.post('/login', loginUsuario);

module.exports = router;
