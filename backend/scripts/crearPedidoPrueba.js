// Script para crear un pedido de prueba con chat
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

async function crearPedidoPrueba() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db('verduleria');
    const pedidosCollection = db.collection('pedidos');
    const chatCollection = db.collection('chat_messages');
    
    // Crear pedido de prueba
    const nuevoPedido = {
      _id: new ObjectId(),
      usuario: {
        nombre: 'Usuario de Prueba',
        email: 'test@verduleria.com',
        telefono: '+54 11 1234-5678',
        direccion: 'Av. Corrientes 1234, CABA'
      },
      productos: [
        {
          nombre: 'Tomates',
          precio: 500,
          cantidad: 2,
          subtotal: 1000,
          image: 'img-tomate1.jpg'
        },
        {
          nombre: 'Lechuga',
          precio: 300,
          cantidad: 1,
          subtotal: 300,
          image: 'img-lechuga1.jpg'
        }
      ],
      total: 1300,
      metodo_pago: 'mercadopago',
      estado: 'pendiente',
      fecha_pedido: new Date(),
      fecha: new Date()
    };
    
    console.log('📦 Creando pedido de prueba...');
    await pedidosCollection.insertOne(nuevoPedido);
    console.log(`✅ Pedido creado con ID: ${nuevoPedido._id}`);
    
    // Crear mensaje inicial en el chat
    const mensajeInicial = {
      pedidoId: nuevoPedido._id.toString(),
      mensaje: '¡Hola! Tu pedido ha sido recibido y está siendo procesado. Te mantendremos informado sobre el progreso.',
      remitente: 'admin',
      tipo: 'message',
      usuarioEmail: nuevoPedido.usuario.email,
      timestamp: new Date(),
      leido: false
    };
    
    console.log('💬 Creando mensaje inicial en el chat...');
    await chatCollection.insertOne(mensajeInicial);
    console.log('✅ Mensaje inicial creado');
    
    // Crear segundo mensaje
    const segundoMensaje = {
      pedidoId: nuevoPedido._id.toString(),
      mensaje: '📦 Actualizando estado: Tu pedido está PENDIENTE de procesamiento',
      remitente: 'system',
      tipo: 'status_update',
      usuarioEmail: nuevoPedido.usuario.email,
      timestamp: new Date(Date.now() + 30000), // 30 segundos después
      leido: false
    };
    
    await chatCollection.insertOne(segundoMensaje);
    console.log('✅ Segundo mensaje creado');
    
    console.log('\n🎉 Pedido de prueba creado exitosamente!');
    console.log(`ID del pedido: ${nuevoPedido._id}`);
    console.log(`Estado: ${nuevoPedido.estado}`);
    console.log(`Total: $${nuevoPedido.total}`);
    console.log(`Mensajes de chat: 2`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

crearPedidoPrueba();
