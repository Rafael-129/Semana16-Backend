// Controlador de ejemplo
const exampleController = {
  // GET /api/examples
  getAll: async (req, res) => {
    try {
      // Aquí conectarías con tu base de datos
      const examples = [
        { id: 1, name: 'Ejemplo 1', description: 'Descripción 1' },
        { id: 2, name: 'Ejemplo 2', description: 'Descripción 2' },
        { id: 3, name: 'Ejemplo 3', description: 'Descripción 3' }
      ];
      
      res.json({
        success: true,
        data: examples
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /api/examples/:id
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Aquí buscarías en tu base de datos
      const example = { id, name: `Ejemplo ${id}`, description: `Descripción del ejemplo ${id}` };
      
      if (!example) {
        return res.status(404).json({
          success: false,
          error: 'Elemento no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: example
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /api/examples
  create: async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos'
        });
      }
      
      // Aquí guardarías en tu base de datos
      const newExample = { 
        id: Date.now(), 
        name, 
        description,
        createdAt: new Date()
      };
      
      res.status(201).json({
        success: true,
        data: newExample
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // PUT /api/examples/:id
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      // Aquí actualizarías en tu base de datos
      const updatedExample = { 
        id, 
        name, 
        description,
        updatedAt: new Date()
      };
      
      res.json({
        success: true,
        data: updatedExample
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // DELETE /api/examples/:id
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Aquí eliminarías de tu base de datos
      
      res.json({
        success: true,
        message: 'Elemento eliminado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = exampleController;
