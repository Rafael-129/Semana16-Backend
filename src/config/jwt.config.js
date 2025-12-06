const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = '7d';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN
};
