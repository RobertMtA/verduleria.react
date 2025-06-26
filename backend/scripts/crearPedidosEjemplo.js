import mongoose from 'mongoose';

// Conexión a MongoDB
const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

const { Schema, model } = mongoose;

// Modelo de Pedido
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
    subtotal: { type: Number, required: true }
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

async function crearPedidosEjemplo() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB Atlas');

    // Limpiar pedidos existentes (opcional)
    await Pedido.deleteMany({});
    console.log('Pedidos anteriores eliminados');

    // Crear pedidos de ejemplo
    const pedidosEjemplo = [
      {
        usuario: {
          nombre: 'Juan Pérez',
          email: 'juan@email.com',
          telefono: '+54 11 1234-5678',
          direccion: 'Av. Corrientes 1234, CABA'
        },
        productos: [
          {
            nombre: 'Manzanas Rojas',
            precio: 450,
            cantidad: 2,
            subtotal: 900
          },
          {
            nombre: 'Bananas',
            precio: 380,
            cantidad: 1,
            subtotal: 380
          }
        ],
        total: 1280,
        estado: 'pendiente',
        metodo_pago: 'mercadopago',
        fecha_pedido: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
      },
      {
        usuario: {
          nombre: 'María García',
          email: 'maria@email.com',
          telefono: '+54 11 9876-5432',
          direccion: 'Calle Falsa 123, Buenos Aires'
        },
        productos: [
          {
            nombre: 'Tomates',
            precio: 520,
            cantidad: 3,
            subtotal: 1560
          },
          {
            nombre: 'Lechuga',
            precio: 290,
            cantidad: 2,
            subtotal: 580
          }
        ],
        total: 2140,
        estado: 'en_proceso',
        metodo_pago: 'mercadopago',
        fecha_pedido: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 horas atrás
      },
      {
        usuario: {
          nombre: 'Carlos López',
          email: 'carlos@email.com',
          telefono: '+54 11 5555-1234',
          direccion: 'San Martín 456, La Plata'
        },
        productos: [
          {
            nombre: 'Naranjas',
            precio: 350,
            cantidad: 4,
            subtotal: 1400
          }
        ],
        total: 1400,
        estado: 'entregado',
        metodo_pago: 'mercadopago',
        fecha_pedido: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 día atrás
      },
      {
        usuario: {
          nombre: 'Ana Martínez',
          email: 'ana@email.com',
          telefono: '+54 11 7777-8888',
          direccion: 'Rivadavia 789, Rosario'
        },
        productos: [
          {
            nombre: 'Peras',
            precio: 420,
            cantidad: 2,
            subtotal: 840
          },
          {
            nombre: 'Zanahorias',
            precio: 180,
            cantidad: 3,
            subtotal: 540
          }
        ],
        total: 1380,
        estado: 'pendiente',
        metodo_pago: 'mercadopago',
        fecha_pedido: new Date(Date.now() - 30 * 60 * 1000) // 30 minutos atrás
      },
      {
        usuario: {
          nombre: 'Roberto Silva',
          email: 'roberto@email.com',
          telefono: '+54 11 3333-4444',
          direccion: 'Belgrano 321, Córdoba'
        },
        productos: [
          {
            nombre: 'Espinaca',
            precio: 250,
            cantidad: 2,
            subtotal: 500
          }
        ],
        total: 500,
        estado: 'cancelado',
        metodo_pago: 'mercadopago',
        fecha_pedido: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 días atrás
      }
    ];

    const pedidosCreados = await Pedido.insertMany(pedidosEjemplo);
    console.log(`✅ ${pedidosCreados.length} pedidos de ejemplo creados exitosamente`);

    // Mostrar resumen
    console.log('\n📊 Resumen de pedidos creados:');
    for (const pedido of pedidosCreados) {
      console.log(`- Pedido ${pedido._id}: ${pedido.usuario.nombre} - ${pedido.estado} - $${pedido.total}`);
    }

  } catch (error) {
    console.error('❌ Error al crear pedidos de ejemplo:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
crearPedidosEjemplo();
