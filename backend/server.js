import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar servicios de email y PDF
import { enviarEmailConfirmacion, enviarEmailResetPassword, enviarEmailNotificacionAdmin } from './services/emailService.js';
import { generarComprobantePDF, guardarComprobantePDF } from './services/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCESS_TOKEN = 'TEST-8823875515856581-062100-7403bf2c717e78cea313b61ed2f47a2a-792003923';

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const preference = new Preference(client);

import usersRoutes from './routes/users.js';
import authRouter from "./api/auth.js";
import productosRouter from "./api/productos.js";
import ofertasRouter from "./api/ofertas.js";
import chatRouter from "./routes/chat.js";
// import reportesRouter from './api/reportes.js'; // Removido - manejado directamente

// --- Conexión a MongoDB ---
const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// --- Modelo de Suscriptor ---
import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const SuscriptorSchema = new Schema({
  email: { type: String, required: true, unique: true },
  fecha_suscripcion: { type: Date, default: Date.now }
});
const Suscriptor = model('Suscriptor', SuscriptorSchema);

// --- Modelo de Usuario ---
const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  telefono: { type: String, default: '' },
  direccion: { type: String, default: '' },
  fecha_registro: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});
const Usuario = model('Usuario', UsuarioSchema);

// --- Modelo de Pedido ---
const PedidoSchema = new Schema({
  usuario: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, default: '' },
    direccion: { type: String, required: true }
  },
  productos: [{
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    image: { type: String, default: '' }
  }],
  total: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_proceso', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodo_pago: { type: String, default: 'mercadopago' },
  fecha_pedido: { type: Date, default: Date.now },
  fecha_actualizacion: { type: Date, default: Date.now }
});
const Pedido = model('Pedido', PedidoSchema);

// --- Modelo de Reseña ---
const ReseñaSchema = new Schema({
  usuario: {
    nombre: { type: String, required: true },
    email: { type: String, required: true }
  },
  calificacion: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comentario: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  fecha_reseña: { type: Date, default: Date.now },
  aprobada: { type: Boolean, default: false }, // Para moderación
  producto: { 
    type: String, 
    default: 'general' // 'general' para reseñas del servicio, o nombre del producto específico
  },
  pedido_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Pedido',
    required: false // Opcional, para asociar reseña con pedido específico
  }
});
const Reseña = model('Reseña', ReseñaSchema);

const app = express();

// 🚨 CORS ULTRA-AGRESIVO - SOLUCIÓN TEMPORAL 🚨
app.use((req, res, next) => {
  console.log(`🌐 REQUEST: ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  
  // Headers CORS ultra-permisivos
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Max-Age', '86400');
  
  // Interceptar TODAS las funciones de respuesta
  const originalRes = {
    send: res.send,
    json: res.json,
    status: res.status,
    end: res.end
  };
  
  const addCorsHeaders = () => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
  };
  
  res.send = function(data) {
    addCorsHeaders();
    console.log(`📤 SENDING: ${req.method} ${req.path} - Status: ${this.statusCode}`);
    return originalRes.send.call(this, data);
  };
  
  res.json = function(data) {
    addCorsHeaders();
    console.log(`📤 JSON: ${req.method} ${req.path} - Status: ${this.statusCode}`);
    return originalRes.json.call(this, data);
  };
  
  res.status = function(code) {
    addCorsHeaders();
    return originalRes.status.call(this, code);
  };
  
  res.end = function(data) {
    addCorsHeaders();
    console.log(`📤 END: ${req.method} ${req.path} - Status: ${this.statusCode}`);
    return originalRes.end.call(this, data);
  };
  
  // Respuesta inmediata para OPTIONS
  if (req.method === 'OPTIONS') {
    console.log(`✅ OPTIONS: ${req.path} - Responding immediately`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }
  
  next();
});

// CORS package como backup
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: false
}));

app.use(express.json());

// Configuración de multer para subida de archivos
const uploadsDir = path.join(__dirname, './public/images');

// Crear directorio si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp + nombre original
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    // Verificar tipo de archivo
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
  }
});

// Servir archivos estáticos de imágenes
app.use('/images', express.static(uploadsDir));

// Endpoint para crear preferencia de pago con MercadoPago (usando fetch directamente)
app.post('/api/crear-preferencia', async (req, res) => {
  console.log('🔄 Creando preferencia de MercadoPago...');
  
  try {
    const { items, email, usuario, direccion } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Debe proporcionar al menos un producto' 
      });
    }

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Debe proporcionar un email' 
      });
    }

    // Validar y formatear items
    const formattedItems = items.map(item => {
      const unitPrice = Number(item.unit_price);
      const quantity = Number(item.quantity);
      
      if (isNaN(unitPrice) || unitPrice <= 0) {
        throw new Error(`Precio inválido para el producto: ${item.title}`);
      }
      
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Cantidad inválida para el producto: ${item.title}`);
      }

      return {
        title: String(item.title),
        quantity: quantity,
        unit_price: unitPrice,
        currency_id: 'ARS'
      };
    });

    const preferenceData = {
      items: formattedItems,
      payer: {
        email: email
      },
      back_urls: {
        success: "http://localhost:5173/pago-exitoso",
        failure: "http://localhost:5173/pago-fallido", 
        pending: "http://localhost:5173/pago-pendiente"
      },
      external_reference: `pedido_${Date.now()}`
    };

    console.log('📦 Datos de preferencia:', JSON.stringify(preferenceData, null, 2));

    // Usar fetch directamente en lugar del SDK
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error de MercadoPago:', result);
      throw new Error(result.message || 'Error al crear preferencia de pago');
    }

    console.log('✅ Preferencia creada exitosamente:', result.id);
    
    res.json({ 
      success: true,
      preference_id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });

  } catch (error) {
    console.error('❌ Error al crear preferencia de MercadoPago:', error);
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error interno del servidor al crear la preferencia de pago'
    });
  }
});

