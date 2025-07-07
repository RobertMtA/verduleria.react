# 🥬 Verdulería Online - E-commerce React Full-Stack

[![Netlify Status](https://api.netlify.com/api/v1/badges/12345678-1234-1234-1234-123456789012/deploy-status)](https://verduleria-online-frontend.netlify.app)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)

## 🌟 **Demo en Vivo**

- **🌐 Frontend:** [https://verduleria-react.vercel.app](https://verduleria-react.vercel.app)
- **⚙️ Backend API:** [https://verduleria-backend-m19n.onrender.com](https://verduleria-backend-m19n.onrender.com)
- **🔧 API Backend:** [https://verduleria-backend-m19n.onrender.com](https://verduleria-backend-m19n.onrender.com)

## 📋 **Descripción**

E-commerce completo para venta de frutas y verduras desarrollado con **React 18** y **Node.js**. Incluye sistema de autenticación JWT, panel administrativo completo, carrito de compras persistente y diseño 100% responsive.

## ⚡ **Características Principales**

### 🛒 **Para Usuarios**
- Catálogo de productos con búsqueda y filtros
- Carrito de compras persistente
- Sistema de registro y autenticación
- Proceso de checkout completo
- Historial de pedidos

### 👨‍💼 **Para Administradores**
- Dashboard con estadísticas en tiempo real
- CRUD completo de productos con imágenes
- Gestión de pedidos y usuarios
- Reportes y analytics
- Sistema de roles y permisos

## 🚀 **Tecnologías**

### Frontend
```json
{
  "framework": "React 18",
  "routing": "React Router DOM",
  "state": "Context API + Hooks",
  "ui": "Material-UI + Bootstrap 5",
  "build": "Vite",
  "deploy": "Netlify"
}
```

### Backend
```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "MongoDB Atlas",
  "auth": "JWT",
  "deploy": "Render"
}
```

## 🏗️ **Arquitectura**

```
Frontend (React)     ←→     Backend (Express)     ←→     Database (MongoDB)
    Netlify                      Render                    Atlas
```

## 📱 **Responsive Design**

- ✅ **Mobile First** approach
- ✅ **Touch-friendly** interfaces (44px minimum targets)
- ✅ **Adaptive layouts** para tablets y móviles
- ✅ **Optimized images** para diferentes densidades
- ✅ **Progressive enhancement**

## 🛠️ **Instalación**

### Prerrequisitos
```bash
node --version  # 16.0+
npm --version   # 7.0+
```

### Frontend
```bash
# Clonar repositorio
git clone https://github.com/RobertMtA/verduleria.react.git
cd verduleria-react-main

# Instalar dependencias
npm install

# Variables de entorno
echo "VITE_API_URL=http://localhost:5000" > .env

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
```

### Backend
```bash
# Navegar al backend
cd backend

# Instalar dependencias
npm install

# Variables de entorno
echo "MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000" > .env

# Ejecutar servidor
npm start
```

## 📁 **Estructura del Proyecto**

```
src/
├── 🧩 components/          # Componentes reutilizables
│   ├── ProductCard.jsx     # Tarjeta de producto
│   ├── ProductList.jsx     # Lista de productos
│   └── estaticos/          # Header, Footer
├── 📄 pages/               # Páginas principales
│   ├── Home.jsx           # Página inicial
│   ├── Products.jsx       # Catálogo
│   ├── Cart.jsx           # Carrito
│   └── admin/             # Panel admin
├── 🎯 context/            # Context API
│   ├── AuthContext.jsx    # Autenticación
│   └── CartContext.jsx    # Carrito
├── 🪝 hooks/              # Custom Hooks
├── 🎨 styles/             # CSS responsivo
└── 📡 services/           # API calls
```

## 🔑 **Características Técnicas**

### Hooks Utilizados
- `useState` - Estado local de componentes
- `useEffect` - Efectos y ciclo de vida
- `useContext` - Consumo de contextos globales
- `useNavigate` - Navegación programática
- Custom hooks para lógica reutilizable

### Patrones de Diseño
- **Context API** para estado global
- **Compound Components** para flexibilidad
- **Render Props** para lógica compartida
- **Higher-Order Components** para reutilización

### Optimizaciones
- **Lazy loading** de rutas y componentes
- **Memoización** con `React.memo`
- **Debouncing** en búsquedas
- **Bundle splitting** automático

## 🔐 **Autenticación & Seguridad**

```javascript
// JWT Flow
Login → Token → LocalStorage → API Headers → Protected Routes
```

- **JWT tokens** con expiración
- **Role-based access control**
- **Password hashing** con bcrypt
- **Input validation** frontend y backend

## 📊 **Esquemas de Base de Datos**

### Usuario
```javascript
{
  nombre: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'admin'],
  fechaRegistro: Date
}
```

### Producto
```javascript
{
  nombre: String,
  precio: Number,
  categoria: String,
  stock: Number,
  imagen: String,
  activo: Boolean
}
```

### Pedido
```javascript
{
  usuario: Object,
  productos: [ProductoItem],
  total: Number,
  estado: ['pendiente', 'completado'],
  fecha: Date
}
```

## 🚀 **Scripts Disponibles**

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
npm run format       # Formateo automático
```

## 📝 **API Endpoints**

### Públicos
```http
GET    /api/productos          # Listar productos
POST   /api/register          # Registro de usuario
POST   /api/login             # Login
```

### Protegidos
```http
GET    /api/perfil            # Perfil de usuario
POST   /api/pedidos           # Crear pedido
GET    /api/pedidos           # Historial
```

### Admin
```http
GET    /api/admin/usuarios    # Gestión de usuarios
POST   /api/admin/productos   # Crear producto
GET    /api/admin/reportes    # Analytics
```

## 👨‍💻 **Desarrollador**

**Proyecto desarrollado como entrega final del curso de React**

---

⭐ **¡Si te gustó el proyecto, dale una estrella!**
# Force Netlify redeploy 07/01/2025 02:54:58
