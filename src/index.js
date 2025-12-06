require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const corsOptions = require('./config/cors.config');
const errorHandler = require('./middleware/errorHandler.middleware');
const routes = require('./routes');
const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas principales
app.get('/', (req, res) => {
  res.json({ 
    message: '🏥 Medical Appointment API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      specialties: '/api/specialties'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Conectar a la base de datos e iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    // Ejecutar seed (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await seedDatabase();
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🏥 Medical Appointment System API`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