// Endpoint para subir imágenes
app.post('/api/upload-image', (req, res) => {
  console.log('📷 Recibiendo request de upload de imagen...');
  
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('❌ Error de Multer:', err);
      return res.status(400).json({ error: `Error de subida: ${err.message}` });
    } else if (err) {
      console.error('❌ Error desconocido:', err);
      return res.status(400).json({ error: `Error: ${err.message}` });
    }

    console.log('📁 Archivo recibido:', req.file);
    
    if (!req.file) {
      console.error('❌ No se recibió ningún archivo');
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // Retornar la ruta relativa de la imagen
    const imagePath = `/images/${req.file.filename}`;
    console.log('✅ Imagen guardada en:', imagePath);
    
    res.json({ 
      success: true, 
      imagePath: imagePath,
      fileName: req.file.filename 
    });
  });
});

// Rutas principales
app.use('/api/auth', authRouter);
app.use("/api/productos", productosRouter);

// 🚨 ENDPOINTS DE EMERGENCIA CORS-FREE 🚨
app.get('/emergency/productos', (req, res) => {
  console.log('🚨 EMERGENCY: productos endpoint');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const productosEmergencia = [
    {
      id: "emergency_001",
      nombre: "Banana",
      descripcion: "Bananas frescas (Por kilo)",
      precio: 6000,
      stock: 77000,
      imagen: "/images/img-banana1.jpg",
      categoria: "Frutas",
      activo: true
    },
    {
      id: "emergency_002",
      nombre: "Naranja",
      descripcion: "Naranja fresca y jugosa (Por kilo)",
      precio: 2500,
      stock: 1000,
      imagen: "/images/img-naranja1.jpg",
      categoria: "Frutas",
      activo: true
    },
    {
      id: "emergency_003",
      nombre: "Lechuga",
      descripcion: "Lechuga fresca (Por kilo)",
      precio: 2500,
      stock: 50,
      imagen: "/images/img-lechuga1.jpg",
      categoria: "Verduras",
      activo: true
    }
  ];
  
  res.json({
    success: true,
    productos: productosEmergencia,
    total: productosEmergencia.length,
    source: 'emergency'
  });
});

app.get('/emergency/ofertas', (req, res) => {
  console.log('🚨 EMERGENCY: ofertas endpoint');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const ofertasEmergencia = [
    {
      _id: 'emergency_001',
      nombre: 'Súper Oferta Bananas',
      descripcion: 'Bananas frescas con 30% de descuento',
      precio_original: 6000,
      precio_oferta: 4200,
      descuento_porcentaje: 30,
      imagen: '/images/img-banana1.jpg',
      activa: true,
      vigente: true,
      categoria: 'Frutas'
    },
    {
      _id: 'emergency_002',
      nombre: 'Oferta Especial Naranjas',
      descripcion: 'Naranjas jugosas con 25% de descuento',
      precio_original: 2500,
      precio_oferta: 1875,
      descuento_porcentaje: 25,
      imagen: '/images/img-naranja1.jpg',
      activa: true,
      vigente: true,
      categoria: 'Frutas'
    }
  ];
  
  res.json({
    success: true,
    ofertas: ofertasEmergencia,
    total: ofertasEmergencia.length,
    source: 'emergency'
  });
});

