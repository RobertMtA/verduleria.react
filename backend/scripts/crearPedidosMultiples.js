// Script para crear varios pedidos de prueba
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

async function crearPedidosMultiples() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db('verduleria');
    const pedidosCollection = db.collection('pedidos');
    const chatCollection = db.collection('chat_messages');
    
    const pedidos = [
      {
        usuario: {
          nombre: 'Usuario de Prueba',
          email: 'test@verduleria.com',
          telefono: '+54 11 1234-5678',
          direccion: 'Av. Corrientes 1234, CABA'
        },
        productos: [
          { nombre: 'Bananas', precio: 400, cantidad: 3, subtotal: 1200, image: 'img-banana1.jpg' },
          { nombre: 'Manzanas', precio: 600, cantidad: 2, subtotal: 1200, image: 'img-manzana1.jpg' }
        ],
        total: 2400,
        metodo_pago: 'mercadopago',
        estado: 'entregado',
        fecha_pedido: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        usuario: {
          nombre: 'Usuario de Prueba',
          email: 'test@verduleria.com',
          telefono: '+54 11 1234-5678',
          direccion: 'Av. Corrientes 1234, CABA'
        },
        productos: [
          { nombre: 'Espinaca', precio: 350, cantidad: 2, subtotal: 700, image: 'img-espinaca1.jpg' },
          { nombre: 'Zanahorias', precio: 300, cantidad: 1, subtotal: 300, image: 'img-zanahoria1.jpg' },
          { nombre: 'Cebollas', precio: 250, cantidad: 2, subtotal: 500, image: 'img-cebollas1.jpg' }
        ],
        total: 1500,
        metodo_pago: 'mercadopago',
        estado: 'en_proceso',
        fecha_pedido: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
    
    console.log('📦 Creando pedidos adicionales...');
    
    for (let i = 0; i < pedidos.length; i++) {
      const pedido = { ...pedidos[i], _id: new ObjectId() };
      await pedidosCollection.insertOne(pedido);
      console.log(`✅ Pedido ${i + 1} creado con ID: ${pedido._id}`);
      
      // Crear mensajes para cada pedido
      const mensajes = [
        {
          pedidoId: pedido._id.toString(),
          mensaje: pedido.estado === 'entregado' 
            ? '✅ ¡Tu pedido ha sido entregado exitosamente! Gracias por elegirnos.'
            : '🚀 Tu pedido está siendo preparado por nuestro equipo.',
          remitente: 'admin',
          tipo: 'message',
          usuarioEmail: pedido.usuario.email,
          timestamp: new Date(pedido.fecha_pedido.getTime() + 30 * 60 * 1000), // 30 min después
          leido: true
        }
      ];
      
      if (pedido.estado === 'en_proceso') {
        mensajes.push({
          pedidoId: pedido._id.toString(),
          mensaje: 'Hola, ¿aproximadamente cuánto falta para que esté listo?',
          remitente: 'user',
          tipo: 'message',
          usuarioEmail: pedido.usuario.email,
          timestamp: new Date(pedido.fecha_pedido.getTime() + 60 * 60 * 1000), // 1 hora después
          leido: false
        });
      }
      
      for (const mensaje of mensajes) {
        await chatCollection.insertOne(mensaje);
      }
      
      console.log(`💬 Mensajes creados para pedido ${i + 1}`);
    }
    
    console.log('\n🎉 Pedidos adicionales creados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

crearPedidosMultiples();
