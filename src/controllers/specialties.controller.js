const { Specialty } = require('../models');
const responseUtil = require('../utils/response.util');

const specialtyController = {
  // Obtener todas las especialidades
  getAll: async (req, res) => {
    try {
      const specialties = await Specialty.findAll({
        order: [['name', 'ASC']]
      });

      return responseUtil.success(res, specialties);
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Crear especialidad
  create: async (req, res) => {
    try {
      const { name, description, icon } = req.body;

      if (!name) {
        return responseUtil.error(res, 'Name is required', 400);
      }

      const specialty = await Specialty.create({
        name,
        description,
        icon
      });

      return responseUtil.created(res, specialty, 'Specialty created successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Actualizar especialidad
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, icon } = req.body;

      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        return responseUtil.notFound(res, 'Specialty not found');
      }

      await specialty.update({ name, description, icon });

      return responseUtil.success(res, specialty, 'Specialty updated successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  },

  // Eliminar especialidad
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        return responseUtil.notFound(res, 'Specialty not found');
      }

      await specialty.destroy();

      return responseUtil.success(res, null, 'Specialty deleted successfully');
    } catch (error) {
      return responseUtil.error(res, error.message, 500);
    }
  }
};

module.exports = specialtyController;
