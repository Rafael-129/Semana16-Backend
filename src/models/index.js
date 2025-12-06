const User = require('./User.model');
const Doctor = require('./Doctor.model');
const Specialty = require('./Specialty.model');
const Appointment = require('./Appointment.model');

// Relaciones

// User - Doctor (1:1)
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Specialty - Doctor (1:N)
Specialty.hasMany(Doctor, { foreignKey: 'specialtyId', as: 'doctors' });
Doctor.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });

// User (Patient) - Appointment (1:N)
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

// Doctor - Appointment (1:N)
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = {
  User,
  Doctor,
  Specialty,
  Appointment
};
