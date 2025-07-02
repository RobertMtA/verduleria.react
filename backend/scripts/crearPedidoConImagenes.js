import mongoose from 'mongoose';

// Conexión a MongoDB
const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Modelo de Pedido
const PedidoSchema = new mongoose.Schema({
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

const Pedido = mongoose.model('Pedido', PedidoSchema);

async function crearPedidoConImagenes() {
  try {
    console.log('Creando pedido de prueba con imágenes...');
    
    const nuevoPedido = new Pedido({
      usuario: {
        nombre: 'Usuario de Prueba',
        email: 'test@test.com',
        telefono: '1234567890',
        direccion: 'Calle Falsa 123, Ciudad'
      },
      productos: [
        {
          nombre: 'Tomate',
          precio: 500,
          cantidad: 2,
          subtotal: 1000,
          image: '/images/img-tomate1.jpg'
        },
        {
          nombre: 'Lechuga',
          precio: 300,
          cantidad: 1,
          subtotal: 300,
          image: '/images/img-lechuga1.jpg'
        },
        {
          nombre: 'Zanahoria',
          precio: 200,
          cantidad: 3,
          subtotal: 600,
          image: '/images/img-zanahoria1.jpg'
        }
      ],
      total: 1900,
      estado: 'pendiente',
      metodo_pago: 'efectivo'
    });

    const pedidoGuardado = await nuevoPedido.save();
    console.log('✅ Pedido creado exitosamente:', pedidoGuardado._id);
    console.log('Productos con imágenes:', pedidoGuardado.productos.map(p => ({ nombre: p.nombre, image: p.image })));
    
  } catch (error) {
    console.error('❌ Error al crear el pedido:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
}

crearPedidoConImagenes();
