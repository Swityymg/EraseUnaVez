const prisma = require('../db/prisma');
const bcrypt = require('bcryptjs');

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
const registerUsuario = async (req, res) => {
  const { email, nombre, contrasena, nombreInfante } = req.body;

  if (!email || !contrasena || !nombreInfante) {
    return res.status(400).json({
      error: 'El email, la contraseña y el nombre de infante son obligatorios',
    });
  }

  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        email: email,
        nombreTutor: nombre,
        contraseña: hashedPassword, // ← CORRECTO
        nombreInfante: nombreInfante,
      },
    });

    // No regresamos la contraseña
    const { contraseña, ...usuarioParaCliente } = nuevoUsuario;

    res.status(201).json(usuarioParaCliente);

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Este email ya está registrado' });
    }

    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

/**
 * POST /api/auth/login
 * Autenticación de usuario
 */
const loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;

  console.log('--- NUEVO INTENTO DE LOGIN ---');
  console.log(`[Login] Email: ${email}`);
  console.log(`[Login] Contraseña recibida: ${contrasena}`);

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'El email y la contraseña son obligatorios' });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { email: email },
    });

    if (!usuario) {
      console.log(`[Login] Usuario no encontrado`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log(`[Login Debug] Hash guardado: ${usuario.contrasena}`);

    // Comparar contraseñas
    const esContrasenaValida = (contrasena === usuario.contrasena); 
    if (!esContrasenaValida) {
      console.log('[Login] Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log(`[Login] Usuario autenticado: ${email}`);

    const { contrasena: passwordHash, ...usuarioParaCliente } = usuario;

    res.status(200).json({
      message: 'Login exitoso',
      usuario: usuarioParaCliente,
    });

  } catch (error) {
    console.error("ERROR DETALLADO LOGIN:", error);
    res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = {
  registerUsuario,
  loginUsuario,
};
