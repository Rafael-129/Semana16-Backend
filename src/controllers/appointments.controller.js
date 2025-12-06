const { Appointment, Doctor, User, Specialty } = require('../models');
const appointmentService = require('../services/appointment.service');
const responseUtil = require('../utils/response.util');
const APPOINTMENT_STATUS = require('../constants/appointmentStatus');

const appointmentController = {
  // Crear cita
  create: async (req, res) => {
    try {
      const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
      const patientId = req.user.id;

      if (!doctorId || !appointmentDate || !appointmentTime) {
        return responseUtil.error(res, 'Missing required fields', 400);
      }

      // Verificar disponibilidad
      const isAvailable = await appointmentService.checkAvailability(
        doctorId,
        appointmentDate,
        appointmentTime
      );

      if (!isAvailable) {
        return responseUtil.error(res, 'Time slot not available', 409);
      }

      const appointment = await Appointment.create({
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        reason,
        status: APPOINTMENT_STATUS.PENDING
      });

      return responseUtil.created(res, appointment, 'Appointment created successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Obtener todas las citas (según rol)
  getAll: async (req, res) => {
    try {
      const { role, id } = req.user;
      const { status } = req.query;

      let where = {};
      if (status) {
        where.status = status;
      }

      // Si es paciente, solo sus citas
      if (role === 'patient') {
        where.patientId = id;
      }

      // Si es doctor, obtener su doctorId y filtrar
      if (role === 'doctor') {
        const doctor = await Doctor.findOne({ where: { userId: id } });
        if (doctor) {
          where.doctorId = doctor.id;
        }
      }

      const appointments = await Appointment.findAll({
        where,
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'fullName', 'email', 'phone']
          },
          {
            model: Doctor,
            as: 'doctor',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'email', 'phone']
              },
              {
                model: Specialty,
                as: 'specialty',
                attributes: ['name', 'icon']
              }
            ]
          }
        ],
        order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
      });

      return responseUtil.success(res, appointments);
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Obtener cita por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'fullName', 'email', 'phone', 'dateOfBirth']
          },
          {
            model: Doctor,
            as: 'doctor',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'email', 'phone']
              },
              {
                model: Specialty,
                as: 'specialty'
              }
            ]
          }
        ]
      });

      if (!appointment) {
        return responseUtil.notFound(res, 'Appointment not found');
      }

      return responseUtil.success(res, appointment);
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Actualizar estado de cita
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return responseUtil.notFound(res, 'Appointment not found');
      }

      await appointment.update({ status });

      return responseUtil.success(res, appointment, 'Appointment status updated');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Cancelar cita
  cancel: async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return responseUtil.notFound(res, 'Appointment not found');
      }

      await appointment.update({ status: APPOINTMENT_STATUS.CANCELLED });

      return responseUtil.success(res, appointment, 'Appointment cancelled');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Obtener horarios disponibles
  getAvailableSlots: async (req, res) => {
    try {
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        return responseUtil.error(res, 'Doctor ID and date are required', 400);
      }

      const availableSlots = await appointmentService.getAvailableSlots(doctorId, date);

      return responseUtil.success(res, availableSlots);
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  }
};

module.exports = appointmentController;
