// Script para crear reseñas de ejemplo en la base de datos
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB
const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

// Esquema de reseña
const { Schema, model } = mongoose;

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
  aprobada: { type: Boolean, default: false },
  producto: { 
    type: String, 
    default: 'general'
  },
  pedido_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Pedido',
    required: false
  }
});

const Reseña = model('Reseña', ReseñaSchema);

// Reseñas de ejemplo
const reseñasEjemplo = [
  {
    usuario: {
      nombre: 'María González',
      email: 'maria.gonzalez@email.com'
    },
    calificacion: 5,
    comentario: 'Excelente servicio y productos muy frescos. Las frutas llegaron en perfecto estado y el delivery fue muy puntual. Definitivamente volveré a comprar.',
    aprobada: true,
    producto: 'Banana'
  },
  {
    usuario: {
      nombre: 'Juan Carlos Pérez',
      email: 'juan.perez@email.com'
    },
    calificacion: 4,
    comentario: 'Buena calidad de verduras y precios competitivos. El proceso de compra es muy fácil a través de la web. Solo mejoraria un poco los tiempos de entrega.',
    aprobada: true,
    producto: 'Lechuga'
  },
  {
    usuario: {
      nombre: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com'
    },
    calificacion: 5,
    comentario: 'Las naranjas estaban increíblemente jugosas y dulces. El empaque fue cuidadoso y todo llegó en excelente estado. Recomiendo esta verdulería.',
    aprobada: true,
    producto: 'Naranja'
  },
  {
    usuario: {
      nombre: 'Carlos Martínez',
      email: 'carlos.martinez@email.com'
    },
    calificacion: 4,
    comentario: 'Buen servicio en general. Las papas estaban frescas y de buena calidad. El sitio web es fácil de usar y el proceso de pago es seguro.',
    aprobada: false, // Pendiente de aprobación
    producto: 'Papa'
  },
  {
    usuario: {
      nombre: 'Laura Fernández',
      email: 'laura.fernandez@email.com'
    },
    calificacion: 5,
    comentario: 'Increíble frescura en todos los productos. La variedad es excelente y los precios muy justos. El equipo de atención al cliente es muy amable.',
    aprobada: true,
    producto: 'general'
  },
  {
    usuario: {
      nombre: 'Roberto Silva',
      email: 'roberto.silva@email.com'
    },
    calificacion: 3,
    comentario: 'El producto está bien pero el delivery se demoró más de lo esperado. La calidad de las verduras es buena pero podrían mejorar los tiempos.',
    aprobada: false, // Pendiente de aprobación
    producto: 'Zanahoria'
  },
  {
    usuario: {
      nombre: 'Patricia López',
      email: 'patricia.lopez@email.com'
    },
    calificacion: 5,
    comentario: 'Perfecta experiencia de compra. Todo muy fresco, bien empacado y entregado a tiempo. Definitivamente mi verdulería online favorita.',
    aprobada: true,
    producto: 'Manzana'
  },
  {
    usuario: {
      nombre: 'Diego Morales',
      email: 'diego.morales@email.com'
    },
    calificacion: 4,
    comentario: 'Las frutas están muy buenas y el precio es razonable. Solo sugiero que agreguen más variedad de productos orgánicos.',
    aprobada: false, // Pendiente de aprobación
    producto: 'Pera'
  }
];

async function crearReseñasEjemplo() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Limpiar reseñas existentes (opcional)
    console.log('🗑️ Limpiando reseñas existentes...');
    await Reseña.deleteMany({});

    // Crear nuevas reseñas
    console.log('📝 Creando reseñas de ejemplo...');
    const reseñasCreadas = await Reseña.insertMany(reseñasEjemplo);
    
    console.log(`✅ ${reseñasCreadas.length} reseñas creadas exitosamente:`);
    reseñasCreadas.forEach((reseña, index) => {
      console.log(`${index + 1}. ${reseña.usuario.nombre} - ${reseña.calificacion}⭐ - ${reseña.aprobada ? 'Aprobada' : 'Pendiente'}`);
    });

    // Mostrar estadísticas
    const total = await Reseña.countDocuments();
    const aprobadas = await Reseña.countDocuments({ aprobada: true });
    const pendientes = await Reseña.countDocuments({ aprobada: false });
    
    console.log('\n📊 Estadísticas:');
    console.log(`Total: ${total}`);
    console.log(`Aprobadas: ${aprobadas}`);
    console.log(`Pendientes: ${pendientes}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Desconectado de MongoDB');
    process.exit(0);
  }
}

crearReseñasEjemplo();
