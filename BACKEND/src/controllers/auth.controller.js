const prisma = require('../db/prisma');
const bcrypt = require('bcryptjs'); // bcrypt solo se necesita aquí

/**
 * Controlador para: POST /api/auth/register
 * Registrar un nuevo usuario en la base de datos.
 */
const registerUsuario = async (req, res) => {
  // Obtenemos los datos que envía React Native en el 'body' de la petición
  const { email, nombre, contrasena, nombreInfante } = req.body;

  // Verificación básica
  if (!email || !contrasena || !nombreInfante) {
    return res.status(400).json({ error: 'El email, la contraseña y el nombre de infante son obligatorios' });
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear el usuario en la BD
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        email: email,
        nombreTutor: nombre,
        contrase_a: hashedPassword,
        nombreInfante: nombreInfante,
      },
    });

    // Devolvemos el usuario creado (sin la contraseña)
    const { contrase_a, ...usuarioParaCliente } = nuevoUsuario;
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
 * Controlador para: POST /api/auth/login
 * Autenticación del usuario y acceso.
 */
const loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;

  // --- DEBUGGING ---
  console.log('--- NUEVO INTENTO DE LOGIN ---');
  console.log(`[Login Intento] Email recibido: ${email}`);
  console.log(`[Login Intento] Contraseña recibida: ${contrasena}`);
  // --- FIN DEBUGGING ---

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'El email y la contraseña son olbigatorios' });
  }
  try {
    // Buscar al usuario por su email
    const usuario = await prisma.usuarios.findUnique({
      where: { email: email },
    });

    if (!usuario) {
      // --- DEBUGGING ---
      console.log(`[Login Fallido] Usuario no encontrado con email: ${email}`);
      // --- FIN DEBUGGING ---
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // --- DEBUGGING ---
    console.log(`[Login Debug] Contraseña de req.body: ${contrasena}`);
    console.log(`[Login Debug] Hash de la BD: ${usuario.contrase_a}`);
    // --- FIN DEBUGGING ---

    // Comparar la contraseña enviada con la encriptada en la BD
    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrase_a);

    if (!esContrasenaValida) {
      // --- DEBUGGING ---
      console.log('[Login Fallido] bcrypt.compare retornó false. Contraseña incorrecta.');
      // --- FIN DEBUGGING ---
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Login Exitoso (sin devolver la contraseña)
    // --- DEBUGGING ---
    console.log(`[Login Éxito] Usuario ${email} autenticado correctamente.`);
    // --- FIN DEBUGGING ---
    const { contrase_a, ...usuarioParaCliente } = usuario;
    res.status(200).json({
      message: 'Login exitoso',
      usuario: usuarioParaCliente,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = {
  registerUsuario,
  loginUsuario,
};