// Ruta temporal para ofertas mientras se arregla el router
app.get('/api/ofertas-temp', (req, res) => {
  console.log('📢 GET /api/ofertas-temp - Ruta temporal activada');
  res.json({
    success: true,
    ofertas: [
      {
        _id: 'temp_001',
        nombre: 'Oferta Temporal 1',
        descripcion: 'Oferta de prueba mientras se arregla el sistema',
        precio_original: 5000,
        precio_oferta: 3500,
        descuento_porcentaje: 30,
        imagen: '/images/img-banana1.jpg',
        activa: true,
        vigente: true,
        categoria: 'general'
      },
      {
        _id: 'temp_002',
        nombre: 'Oferta Temporal 2',
        descripcion: 'Segunda oferta de prueba',
        precio_original: 8000,
        precio_oferta: 6000,
        descuento_porcentaje: 25,
        imagen: '/images/img-naranja1.jpg',
        activa: true,
        vigente: true,
        categoria: 'frutas'
      }
    ],
    total: 2,
    message: 'Datos temporales - Ofertas en mantenimiento'
  });
});

app.use('/api/ofertas', ofertasRouter);
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRouter);
// app.use('/api/reportes', reportesRouter); // Removido - ahora manejado directamente

// Endpoint de health check para keep-alive
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint alternativo de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Keep-alive funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.1'
  });
});

// Ruta de perfil de usuario
app.get('/api/perfil.php', async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log('Solicitando perfil para user_id:', user_id);
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "user_id es requerido"
      });
    }

    // Buscar usuario en la base de datos
    const usuario = await Usuario.findById(user_id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    res.json({
      success: true,
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        role: usuario.role,
        fecha_registro: usuario.fecha_registro
      }
    });
  } catch (error) {
    console.error('Error en get perfil:', error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// Ruta para actualizar perfil de usuario
app.put('/api/perfil/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { nombre, telefono, direccion } = req.body;
    
    console.log('Actualizando perfil para email:', email);
    console.log('Datos a actualizar:', { nombre, telefono, direccion });
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email es requerido"
      });
    }

    // Actualizar en la base de datos
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { email: email },
      { 
        $set: {
          nombre: nombre || '',
          telefono: telefono || '',
          direccion: direccion || ''
        }
      },
      { 
        new: true, // Retorna el documento actualizado
        runValidators: true
      }
    ).select('-password');

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    console.log('Usuario actualizado:', usuarioActualizado);

    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// Ruta de login directa para compatibilidad con frontend
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }
    
    // Buscar usuario en la base de datos
    const usuario = await Usuario.findOne({ email: email });
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }
    
    res.json({
      success: true,
      user: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        role: usuario.role
      },
      token: "ejemplo-token-jwt"
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Ruta de registro de usuarios
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;
    console.log('Intento de registro:', { nombre, email });
    
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Nombre, email y contraseña son requeridos"
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "El formato del email no es válido"
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Verificar si el email ya existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        error: "El email ya está registrado"
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario en la base de datos
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      role: 'user', // Los nuevos usuarios son siempre 'user'
      telefono: telefono || '',
      direccion: direccion || ''
    });

    await nuevoUsuario.save();

    // Devolver la información del usuario sin la contraseña
    const userResponse = {
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      role: nuevoUsuario.role,
      telefono: nuevoUsuario.telefono,
      direccion: nuevoUsuario.direccion,
      fecha_registro: nuevoUsuario.fecha_registro
    };

    res.json({
      success: true,
      message: "Usuario registrado correctamente",
      user: userResponse
    });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Error de clave duplicada de MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "El email ya está registrado"
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Verdulería Online');
});

