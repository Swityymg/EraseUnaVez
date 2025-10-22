// Imports
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Inicialización
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001; 

// configuraciones que se ejecutan en cada petición)
app.use(cors()); 
app.use(express.json()); 




// ---  RUTAS DE API ---



// 4. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

/**
 * RUTA: GET /api/cuentos
 * Lista de todos los cuentos para el catálogo.
 */
app.get('/api/cuentos', async (req, res) => {
  try {
    // Prisma busca en la BD
    const cuentos = await prisma.cuentos.findMany(); 
    
    // Devolvemos los cuentos como un JSON
    res.json(cuentos);

  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error al obtener los cuentos' });
  }
});


/**
 * RUTA: GET /api/cuentos/:id
 * Cuento específico con todas sus páginas.
 */
app.get('/api/cuentos/:id', async (req, res) => {
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
});

/**
 * RUTA: POST /api/auth/register
 * Registrar un nuevo usuario en la base de datos.
 */

app.post('/api/auth/register', async (req, res) => {
  // Obtenemos los datos que envía React Native en el 'body' de la petición
  const { email, nombre, contrasena, nombreInfante } = req.body;

  // Verificación básica
  if (!email || !contrasena || !nombreInfante) {
    return res.status(400).json({ error: 'El email, la contraseña y el nombre de infante son obligatorios' });
  }

  try {
    // Encriptar la contraseña
    // 'bcrypt.hash' crea un "hash" seguro. El '10' es el "costo" (qué tan fuerte es).
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear el usuario en la BD usando el nombre de tu modelo
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        email: email,
        nombreTutor: nombre,
        contrase_a: hashedPassword, 
        nombreInfante: nombreInfante
      },
    });

    // Devolvyelve el usuario creado 
    const { contrase_a, ...usuarioParaCliente } = nuevoUsuario;
    res.status(201).json(usuarioParaCliente);

  } catch (error) {
    // Código 'P2002' es el error de Prisma para "campo único duplicado"
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Este email ya está registrado' });
    }
    // Otro error
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

/**
 * RUTA: POST /api/auth/login
 * Autenticación del usuario y acceso.
 */

app.post('/api/auth/login', async (req, res) => {
    const {email, contrasena } =req.body;
    
    if (!email || !contrasena){
        return res.status(400).json({error: 'El email y la contraseña son olbigatorios'});
    }
    try {
    // Buscar al usuario por su email
    const usuario = await prisma.usuarios.findUnique({
      where: { email: email },
    });

    // Si no se encuentra el usuario
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // 401 = No autorizado
    }

    //Comparar la contraseña enviada con la encriptada en la BD
    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrase_a);

    // Si las contraseñas no coinciden
    if (!esContrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Login
    // (Aqui se crea un "Token")
    const { contrase_a, ...usuarioParaCliente } = usuario;
    res.status(200).json({
      message: 'Login exitoso',
      usuario: usuarioParaCliente,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
});




/**
 * RUTA: POST /api/ia/generar-cuento
 * OBJETIVO: Generar un cuento nuevo con IA y guardarlo en la BD
 */

app.post('/api/ia/generar-cuento', async (req, res) => {
  const { prompt, usuarioId } = req.body; // Recibes el prompt y quién lo creó

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es obligatorio' });
  }

  try {
    // Llama a la API de Gemini para generar el texto
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // O el modelo que especificaste 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoDelCuento = response.text();

    // (Aquí también llamarías a la API de imágenes y TTS si lo deseas )

    // Guarda el nuevo cuento en tu base de datos
    
    const nuevoCuento = await prisma.cuentos.create({
      data: {
        titulo: `Cuento sobre ${prompt.substring(0, 20)}...`,
        descripcion: textoDelCuento.substring(0, 100),
      },
    });

    // Responde a React Native con el cuento creado
    res.status(201).json(nuevoCuento);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el cuento con GEMINI' });
  }
});

