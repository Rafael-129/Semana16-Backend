# Backend - Express API

Este es el backend del proyecto desarrollado con Express.js

## 📋 Requisitos previos

- Node.js (v16 o superior)
- npm o yarn
- MongoDB o PostgreSQL (según tu elección)

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

3. Iniciar el servidor:

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, etc)
│   ├── controllers/     # Controladores
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware personalizado
│   └── index.js         # Punto de entrada
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore
└── package.json
```

## 🔌 Endpoints disponibles

### Base
- `GET /` - Información de la API
- `GET /health` - Health check

### Examples (CRUD ejemplo)
- `GET /api/examples` - Listar todos
- `GET /api/examples/:id` - Obtener por ID
- `POST /api/examples` - Crear nuevo
- `PUT /api/examples/:id` - Actualizar
- `DELETE /api/examples/:id` - Eliminar

## 🗄️ Base de datos

El proyecto incluye configuración para:
- **MongoDB** con Mongoose
- **PostgreSQL** con Sequelize

Descomenta la configuración que necesites en `src/index.js`

## 📦 Dependencias principales

- `express` - Framework web
- `dotenv` - Variables de entorno
- `cors` - Manejo de CORS
- `morgan` - Logger HTTP
- `mongoose` - ODM para MongoDB
- `sequelize` - ORM para PostgreSQL

## 🛠️ Desarrollo

Para desarrollo, usa:
```bash
npm run dev
```

Esto iniciará el servidor con nodemon, reiniciando automáticamente cuando detecte cambios.

## 🌐 Deploy

El servidor está listo para desplegarse en:
- Render
- Railway
- Heroku
- Vercel
- AWS
- Google Cloud
- Azure

Asegúrate de configurar las variables de entorno en tu plataforma de deploy.