// SUSCRIPTORES
// Crear suscriptor
app.post('/api/suscriptores', async (req, res) => {
  try {
    console.log('Body recibido:', req.body); // Para debug
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email requerido' });

    // Verificar si el email ya existe
    const existente = await Suscriptor.findOne({ email });
    if (existente) {
      console.log(`Email ${email} ya existe en la base de datos`);
      return res.status(200).json({ 
        success: true, 
        message: 'Este email ya está suscrito a nuestro boletín', 
        yaExiste: true 
      });
    }

    console.log(`Creando nueva suscripción para: ${email}`);
    const nuevo = await Suscriptor.create({ email });
    console.log(`Suscripción creada exitosamente para: ${email}`);
    res.json({ success: true, message: 'Suscripción exitosa', suscriptor: nuevo, yaExiste: false });
  } catch (error) {
    console.error('Error al procesar suscripción:', error);
    res.status(500).json({ success: false, message: 'Error al procesar suscripción', error: error.message });
  }
});

// Obtener todos los suscriptores
app.get('/api/suscriptores', async (req, res) => {
  try {
    const suscriptores = await Suscriptor.find().sort({ fecha_suscripcion: -1 });
    res.json(suscriptores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener suscriptores' });
  }
});

// Eliminar un suscriptor por ID
app.delete('/api/suscriptores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Suscriptor.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Suscriptor no encontrado' });
    }
    res.json({ success: true, message: 'Suscriptor eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar suscriptor' });
  }
});

// PEDIDOS
// Obtener todos los pedidos con información actualizada del usuario
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ fecha_pedido: -1 });
    
    // Enriquecer pedidos con información actualizada del usuario
    const pedidosEnriquecidos = await Promise.all(
      pedidos.map(async (pedido) => {
        try {
          // Buscar usuario actualizado por email
          const usuarioActualizado = await Usuario.findOne({ 
            email: pedido.usuario.email 
          }).select('-password');
          
          if (usuarioActualizado) {
            // Combinar información del pedido con datos actualizados del usuario
            return {
              ...pedido.toObject(),
              usuario: {
                ...pedido.usuario,
                // Dirección actualizada del usuario
                direccion_actual: usuarioActualizado.direccion,
                telefono_actual: usuarioActualizado.telefono,
                // Mantener dirección original del pedido para auditoría
                direccion_pedido: pedido.usuario.direccion
              }
            };
          }
          return pedido.toObject();
        } catch (err) {
          console.error('Error al obtener usuario actualizado:', err);
          return pedido.toObject();
        }
      })
    );
    
    res.json(pedidosEnriquecidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Obtener pedidos por email de usuario
app.get('/api/pedidos/usuario/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Buscando pedidos para email:', email);
    
    const pedidos = await Pedido.find({ 'usuario.email': email }).sort({ fecha_pedido: -1 });
    console.log('Pedidos encontrados:', pedidos.length);
    
    res.json({ 
      success: true, 
      pedidos: pedidos 
    });
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener pedidos del usuario' 
    });
  }
});

// Crear un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const { usuario, productos, total, metodo_pago } = req.body;
    
    if (!usuario || !productos || !total) {
      return res.status(400).json({ 
        success: false, 
        error: 'Datos del pedido incompletos' 
      });
    }

    // Conectar a MongoDB para enriquecer productos con imágenes
    const { MongoClient } = await import('mongodb');
    const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(mongoUri);
    
    try {
      await client.connect();
      const db = client.db('verduleria');
      const productosCollection = db.collection('productos');
      
      // Enriquecer productos con imágenes de la base de datos
      const productosEnriquecidos = await Promise.all(
        productos.map(async (prod) => {
          try {
            // Buscar el producto por nombre (podrían tener IDs también)
            const productoDB = await productosCollection.findOne({ 
              nombre: prod.nombre 
            });
            
            return {
              nombre: prod.nombre,
              precio: prod.precio,
              cantidad: prod.cantidad,
              subtotal: prod.subtotal,
              image: productoDB?.image || '/images/default-product.svg'
            };
          } catch (error) {
            console.error('Error al buscar producto:', prod.nombre, error);
            return {
              ...prod,
              image: '/images/default-product.svg'
            };
          }
        })
      );

      const nuevoPedido = new Pedido({
        usuario,
        productos: productosEnriquecidos,
        total,
        metodo_pago: metodo_pago || 'mercadopago',
        estado: 'pendiente'
      });

      const pedidoGuardado = await nuevoPedido.save();
      
      // Enviar email de confirmación automáticamente
      try {
        const emailResult = await enviarEmailConfirmacion(pedidoGuardado);
        if (emailResult.success) {
          console.log('✅ Email de confirmación enviado a:', usuario.email);
        } else {
          console.log('⚠️ No se pudo enviar el email de confirmación:', emailResult.error);
        }
      } catch (emailError) {
        console.error('⚠️ Error enviando email de confirmación:', emailError);
        // No fallar el pedido si no se puede enviar el email
      }

      // Enviar notificación al admin de nueva venta
      try {
        const adminEmailResult = await enviarEmailNotificacionAdmin(pedidoGuardado);
        if (adminEmailResult.success) {
          console.log('🚨 Notificación de nueva venta enviada al admin');
        } else {
          console.log('⚠️ No se pudo enviar notificación al admin:', adminEmailResult.error);
        }
      } catch (adminEmailError) {
        console.error('⚠️ Error enviando notificación al admin:', adminEmailError);
        // No fallar el pedido si no se puede enviar el email al admin
      }
      
      res.json({ 
        success: true, 
        message: 'Pedido creado correctamente',
        pedido: pedidoGuardado 
      });
      
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear pedido' 
    });
  }
});

