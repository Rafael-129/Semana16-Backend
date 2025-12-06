const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctors.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');
const ROLES = require('../constants/roles');

// Rutas públicas
router.get('/', doctorController.getAll);
router.get('/:id', doctorController.getById);

// Rutas protegidas (Admin only)
router.post('/complete', authMiddleware, roleCheck(ROLES.ADMIN), doctorController.createComplete);
router.post('/', authMiddleware, roleCheck(ROLES.ADMIN), doctorController.create);
router.put('/:id', authMiddleware, roleCheck(ROLES.ADMIN), doctorController.update);
router.delete('/:id', authMiddleware, roleCheck(ROLES.ADMIN), doctorController.delete);

module.exports = router;
