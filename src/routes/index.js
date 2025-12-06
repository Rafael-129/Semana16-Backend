const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const doctorRoutes = require('./doctors.routes');
const appointmentRoutes = require('./appointments.routes');
const specialtyRoutes = require('./specialties.routes');

// Usar rutas
router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/specialties', specialtyRoutes);

module.exports = router;
