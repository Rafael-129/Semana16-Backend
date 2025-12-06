const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialties.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');
const ROLES = require('../constants/roles');

// Ruta pública
router.get('/', specialtyController.getAll);

// Rutas protegidas (Admin only)
router.post('/', authMiddleware, roleCheck(ROLES.ADMIN), specialtyController.create);
router.put('/:id', authMiddleware, roleCheck(ROLES.ADMIN), specialtyController.update);
router.delete('/:id', authMiddleware, roleCheck(ROLES.ADMIN), specialtyController.delete);

module.exports = router;
