const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointments.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', appointmentController.create);
router.get('/', appointmentController.getAll);
router.get('/available-slots', appointmentController.getAvailableSlots);
router.get('/:id', appointmentController.getById);
router.patch('/:id/status', appointmentController.updateStatus);
router.patch('/:id/cancel', appointmentController.cancel);

module.exports = router;
