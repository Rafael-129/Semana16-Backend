const { User } = require('../models');
const authService = require('../services/auth.service');
const responseUtil = require('../utils/response.util');
const ROLES = require('../constants/roles');

const authController = {
  // Registrar nuevo usuario
  register: async (req, res) => {
    try {
      const { fullName, email, password, role, phone, dateOfBirth } = req.body;

      // Validar campos requeridos
      if (!fullName || !email || !password) {
        return responseUtil.error(res, 'Missing required fields', 400);
      }

      // Verificar si el email ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return responseUtil.error(res, 'Email already registered', 409);
      }

      // Crear usuario
      const user = await User.create({
        fullName,
        email,
        password,
        role: role || ROLES.PATIENT,
        phone,
        dateOfBirth
      });

      // Generar token
      const token = authService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return responseUtil.created(res, {
        user,
        token
      }, 'User registered successfully');

    } catch (error) {
      console.error('Register error:', error);
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar campos
      if (!email || !password) {
        return responseUtil.error(res, 'Email and password are required', 400);
      }

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return responseUtil.unauthorized(res, 'Invalid credentials');
      }

      // Verificar si está activo
      if (!user.isActive) {
        return responseUtil.forbidden(res, 'Account is deactivated');
      }

      // Comparar contraseña
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return responseUtil.unauthorized(res, 'Invalid credentials');
      }

      // Generar token
      const token = authService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return responseUtil.success(res, {
        user,
        token
      }, 'Login successful');

    } catch (error) {
      console.error('Login error:', error);
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Obtener perfil del usuario autenticado
  getProfile: async (req, res) => {
    try {
      return responseUtil.success(res, req.user, 'Profile retrieved successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Actualizar perfil
  updateProfile: async (req, res) => {
    try {
      const { fullName, phone, address, dateOfBirth } = req.body;
      
      await req.user.update({
        fullName: fullName || req.user.fullName,
        phone: phone || req.user.phone,
        address: address || req.user.address,
        dateOfBirth: dateOfBirth || req.user.dateOfBirth
      });

      return responseUtil.success(res, req.user, 'Profile updated successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  }
};

module.exports = authController;
