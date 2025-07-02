// Script para verificar pedidos existentes y agregar mensajes de prueba
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

async function verificarPedidos() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db('verduleria_tienda');
    const pedidosCollection = db.collection('pedidos');
    const chatCollection = db.collection('chat_messages');
    
    // Obtener todos los pedidos
    const pedidos = await pedidosCollection.find({}).sort({ fecha_pedido: -1 }).toArray();
    console.log(`📦 Pedidos encontrados: ${pedidos.length}`);
    
    if (pedidos.length > 0) {
      console.log('\n📋 Últimos 3 pedidos:');
      for (let i = 0; i < Math.min(3, pedidos.length); i++) {
        const pedido = pedidos[i];
        console.log(`${i + 1}. ID: ${pedido._id}`);
        console.log(`   Estado: ${pedido.estado}`);
        console.log(`   Usuario: ${pedido.usuario?.email || 'N/A'}`);
        console.log(`   Fecha: ${new Date(pedido.fecha_pedido).toLocaleString()}`);
        console.log(`   Total: $${pedido.total}`);
        
        // Verificar si tiene mensajes de chat
        const mensajes = await chatCollection.find({ pedidoId: pedido._id.toString() }).toArray();
        console.log(`   Mensajes de chat: ${mensajes.length}`);
        console.log('---');
      }
      
      // Crear mensaje de prueba para el primer pedido si no tiene mensajes
      const primerPedido = pedidos[0];
      const mensajesExistentes = await chatCollection.find({ pedidoId: primerPedido._id.toString() }).toArray();
      
      if (mensajesExistentes.length === 0) {
        console.log(`\n💬 Creando mensaje de prueba para pedido ${primerPedido._id}`);
        
        const mensajePrueba = {
          pedidoId: primerPedido._id.toString(),
          mensaje: '¡Hola! Tu pedido ha sido recibido y está siendo procesado. Te mantendremos informado sobre el progreso.',
          remitente: 'admin',
          tipo: 'message',
          usuarioEmail: primerPedido.usuario?.email || 'test@test.com',
          timestamp: new Date(),
          leido: false
        };
        
        await chatCollection.insertOne(mensajePrueba);
        console.log('✅ Mensaje de prueba creado');
      }
    } else {
      console.log('❌ No se encontraron pedidos en la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

verificarPedidos();