// Actualizar estado de un pedido
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const estadosValidos = ['pendiente', 'confirmado', 'en_proceso', 'en_camino', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Estado inválido' 
      });
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { 
        estado, 
        fecha_actualizacion: new Date() 
      },
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Estado del pedido actualizado',
      pedido: pedidoActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar pedido' 
    });
  }
});

// Actualizar estado de un pedido (para admin y usuario)
app.put('/api/pedidos/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;
    
    // Validar que el nuevo estado sea válido
    const estadosValidos = ['pendiente', 'confirmado', 'en_proceso', 'en_camino', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Estado no válido. Estados permitidos: ' + estadosValidos.join(', ')
      });
    }

    // Buscar y actualizar el pedido
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { 
        estado: nuevoEstado,
        fecha_actualizacion: new Date()
      },
      { new: true }
    );
    
    if (!pedidoActualizado) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    console.log(`✅ Estado del pedido ${id} actualizado a: ${nuevoEstado}`);
    
    res.json({ 
      success: true, 
      message: `Estado actualizado a ${nuevoEstado}`,
      pedido: pedidoActualizado
    });
    
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Obtener un pedido por ID
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);
    
    if (!pedido) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener pedido' 
    });
  }
});

// Generar y descargar comprobante PDF
app.get('/api/pedidos/:id/comprobante', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el pedido
    const pedido = await Pedido.findById(id);
    
    if (!pedido) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    // Solo permitir generar comprobante si el pedido está pagado
    if (pedido.estado === 'cancelado') {
      return res.status(400).json({ 
        success: false, 
        error: 'No se puede generar comprobante para pedidos cancelados' 
      });
    }

    // Generar PDF
    const pdfResult = await generarComprobantePDF(pedido);
    
    if (!pdfResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error generando el comprobante PDF' 
      });
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.fileName}"`);
    res.setHeader('Content-Length', pdfResult.buffer.length);
    
    // Enviar el PDF
    res.send(pdfResult.buffer);
    
  } catch (error) {
    console.error('Error generando comprobante:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Enviar email de confirmación manualmente (para testing)
app.post('/api/pedidos/:id/enviar-email', async (req, res) => {
  try {
    const { id } = req.params;
    const { adjuntarPDF = false } = req.body; // Opción para adjuntar PDF
    
    // Buscar el pedido
    const pedido = await Pedido.findById(id);
    
    if (!pedido) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    // Enviar email con opción de PDF
    const emailResult = await enviarEmailConfirmacion(pedido, adjuntarPDF);
    
    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: `Email enviado correctamente${adjuntarPDF ? ' con comprobante PDF adjunto' : ''}`,
        messageId: emailResult.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: emailResult.error 
      });
    }
    
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Nuevo endpoint: Enviar email con PDF adjunto
app.post('/api/pedidos/:id/enviar-email-con-pdf', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el pedido
    const pedido = await Pedido.findById(id);
    
    if (!pedido) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    // Enviar email con PDF adjunto
    const emailResult = await enviarEmailConfirmacion(pedido, true);
    
    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: 'Email enviado correctamente con comprobante PDF adjunto',
        messageId: emailResult.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: emailResult.error 
      });
    }
    
  } catch (error) {
    console.error('Error enviando email con PDF:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Eliminar un pedido
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pedidoEliminado = await Pedido.findByIdAndDelete(id);
    
    if (!pedidoEliminado) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Pedido eliminado correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar pedido' 
    });
  }
});

