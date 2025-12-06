const responseUtil = require('../utils/response.util');

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return responseUtil.unauthorized(res, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return responseUtil.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

module.exports = roleCheck;
