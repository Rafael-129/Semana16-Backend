const { Sequelize } = require('sequelize');

// Conexión a Supabase PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a Supabase PostgreSQL');
    
    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Tablas sincronizadas');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
