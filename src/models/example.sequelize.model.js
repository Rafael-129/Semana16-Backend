// Ejemplo de modelo con Sequelize (PostgreSQL)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgresql.config');

const Example = sequelize.define('Example', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  tableName: 'examples'
});

module.exports = Example;