// USUARIOS
// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password').sort({ fecha_registro: -1 });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, email, password, role, telefono, direccion } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nombre, email y contraseña son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ 
        success: false, 
        error: 'El email ya está registrado' 
      });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      role: role || 'user',
      telefono: telefono || '',
      direccion: direccion || ''
    });

    const usuarioGuardado = await nuevoUsuario.save();
    
    // Devolver usuario sin contraseña
    const { password: _, ...usuarioSinPassword } = usuarioGuardado.toObject();
    
    res.json({ 
      success: true, 
      message: 'Usuario creado correctamente',
      usuario: usuarioSinPassword 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear usuario' 
    });
  }
});

// Actualizar un usuario
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, role, telefono, direccion, password } = req.body;
    
    const updateData = {
      nombre,
      email,
      role,
      telefono,
      direccion
    };

    // Si se proporciona una nueva contraseña, hashearla
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password' }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Usuario actualizado correctamente',
      usuario: usuarioActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar usuario' 
    });
  }
});

// Obtener perfil de usuario por email
app.get('/api/perfil/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Obteniendo perfil para email:', email);
    
    const usuario = await Usuario.findOne({ email }).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    // Obtener pedidos del usuario
    const pedidos = await Pedido.find({ 'usuario.email': email }).sort({ fecha_pedido: -1 });
    
    res.json({ 
      success: true, 
      data: usuario,
      pedidos: pedidos 
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener perfil' 
    });
  }
});

// Eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // No permitir eliminar al usuario administrador principal
    const usuario = await Usuario.findById(id);
    if (usuario && usuario.email === 'admin@admin.com') {
      return res.status(403).json({ 
        success: false, 
        error: 'No se puede eliminar el usuario administrador principal' 
      });
    }

    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Usuario eliminado correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar usuario' 
    });
  }
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener usuario' 
    });
  }
});

// REPORTES
// Obtener reportes de ventas
app.get('/api/reportes', async (req, res) => {
  try {
    const { rango } = req.query;
    let fechaDesde = new Date();
    
    // Calcular fecha desde basado en el rango
    switch (rango) {
      case 'ultimos_6_meses':
        fechaDesde.setMonth(fechaDesde.getMonth() - 6);
        break;
      case 'ultimo_año':
        fechaDesde.setFullYear(fechaDesde.getFullYear() - 1);
        break;
      case 'ultimos_3_meses':
        fechaDesde.setMonth(fechaDesde.getMonth() - 3);
        break;
      default:
        fechaDesde.setMonth(fechaDesde.getMonth() - 6);
    }

    // Pipeline de agregación para obtener reportes por mes
    const reportes = await Pedido.aggregate([
      {
        $match: {
          fecha_pedido: { $gte: fechaDesde },
          estado: { $in: ['entregado', 'en_proceso'] } // Solo pedidos completados o en proceso
        }
      },
      {
        $group: {
          _id: {
            año: { $year: "$fecha_pedido" },
            mes: { $month: "$fecha_pedido" }
          },
          ventas: { $sum: "$total" },
          pedidos: { $sum: 1 },
          fecha: { $first: "$fecha_pedido" }
        }
      },
      {
        $sort: { "_id.año": 1, "_id.mes": 1 }
      },
      {
        $project: {
          _id: 0,
          mes: {
            $concat: [
              { $toString: "$_id.año" },
              "-",
              {
                $cond: {
                  if: { $lt: ["$_id.mes", 10] },
                  then: { $concat: ["0", { $toString: "$_id.mes" }] },
                  else: { $toString: "$_id.mes" }
                }
              }
            ]
          },
          ventas: 1,
          pedidos: 1
        }
      }
    ]);

    // Si no hay datos, generar datos de ejemplo para los últimos 6 meses
    if (reportes.length === 0) {
      const mesesEjemplo = [];
      const fechaActual = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(fechaActual);
        fecha.setMonth(fecha.getMonth() - i);
        
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        
        mesesEjemplo.push({
          mes: `${año}-${mes}`,
          ventas: Math.floor(Math.random() * 50000) + 10000, // Entre 10k y 60k
          pedidos: Math.floor(Math.random() * 50) + 10 // Entre 10 y 60 pedidos
        });
      }
      
      return res.json(mesesEjemplo);
    }

    res.json(reportes);
  } catch (error) {
    console.error("Error en /api/reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes", detalle: error.message });
  }
});

