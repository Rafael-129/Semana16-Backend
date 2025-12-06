# Medical Appointment System - Backend API

API REST para sistema de citas médicas con Express.js y PostgreSQL (Supabase).

## 🚀 Características

- ✅ Autenticación JWT
- ✅ Gestión de usuarios (Admin, Doctor, Paciente)
- ✅ CRUD de doctores y especialidades
- ✅ Sistema de citas médicas
- ✅ Base de datos PostgreSQL (Supabase)
- ✅ Role-based access control
- ✅ Sequelize ORM

## 📦 Tecnologías

- Node.js (v18+)
- Express.js 4.18.2
- Sequelize 6.35.2 (ORM)
- PostgreSQL (Supabase)
- JWT Authentication (jsonwebtoken 9.0.2)
- bcryptjs 2.4.3
- CORS, Morgan

## 📋 Requisitos previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- PostgreSQL (Supabase cuenta gratuita)

## 🚀 Instalación Local

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (`.env`):
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=tu_secreto_jwt_muy_seguro
FRONTEND_URL=http://localhost:3000
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

## 🔧 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `NODE_ENV` | Entorno | `development` o `production` |
| `DATABASE_URL` | URL completa de PostgreSQL | `postgresql://user:pass@host:port/db` |
| `DB_HOST` | Host de la base de datos | `aws-0-us-west-2.pooler.supabase.com` |
| `DB_PORT` | Puerto de PostgreSQL | `6543` |
| `DB_NAME` | Nombre de la base de datos | `postgres` |
| `DB_USER` | Usuario de la base de datos | `postgres.xxx` |
| `DB_PASSWORD` | Contraseña de la base de datos | `tu_password` |
| `JWT_SECRET` | Clave secreta para JWT | `tu_secreto_muy_seguro` |
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:3000` |

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── config/              # Configuraciones
│   │   ├── database.js      # Sequelize + Supabase
│   │   ├── jwt.config.js    # JWT secret
│   │   └── cors.config.js   # CORS settings
│   ├── controllers/         # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── doctors.controller.js
│   │   ├── appointments.controller.js
│   │   └── specialties.controller.js
│   ├── models/              # Modelos Sequelize
│   │   ├── User.model.js
│   │   ├── Doctor.model.js
│   │   ├── Specialty.model.js
│   │   ├── Appointment.model.js
│   │   └── index.js         # Relaciones
│   ├── routes/              # Rutas de la API
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── doctors.routes.js
│   │   ├── appointments.routes.js
│   │   └── specialties.routes.js
│   ├── services/            # Lógica compleja
│   │   ├── auth.service.js
│   │   └── appointment.service.js
│   ├── middleware/          # Middleware personalizado
│   │   ├── auth.middleware.js
│   │   ├── roleCheck.middleware.js
│   │   └── errorHandler.middleware.js
│   ├── utils/               # Utilidades
│   │   └── response.util.js
│   ├── constants/           # Constantes
│   │   ├── roles.js
│   │   └── appointmentStatus.js
│   ├── seed.js              # Datos de prueba
│   └── index.js             # Punto de entrada
├── .env                     # Variables de entorno (no commitear)
├── .gitignore
├── package.json
├── render.yaml              # Configuración Render
└── README.md
```

## 🔌 Endpoints API

### Base
- `GET /` - Información de la API
- `GET /health` - Health check

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Doctores (`/api/doctors`)
- `GET /api/doctors` - Listar doctores (filtro por especialidad opcional)
- `GET /api/doctors/:id` - Obtener doctor por ID
- `POST /api/doctors` - Crear doctor (requiere auth + admin)
- `PUT /api/doctors/:id` - Actualizar doctor (requiere auth + admin)
- `DELETE /api/doctors/:id` - Eliminar doctor (requiere auth + admin)

### Citas (`/api/appointments`)
- `GET /api/appointments` - Listar citas del usuario (requiere auth)
- `GET /api/appointments/:id` - Obtener cita por ID (requiere auth)
- `POST /api/appointments` - Crear cita (requiere auth)
- `PUT /api/appointments/:id` - Actualizar cita (requiere auth)
- `PATCH /api/appointments/:id/cancel` - Cancelar cita (requiere auth)

### Especialidades (`/api/specialties`)
- `GET /api/specialties` - Listar especialidades
- `GET /api/specialties/:id` - Obtener especialidad por ID

## 👥 Usuarios de Prueba

El sistema incluye datos de prueba (seed):

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@medicare.com | admin123 |
| Doctor | doctor@test.com | doctor123 |
| Paciente | paciente@test.com | paciente123 |

## 🗄️ Base de Datos (PostgreSQL - Supabase)

### Tablas:
- `users` - Usuarios del sistema
- `doctors` - Información de doctores
- `specialties` - Especialidades médicas
- `appointments` - Citas médicas

### Relaciones:
- `users` (1:1) `doctors` - Un usuario doctor tiene un perfil
- `specialties` (1:N) `doctors` - Una especialidad tiene muchos doctores
- `users` (1:N) `appointments` - Un paciente tiene muchas citas
- `doctors` (1:N) `appointments` - Un doctor atiende muchas citas

## 📦 Dependencias principales

- `express` 4.18.2 - Framework web
- `sequelize` 6.35.2 - ORM para PostgreSQL
- `pg` 8.11.3 - Driver PostgreSQL
- `jsonwebtoken` 9.0.2 - Autenticación JWT
- `bcryptjs` 2.4.3 - Hash de contraseñas
- `dotenv` 16.3.1 - Variables de entorno
- `cors` 2.8.5 - Manejo de CORS
- `morgan` 1.10.0 - Logger HTTP

## 🌐 Deploy en Render

### Opción 1: Deploy Automático (recomendado)

1. **Push a GitHub**:
```bash
git add .
git commit -m "Preparado para deploy"
git push origin main
```

2. **Crear Web Service en Render**:
   - Ve a https://render.com
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: medicare-backend
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Configurar Variables de Entorno** en Render Dashboard:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://tu_supabase_url
   JWT_SECRET=tu_secreto_seguro
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

4. **Deploy**: Render despliega automáticamente

### Opción 2: Deploy con render.yaml

El archivo `render.yaml` está incluido para deploy automático.

### URL del Backend Desplegado:
```
https://medicare-backend.onrender.com
```

### Actualizar Frontend:
En tu frontend, actualiza `src/services/api.service.ts`:
```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://medicare-backend.onrender.com/api'
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Autenticación JWT con token bearer
- ✅ Validación de roles (admin, doctor, patient)
- ✅ CORS configurado para frontend específico
- ✅ Variables de entorno para secretos
- ✅ Manejo global de errores

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
