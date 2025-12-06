const authService = require('../services/auth.service');
const { User } = require('../models');
const responseUtil = require('../utils/response.util');

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseUtil.unauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return responseUtil.unauthorized(res, 'Invalid or expired token');
    }

    // Buscar usuario
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return responseUtil.unauthorized(res, 'User not found or inactive');
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    return responseUtil.error(res, 'Authentication error', 500);
  }
};

module.exports = authMiddleware;
