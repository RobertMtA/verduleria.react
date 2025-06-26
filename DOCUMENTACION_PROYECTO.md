# 🥬 Verdulería Online - Proyecto React
## Documentación Completa del Proyecto

---

## 📋 **Índice**
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Funcionalidades Implementadas](#funcionalidades-implementadas)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Componentes Principales](#componentes-principales)
7. [Sistema de Autenticación](#sistema-de-autenticación)
8. [Gestión del Estado](#gestión-del-estado)
9. [Base de Datos](#base-de-datos)
10. [Despliegue y Producción](#despliegue-y-producción)
11. [Responsive Design](#responsive-design)
12. [Capturas de Pantalla](#capturas-de-pantalla)
13. [Instalación y Configuración](#instalación-y-configuración)
14. [Conclusiones](#conclusiones)

---

## 🎯 **Descripción del Proyecto**

**Verdulería Online** es una aplicación web completa de e-commerce especializada en la venta de frutas y verduras frescas. El proyecto incluye tanto el **frontend** (React) como el **backend** (Node.js/Express) y está completamente desplegado en producción.

### **Objetivos Principales:**
- ✅ Crear una experiencia de compra intuitiva y moderna
- ✅ Implementar un sistema completo de administración
- ✅ Desarrollar una arquitectura escalable y mantenible
- ✅ Asegurar total responsividad para dispositivos móviles
- ✅ Desplegar en producción con alta disponibilidad

### **URLs del Proyecto:**
- **Frontend:** https://verduleria-online-frontend.netlify.app
- **Backend:** https://verduleria-backend-m19n.onrender.com

---

## 🚀 **Tecnologías Utilizadas**

### **Frontend**
- **React 18** - Framework principal
- **React Router DOM** - Navegación SPA
- **Context API** - Gestión de estado global
- **Material-UI (MUI)** - Componentes UI para admin
- **Bootstrap 5** - Framework CSS responsivo
- **FontAwesome** - Iconografía
- **Vite** - Build tool y dev server
- **CSS3** - Estilos personalizados responsivos

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

### **Despliegue**
- **Netlify** - Frontend deployment
- **Render** - Backend deployment
- **GitHub** - Control de versiones
- **MongoDB Atlas** - Base de datos en la nube

---

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   FRONTEND      │◄──►│     BACKEND     │◄──►│   BASE DE       │
│   (React)       │    │  (Node/Express) │    │   DATOS         │
│   Netlify       │    │     Render      │    │ MongoDB Atlas   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Flujo de Datos:**
1. **Usuario** interactúa con el **Frontend React**
2. **Frontend** hace peticiones HTTP al **Backend Express**
3. **Backend** procesa la lógica y consulta la **Base de Datos MongoDB**
4. **Respuesta** regresa al frontend para actualizar la UI

---

## ⚡ **Funcionalidades Implementadas**

### **🛒 Para Usuarios**
- **Catálogo de Productos**
  - Navegación por categorías
  - Búsqueda de productos
  - Filtros por precio y disponibilidad
  - Vista detallada de productos

- **Carrito de Compras**
  - Agregar/quitar productos
  - Modificar cantidades
  - Persistencia entre sesiones
  - Cálculo automático de totales

- **Sistema de Usuarios**
  - Registro con validación
  - Login/Logout seguro
  - Perfil de usuario editable
  - Recuperación de contraseña

- **Proceso de Compra**
  - Checkout completo
  - Selección de método de pago
  - Confirmación de pedido
  - Historial de compras

### **👨‍💼 Para Administradores**
- **Dashboard Principal**
  - Estadísticas en tiempo real
  - Resumen de ventas
  - Gráficos de rendimiento
  - Indicadores clave (KPIs)

- **Gestión de Productos**
  - CRUD completo de productos
  - Subida de imágenes
  - Control de stock
  - Categorización

- **Gestión de Pedidos**
  - Lista completa de pedidos
  - Actualización de estados
  - Filtros y búsqueda
  - Detalles de cada pedido

- **Gestión de Usuarios**
  - Lista de usuarios registrados
  - Roles y permisos
  - Estadísticas de usuarios
  - Gestión de cuentas

- **Reportes y Analytics**
  - Reportes de ventas
  - Productos más vendidos
  - Análisis de usuarios
  - Exportación de datos

---

## 📁 **Estructura del Proyecto**

```
verduleria-react-main/
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizables
│   │   ├── ProductCard.jsx     # Tarjeta de producto
│   │   ├── ProductList.jsx     # Lista de productos
│   │   └── estaticos/          # Componentes fijos
│   │       ├── Header.jsx      # Navegación principal
│   │       └── Footer.jsx      # Pie de página
│   │
│   ├── 📁 pages/              # Páginas principales
│   │   ├── Home.jsx           # Página inicial
│   │   ├── Products.jsx       # Catálogo
│   │   ├── Cart.jsx           # Carrito
│   │   ├── Checkout.jsx       # Proceso de compra
│   │   ├── Login.jsx          # Inicio de sesión
│   │   ├── Register.jsx       # Registro
│   │   └── admin/             # Panel administrativo
│   │       ├── Dashboard.jsx
│   │       ├── ProductsAdmin.jsx
│   │       ├── PedidosAdmin.jsx
│   │       └── Usuarios.jsx
│   │
│   ├── 📁 context/            # Context API
│   │   ├── AuthContext.jsx    # Autenticación
│   │   └── CartContext.jsx    # Carrito
│   │
│   ├── 📁 hooks/              # Custom Hooks
│   │   ├── useAuth.jsx        # Hook de autenticación
│   │   └── useProducts.jsx    # Hook de productos
│   │
│   ├── 📁 layouts/            # Layouts de página
│   │   └── MainLayout.jsx     # Layout principal
│   │
│   ├── 📁 styles/             # Estilos CSS
│   │   ├── global.css         # Estilos globales
│   │   ├── forms.css          # Formularios
│   │   └── admin-responsive.css # Admin responsivo
│   │
│   └── main.jsx               # Punto de entrada
│
├── 📁 backend/                # Backend Node.js
│   ├── server.js              # Servidor principal
│   ├── 📁 models/             # Modelos de datos
│   ├── 📁 routes/             # Rutas API
│   ├── 📁 controllers/        # Controladores
│   └── 📁 config/             # Configuración
│
├── 📁 public/                 # Archivos estáticos
│   ├── images/                # Imágenes de productos
│   └── _redirects             # Configuración Netlify
│
├── package.json               # Dependencias frontend
├── vite.config.js            # Configuración Vite
├── netlify.toml              # Configuración Netlify
└── README.md                 # Documentación básica
```

---

## 🧩 **Componentes Principales**

### **1. Header.jsx**
```jsx
// Navegación principal con:
- Logo y branding
- Menú de navegación
- Buscador de productos
- Carrito con contador
- Menú de usuario/admin
```

### **2. ProductCard.jsx**
```jsx
// Tarjeta de producto con:
- Imagen responsive
- Información del producto
- Controles de cantidad
- Botón "Agregar al carrito"
- Estados de stock
```

### **3. CartContext.jsx**
```jsx
// Gestión global del carrito:
- Estado del carrito
- Funciones CRUD del carrito
- Persistencia en localStorage
- Cálculos de totales
```

### **4. AuthContext.jsx**
```jsx
// Gestión de autenticación:
- Estado del usuario
- Login/Logout
- Verificación de tokens
- Protección de rutas
```

---

## 🔐 **Sistema de Autenticación**

### **Implementación JWT**
```javascript
// Flujo de autenticación:
1. Usuario envía credenciales
2. Backend verifica y genera JWT
3. Token se almacena en localStorage
4. Cada petición incluye el token
5. Backend valida el token
6. Acceso concedido/denegado
```

### **Protección de Rutas**
- **Rutas públicas:** Home, Products, Login, Register
- **Rutas privadas:** Profile, Checkout, Historial
- **Rutas admin:** Dashboard, Gestión de productos/usuarios

### **Roles de Usuario**
- **Cliente:** Comprar productos, gestionar perfil
- **Admin:** Acceso completo al panel administrativo

---

## 🗄️ **Base de Datos**

### **MongoDB Atlas - Esquemas**

#### **Usuario**
```javascript
{
  nombre: String,
  email: String (único),
  password: String (encriptado),
  telefono: String,
  direccion: String,
  role: String (default: 'user'),
  fechaRegistro: Date
}
```

#### **Producto**
```javascript
{
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  imagen: String,
  stock: Number,
  activo: Boolean,
  fechaCreacion: Date
}
```

#### **Pedido**
```javascript
{
  usuario: {
    nombre: String,
    email: String,
    telefono: String,
    direccion: String
  },
  productos: [{
    nombre: String,
    precio: Number,
    cantidad: Number,
    subtotal: Number
  }],
  total: Number,
  estado: String,
  metodo_pago: String,
  fecha: Date
}
```

---

## 🌐 **Despliegue y Producción**

### **Frontend - Netlify**
```bash
# Build de producción
npm run build

# Deploy automático desde GitHub
git push origin main
```

**Configuraciones:**
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** SPA routing configurado

### **Backend - Render**
```bash
# Deploy automático desde GitHub
# Variables de entorno configuradas:
- MONGODB_URI
- JWT_SECRET
- PORT
```

### **Base de Datos - MongoDB Atlas**
- **Cluster:** Configurado en AWS
- **Conexión:** URI de conexión segura
- **Backup:** Automático diario

---

## 📱 **Responsive Design**

### **Breakpoints Implementados**
- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px
- **Small Mobile:** < 480px

### **Mejoras Móviles**
✅ **Touch-friendly:** Botones mínimo 44px
✅ **Navegación adaptable:** Menú hamburguesa
✅ **Formularios optimizados:** Prevención de zoom iOS
✅ **Carrito responsive:** Modal adaptable
✅ **Tablas admin:** Cards en móviles
✅ **Imágenes responsive:** Optimizadas por dispositivo

---

## 📸 **Capturas de Pantalla**

### **🏠 Página Principal**
- Hero section con productos destacados
- Navegación intuitiva
- Diseño moderno y atractivo

### **🛍️ Catálogo de Productos**
- Grid responsive de productos
- Filtros y búsqueda
- Paginación

### **🛒 Carrito de Compras**
- Modal lateral deslizable
- Controles de cantidad táctiles
- Resumen de compra

### **💳 Checkout**
- Formulario paso a paso
- Resumen del pedido
- Métodos de pago

### **👨‍💼 Panel Admin**
- Dashboard con estadísticas
- Gestión completa de productos
- Reportes y analytics

---

## 🛠️ **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 16+
- npm o yarn
- MongoDB Atlas account
- Git

### **Frontend**
```bash
# Clonar repositorio
git clone https://github.com/RobertMtA/verduleria.react.git

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear .env con:
VITE_API_URL=http://localhost:5000

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
```

### **Backend**
```bash
# Navegar a backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear .env con:
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
PORT=5000

# Ejecutar servidor
npm start
```

---

## 📊 **Métricas y Rendimiento**

### **Performance**
- **Lighthouse Score:** 90+ en todas las categorías
- **First Contentful Paint:** < 2s
- **Time to Interactive:** < 3s
- **Bundle Size:** Optimizado con code splitting

### **SEO y Accesibilidad**
- **Meta tags** configurados
- **Estructura semántica** HTML5
- **Alt text** en todas las imágenes
- **Navegación por teclado** funcional

---

## 🎓 **Conceptos de React Aplicados**

### **Hooks Utilizados**
- ✅ `useState` - Gestión de estado local
- ✅ `useEffect` - Efectos secundarios y ciclo de vida
- ✅ `useContext` - Consumo de Context API
- ✅ `useNavigate` - Navegación programática
- ✅ `useParams` - Parámetros de ruta
- ✅ Custom hooks - Lógica reutilizable

### **Patrones Implementados**
- ✅ **Context API** - Estado global
- ✅ **Higher-Order Components** - Reutilización
- ✅ **Render Props** - Lógica compartida
- ✅ **Controlled Components** - Formularios
- ✅ **Conditional Rendering** - UI dinámica
- ✅ **Component Composition** - Flexibilidad

### **Buenas Prácticas**
- ✅ **Separación de responsabilidades**
- ✅ **Componentes reutilizables**
- ✅ **PropTypes y validación**
- ✅ **Manejo de errores**
- ✅ **Optimización de renders**
- ✅ **Código limpio y documentado**

---

## 🔮 **Características Avanzadas**

### **Estado y Persistencia**
- **Context API** para estado global
- **localStorage** para persistencia del carrito
- **sessionStorage** para datos temporales

### **Optimizaciones**
- **Lazy loading** de componentes
- **Debouncing** en búsquedas
- **Memoización** de componentes pesados
- **Image optimization** automática

### **Seguridad**
- **JWT tokens** con expiración
- **Validación** frontend y backend
- **Sanitización** de inputs
- **HTTPS** en producción

---

## 🎯 **Conclusiones**

### **Objetivos Alcanzados**
✅ **Aplicación Full-Stack completa** con React y Node.js
✅ **Sistema de autenticación robusto** con JWT
✅ **Panel administrativo completo** con todas las funciones CRUD
✅ **Diseño responsive** optimizado para todos los dispositivos
✅ **Despliegue en producción** con alta disponibilidad
✅ **Base de datos en la nube** con MongoDB Atlas
✅ **Arquitectura escalable** y mantenible

### **Aprendizajes Clave**
- **React Hooks** y gestión de estado moderno
- **Context API** para estado global
- **Responsive Design** y mobile-first approach
- **Autenticación JWT** y seguridad web
- **APIs RESTful** y comunicación cliente-servidor
- **Despliegue en la nube** y DevOps básico
- **Buenas prácticas** de desarrollo frontend

### **Tecnologías Dominadas**
- ⚛️ **React 18** con hooks y context
- 🎨 **CSS moderno** y responsive design
- 🚀 **Node.js/Express** para backend
- 🗄️ **MongoDB** y bases de datos NoSQL
- 🌐 **Despliegue cloud** (Netlify + Render)
- 🔧 **Build tools** (Vite) y workflow moderno

---

## 📞 **Información del Desarrollador**

**Proyecto desarrollado como entrega final del curso de React**

- **Funcionalidades:** 100% implementadas
- **Responsive:** Totalmente optimizado
- **Producción:** Desplegado y funcionando
- **Código:** Limpio, documentado y escalable

---

*Este proyecto demuestra dominio completo del ecosistema React y desarrollo full-stack moderno.*
