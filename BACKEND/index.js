// Imports principales
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// Importar los enrutadores
const cuentosRoutes = require('./src/routes/cuentos.routes');
const authRoutes = require('./src/routes/auth.routes');
const iaRoutes = require('./src/routes/ia.routes');

// Inicialización
const app = express();
const PORT = process.env.PORT || 3001; 

// Middlewares (configuraciones que se ejecutan en cada petición)
app.use(cors()); 
app.use(express.json()); 

// --- RUTAS DE API ---
// Le decimos a Express que use los archivos de rutas con un prefijo
app.use('/api/cuentos', cuentosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);

// 4. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
