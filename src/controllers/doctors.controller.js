const { Doctor, User, Specialty, Appointment } = require('../models');
const responseUtil = require('../utils/response.util');

const doctorController = {
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