// Endpoint para manejar notificaciones de MercadoPago (Webhooks)
app.post('/api/mercadopago/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  console.log('🔔 Recibida notificación de MercadoPago');
  
  try {
    const data = JSON.parse(req.body);
    console.log('📄 Datos del webhook:', data);
    
    if (data.type === 'payment') {
      console.log('💳 Procesando notificación de pago:', data.data.id);
      
      // Aquí puedes actualizar el estado del pedido en tu base de datos
      // según el estado del pago recibido desde MercadoPago
      
      // Ejemplo: buscar y actualizar pedido por external_reference
      if (data.data && data.data.id) {
        console.log(`🔄 Actualizando estado del pago: ${data.data.id}`);
        // Implementar lógica de actualización de estado del pedido
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error procesando webhook de MercadoPago:', error);
    res.status(500).send('Error');
  }
});

// Endpoint para consultar estado de pago
app.get('/api/mercadopago/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    
    const paymentData = await response.json();
    
    res.json({
      success: true,
      payment: paymentData
    });
    
  } catch (error) {
    console.error('❌ Error consultando pago:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para solicitar reset de contraseña
app.post('/api/forgot_password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email es requerido"
      });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      // Por seguridad, devolvemos éxito aunque no exista el usuario
      return res.json({
        success: true,
        message: "Si el email existe en nuestro sistema, recibirás un enlace de recuperación"
      });
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    usuario.resetPasswordToken = resetToken;
    usuario.resetPasswordExpires = resetTokenExpires;
    await usuario.save();

    // Crear enlace de reset
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // Crear datos para el email
    const emailData = {
      _id: 'reset_' + Date.now(),
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        direccion: '',
        telefono: ''
      },
      productos: [],
      total: 0,
      estado: 'reset_password',
      metodo_pago: '',
      fecha_pedido: new Date()
    };

    // Enviar email de recuperación
    try {
      await enviarEmailResetPassword(usuario, resetUrl);
      console.log(`📧 Email de reset enviado a: ${email}`);
      console.log(`🔗 Enlace de reset generado: ${resetUrl}`);
    } catch (emailError) {
      console.warn('No se pudo enviar email de reset:', emailError.message);
      // En desarrollo, mostramos el enlace en consola como fallback
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔗 Enlace de reset (fallback): ${resetUrl}`);
      }
    }

    res.json({
      success: true,
      message: "Si el email existe en nuestro sistema, recibirás un enlace de recuperación",
      // Solo para desarrollo y testing - remover en producción final
      resetUrl: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') ? resetUrl : undefined
    });

  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// Endpoint para reset de contraseña con token
app.post('/api/reset_password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token y nueva contraseña son requeridos"
      });
    }

    // Validar longitud de contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Buscar usuario con token válido y no expirado
    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        error: "Token inválido o expirado"
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña y limpiar tokens
    usuario.password = hashedPassword;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    console.log(`✅ Contraseña actualizada para usuario: ${usuario.email}`);

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});

// ============== MANEJO DE ERRORES Y 404 ==============
// Middleware para manejar rutas no encontradas (404) con headers CORS
app.use('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Middleware de manejo de errores global con headers CORS
app.use((error, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.error('Error en servidor:', error);
  
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: error.message || 'Ha ocurrido un error inesperado'
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

// RESEÑAS
// Obtener todas las reseñas (para admin y display público)
app.get('/api/resenas', async (req, res) => {
  try {
    const { aprobadas } = req.query;
    let filtro = {};
    
    // Si se especifica el parámetro aprobadas=true, solo mostrar las aprobadas
    if (aprobadas === 'true') {
      filtro.aprobada = true;
    }
    
    const reseñas = await Reseña.find(filtro).sort({ fecha_reseña: -1 });
    res.json({
      success: true,
      reseñas
    });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener reseñas' });
  }
});

// Crear nueva reseña
app.post('/api/resenas', async (req, res) => {
  try {
    console.log('📝 Datos recibidos para nueva reseña:', req.body);
    const { usuario, calificacion, comentario, producto, pedido_id } = req.body;
    
    // Validaciones
    if (!usuario) {
      console.log('❌ Error: Usuario no proporcionado');
      return res.status(400).json({ 
        success: false, 
        error: 'Usuario requerido' 
      });
    }
    
    if (!usuario.nombre || !usuario.email) {
      console.log('❌ Error: Datos de usuario incompletos:', usuario);
      return res.status(400).json({ 
        success: false, 
        error: 'Nombre y email del usuario requeridos' 
      });
    }
    
    if (!calificacion || calificacion < 1 || calificacion > 5) {
      console.log('❌ Error: Calificación inválida:', calificacion);
      return res.status(400).json({ 
        success: false, 
        error: 'Calificación debe ser entre 1 y 5 estrellas' 
      });
    }
    
    if (!comentario || comentario.length < 10) {
      console.log('❌ Error: Comentario muy corto:', comentario, 'Length:', comentario?.length);
      return res.status(400).json({ 
        success: false, 
        error: 'Comentario debe tener al menos 10 caracteres' 
      });
    }
    
    if (comentario.length > 500) {
      return res.status(400).json({ 
        success: false, 
        error: 'Comentario no puede exceder 500 caracteres' 
      });
    }
    
    const nuevaReseña = new Reseña({
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email
      },
      calificacion,
      comentario,
      producto: producto || 'general',
      pedido_id: pedido_id || null,
      aprobada: false // Requiere aprobación por defecto
    });
    
    console.log('✅ Creando reseña:', nuevaReseña);
    await nuevaReseña.save();
    console.log('✅ Reseña guardada exitosamente');
    
    res.json({ 
      success: true, 
      message: 'Reseña enviada exitosamente. Será revisada antes de publicarse.',
      reseña: nuevaReseña 
    });
  } catch (error) {
    console.error('❌ Error al crear reseña:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear reseña: ' + error.message 
    });
  }
});

// Aprobar/Desaprobar reseña (solo admin)
app.put('/api/resenas/:id/aprobar', async (req, res) => {
  try {
    const { id } = req.params;
    const { aprobada } = req.body;
    
    const reseña = await Reseña.findByIdAndUpdate(
      id,
      { aprobada: aprobada },
      { new: true }
    );
    
    if (!reseña) {
      return res.status(404).json({ 
        success: false, 
        error: 'Reseña no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Reseña ${aprobada ? 'aprobada' : 'desaprobada'} exitosamente`,
      reseña 
    });
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar reseña' 
    });
  }
});

