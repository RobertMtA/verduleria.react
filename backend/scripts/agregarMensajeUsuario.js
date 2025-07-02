// Script para agregar mensaje del usuario
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

async function agregarMensajeUsuario() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Buscar el pedido de prueba
    const pedidoId = '686453f317ee8c056b55ceb2';
    
    // Crear mensaje del usuario
    const mensajeUsuario = {
      pedidoId: pedidoId,
      mensaje: 'Hola, ¿podrían confirmar el estado de mi pedido? Gracias!',
      remitente: 'user',
      tipo: 'message',
      usuarioEmail: 'test@verduleria.com',
      timestamp: new Date(),
      leido: false
    };
    
    console.log('💬 Agregando mensaje del usuario...');
    await chatCollection.insertOne(mensajeUsuario);
    console.log('✅ Mensaje del usuario agregado');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

agregarMensajeUsuario();
