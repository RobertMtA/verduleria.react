import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://robertochalo123:FdHyDlBo7uN2rFiO@cluster0.mqqjx.mongodb.net/verduleria_tienda?retryWrites=true&w=majority&appName=Cluster0';

async function crearPedidoConImagen() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('verduleria_tienda');
    const pedidosCollection = db.collection('pedidos');
    
    // Crear un pedido de prueba con información de imagen
    const pedidoPrueba = {
      fecha_pedido: new Date(),
      usuario: {
        nombre: 'Usuario Prueba',
        email: 'test@test.com',
        telefono: '123456789',
        direccion: 'Dirección de prueba'
      },
      productos: [
        {
          nombre: 'Espinaca',
          precio: 2000,
          cantidad: 3,
          subtotal: 6000,
          // Incluir información de imagen
          image: 'img-espinaca1.jpg',
          imagen: 'img-espinaca1.jpg'
        },
        {
          nombre: 'Tomate',
          precio: 1500,
          cantidad: 2,
          subtotal: 3000,
          // Incluir información de imagen
          image: 'img-tomate1.jpg',
          imagen: 'img-tomate1.jpg'
        }
      ],
      total: 9000,
      metodo_pago: 'mercadopago',
      estado: 'pendiente'
    };
    
    const resultado = await pedidosCollection.insertOne(pedidoPrueba);
    console.log('✅ Pedido de prueba creado con ID:', resultado.insertedId);
    
    // Verificar que se creó correctamente
    const pedidoCreado = await pedidosCollection.findOne({ _id: resultado.insertedId });
    console.log('📦 Pedido creado:', {
      id: pedidoCreado._id,
      productos: pedidoCreado.productos.map(p => ({
        nombre: p.nombre,
        image: p.image,
        imagen: p.imagen
      }))
    });
    
    await client.close();
    console.log('✅ Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

crearPedidoConImagen();
