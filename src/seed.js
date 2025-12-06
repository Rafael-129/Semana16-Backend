const { User, Specialty, Doctor } = require('./models');
const ROLES = require('./constants/roles');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Crear especialidades
    const specialties = await Specialty.bulkCreate([
      { name: 'Cardiología', description: 'Especialidad del corazón', icon: '❤️' },
      { name: 'Pediatría', description: 'Especialidad infantil', icon: '👶' },
      { name: 'Neurología', description: 'Especialidad del cerebro', icon: '🧠' },
      { name: 'Dermatología', description: 'Especialidad de la piel', icon: '🩺' },
      { name: 'Traumatología', description: 'Especialidad de huesos', icon: '🦴' },
    ], { ignoreDuplicates: true });

    console.log('✅ Especialidades creadas');

    // Crear usuario administrador
    const admin = await User.findOne({ where: { email: 'admin@medicare.com' } });
    if (!admin) {
      await User.create({
        fullName: 'Administrador Sistema',
        email: 'admin@medicare.com',
        password: 'admin123',
        role: ROLES.ADMIN,
        phone: '999888777',
        isActive: true
      });
      console.log('✅ Usuario Admin creado: admin@medicare.com / admin123');
    }

    // Crear usuario paciente de prueba
    const patient = await User.findOne({ where: { email: 'paciente@test.com' } });
    if (!patient) {
      await User.create({
        fullName: 'Juan Paciente',
        email: 'paciente@test.com',
        password: 'paciente123',
        role: ROLES.PATIENT,
        phone: '987654321',
        dateOfBirth: '1990-01-15',
        isActive: true
      });
      console.log('✅ Usuario Paciente creado: paciente@test.com / paciente123');
    }

    // Crear usuario doctor
    const doctorUser = await User.findOne({ where: { email: 'doctor@test.com' } });
    let doctorUserCreated;
    
    if (!doctorUser) {
      doctorUserCreated = await User.create({
        fullName: 'Dr. Carlos Medina',
        email: 'doctor@test.com',
        password: 'doctor123',
        role: ROLES.DOCTOR,
        phone: '998877665',
        isActive: true
      });
      console.log('✅ Usuario Doctor creado: doctor@test.com / doctor123');
    } else {
      doctorUserCreated = doctorUser;
    }

    // Crear perfil de doctor
    const doctorProfile = await Doctor.findOne({ where: { userId: doctorUserCreated.id } });
    if (!doctorProfile && specialties.length > 0) {
      await Doctor.create({
        userId: doctorUserCreated.id,
        specialtyId: specialties[0].id, // Cardiología
        licenseNumber: 'MED-2024-001',
        experience: 10,
        bio: 'Especialista en cardiología con 10 años de experiencia',
        consultationFee: 150.00,
        rating: 4.8
      });
      console.log('✅ Perfil de Doctor creado');
    }

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Usuarios de prueba:');
    console.log('👤 Admin: admin@medicare.com / admin123');
    console.log('👤 Paciente: paciente@test.com / paciente123');
    console.log('👤 Doctor: doctor@test.com / doctor123\n');

  } catch (error) {
    console.error('❌ Error en seed:', error);
  }
};

module.exports = seedDatabase;
