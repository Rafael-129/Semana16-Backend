const { Doctor, User, Specialty, Appointment } = require('../models');
const responseUtil = require('../utils/response.util');
const bcrypt = require('bcryptjs');

const doctorController = {
  // Crear doctor completo (Usuario + Perfil) - Admin only
  createComplete: async (req, res) => {
    try {
      const { 
        fullName, 
        email, 
        phone,
        specialtyId, 
        licenseNumber, 
        experience, 
        bio, 
        consultationFee 
      } = req.body;

      // Validar campos requeridos
      if (!fullName || !email || !specialtyId || !licenseNumber) {
        return responseUtil.error(res, 'Faltan campos requeridos: fullName, email, specialtyId, licenseNumber', 400);
      }

      // Verificar que el email no exista
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return responseUtil.error(res, 'El email ya está registrado', 400);
      }

      // Verificar que la especialidad exista
      const specialty = await Specialty.findByPk(specialtyId);
      if (!specialty) {
        return responseUtil.error(res, 'Especialidad no encontrada', 404);
      }

      // Generar contraseña por defecto (puede cambiarla después)
      const defaultPassword = 'Doctor123!';

      // Crear usuario con rol doctor (el hook beforeCreate hasheará la contraseña)
      const user = await User.create({
        fullName,
        email,
        password: defaultPassword, // Se enviará en texto plano y el hook la hasheará
        phone,
        role: 'doctor'
      });

      // Crear perfil de doctor
      const doctor = await Doctor.create({
        userId: user.id,
        specialtyId,
        licenseNumber,
        experience: experience || 0,
        bio: bio || `Especialista en ${specialty.name}`,
        consultationFee: consultationFee || 100,
        rating: 0
      });

      // Obtener doctor completo con relaciones
      const doctorComplete = await Doctor.findByPk(doctor.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'email', 'phone', 'role']
          },
          {
            model: Specialty,
            as: 'specialty'
          }
        ]
      });

      return responseUtil.created(res, {
        doctor: doctorComplete,
        credentials: {
          email,
          defaultPassword: defaultPassword,
          message: 'El doctor debe cambiar esta contraseña en su primer inicio de sesión'
        }
      }, 'Doctor creado exitosamente');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Obtener todos los doctores
  getAll: async (req, res) => {
    try {
      const { specialtyId } = req.query;
      
      const where = {};
      if (specialtyId) {
        where.specialtyId = specialtyId;
      }

      const doctors = await Doctor.findAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'email', 'phone']
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: ['id', 'name', 'icon']
          }
        ],
        order: [['rating', 'DESC']]
      });

      return responseUtil.success(res, doctors);
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Obtener doctor por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'email', 'phone']
          },
          {
            model: Specialty,
            as: 'specialty'
          }
        ]
      });

      if (!doctor) {
        return responseUtil.notFound(res, 'Doctor not found');
      }

      return responseUtil.success(res, doctor);
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Crear perfil de doctor (Admin only)
  create: async (req, res) => {
    try {
      const { userId, specialtyId, licenseNumber, experience, bio, consultationFee } = req.body;

      if (!userId || !specialtyId || !licenseNumber) {
        return responseUtil.error(res, 'Missing required fields', 400);
      }

      const doctor = await Doctor.create({
        userId,
        specialtyId,
        licenseNumber,
        experience,
        bio,
        consultationFee
      });

      // Actualizar rol del usuario a doctor
      await User.update({ role: 'doctor' }, { where: { id: userId } });

      return responseUtil.created(res, doctor, 'Doctor created successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Actualizar doctor
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { specialtyId, licenseNumber, experience, bio, consultationFee } = req.body;

      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        return responseUtil.notFound(res, 'Doctor not found');
      }

      await doctor.update({
        specialtyId: specialtyId || doctor.specialtyId,
        licenseNumber: licenseNumber || doctor.licenseNumber,
        experience: experience !== undefined ? experience : doctor.experience,
        bio: bio || doctor.bio,
        consultationFee: consultationFee !== undefined ? consultationFee : doctor.consultationFee
      });

      return responseUtil.success(res, doctor, 'Doctor updated successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Eliminar doctor
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        return responseUtil.notFound(res, 'Doctor not found');
      }

      await doctor.destroy();

      return responseUtil.success(res, null, 'Doctor deleted successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  }
};

module.exports = doctorController;
