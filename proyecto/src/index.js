require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Añadir el middleware cors
const prisma = require('./config/prisma'); // Import prisma client instance
const mainRouter = require('./routes'); // Import main router

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Permitir solicitudes desde el frontend
    credentials: true, // Para cookies y autenticación
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// API Routes
app.use('/api', mainRouter);

// Basic Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler (Mejorado)
app.use((err, req, res, next) => {
  console.error('ERROR ', err.stack); // Loguear siempre el stack para debug

  let statusCode = 500;
  let message = 'An unexpected error occurred';

  // Usar el status y mensaje de http-errors si está disponible
  if (err.status && err.message) {
    statusCode = err.status;
    message = err.message;
  }
  // Podrías añadir manejo específico para otros tipos de errores aquí si es necesario
  // else if (err instanceof Prisma.PrismaClientKnownRequestError) { ... }

  res.status(statusCode).json({
     message: message,
     // Opcional: solo mostrar detalles del error en desarrollo
     ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

const startServer = async () => {
  try {
    // Optional: Test DB connection on startup (Prisma handles connections lazily)
    // await prisma.$connect();
    // console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`Access API at http://localhost:${PORT}/api`);
      console.log(`CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1); // Exit if DB connection fails (optional)
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma Client disconnected.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Prisma Client disconnected.');
  process.exit(0);
});