// Eliminar reseña (solo admin)
app.delete('/api/resenas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reseñaEliminada = await Reseña.findByIdAndDelete(id);
    
    if (!reseñaEliminada) {
      return res.status(404).json({ 
        success: false, 
        error: 'Reseña no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Reseña eliminada correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar reseña' 
    });
  }
});

// Obtener estadísticas de reseñas
app.get('/api/resenas/estadisticas', async (req, res) => {
  try {
    const totalReseñas = await Reseña.countDocuments();
    const reseñasAprobadas = await Reseña.countDocuments({ aprobada: true });
    const reseñasPendientes = await Reseña.countDocuments({ aprobada: false });
    
    // Calcular promedio de calificación de reseñas aprobadas
    const promedioResult = await Reseña.aggregate([
      { $match: { aprobada: true } },
      { $group: { _id: null, promedio: { $avg: "$calificacion" } } }
    ]);
    
    const promedioCalificacion = promedioResult.length > 0 ? 
      Math.round(promedioResult[0].promedio * 10) / 10 : 0;
    
    // Distribución de calificaciones
    const distribucion = await Reseña.aggregate([
      { $match: { aprobada: true } },
      { $group: { _id: "$calificacion", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      estadisticas: {
        total: totalReseñas,
        aprobadas: reseñasAprobadas,
        pendientes: reseñasPendientes,
        promedio: promedioCalificacion,
        distribucion
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener estadísticas' 
    });
  }
});

// Endpoint de debug para verificar imágenes
app.get('/debug/images', (req, res) => {
  try {
    const imagesPath = path.join(__dirname, './public/images');
    console.log('📁 Verificando directorio de imágenes:', imagesPath);
    
    if (!fs.existsSync(imagesPath)) {
      return res.json({
        status: 'error',
        message: 'Directorio de imágenes no existe',
        path: imagesPath,
        __dirname: __dirname
      });
    }
    
    const files = fs.readdirSync(imagesPath);
    
    res.json({
      status: 'success',
      message: 'Directorio de imágenes encontrado',
      path: imagesPath,
      __dirname: __dirname,
      files: files,
      totalFiles: files.length
    });
    
  } catch (error) {
    console.error('❌ Error verificando imágenes:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      __dirname: __dirname
    });
  }
});

// Simple test endpoint
app.get('/test-timestamp', (req, res) => {
  res.json({
    message: 'Servidor actualizado correctamente',
    timestamp: new Date().toISOString(),
    version: '2.0.0-fix-images'
  });
});

