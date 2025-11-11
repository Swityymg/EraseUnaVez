// index.js
require("dotenv").config(); 

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const cuentosRoutes = require('./src/routes/cuentos.routes');
const authRoutes = require('./src/routes/auth.routes');
const iaRoutes = require('./src/routes/ia.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/static', express.static('img'));

// --- RUTAS DE API ---
app.use('/api/cuentos', cuentosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);

// --- Iniciar el servidor ---
// Escuchar en 0.0.0.0 para permitir conexiones desde la LAN / celular
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


console.log("API KEY CARGADA:", process.env.GEMINI_API_KEY);