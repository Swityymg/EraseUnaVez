const { PrismaClient } = require('@prisma/client');

// Se crea una única instancia de Prisma para toda la aplicación
const prisma = new PrismaClient();

module.exports = prisma;
