const { Appointment, Doctor, User } = require('../models');
const { Op } = require('sequelize');

const appointmentService = {
  // Verificar si el horario está disponible
  checkAvailability: async (doctorId, appointmentDate, appointmentTime) => {
    const existing = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    return !existing; // true si está disponible
  },

  // Obtener horarios disponibles de un doctor en una fecha
  getAvailableSlots: async (doctorId, date) => {
    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate: date,
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: ['appointmentTime']
    });

    const busySlots = appointments.map(apt => apt.appointmentTime);
    
    // Horarios estándar (8:00 AM - 5:00 PM)
    const allSlots = [
      '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    return allSlots.filter(slot => !busySlots.includes(slot));
  }
};

module.exports = appointmentService;
