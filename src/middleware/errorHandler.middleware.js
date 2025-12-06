const responseUtil = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de Sequelize (validación)
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return responseUtil.error(res, 'Validation error', 400, errors);
  }

  // Error de Sequelize (unique constraint)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return responseUtil.error(res, 'Resource already exists', 409);
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return responseUtil.error(
    res, 
    message, 
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = errorHandler;
