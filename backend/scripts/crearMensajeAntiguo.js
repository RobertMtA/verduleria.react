// scripts/crearMensajeAntiguo.js
// Script para crear un mensaje con fecha antigua para probar la limpieza

import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

const crearMensajeAntiguo = async () => {
  const client = new MongoClient(uri);
  
  try {
    console.log('🧪 Creando mensaje antiguo para probar limpieza...\n');
    
    await client.connect();
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    const pedidosCollection = db.collection('pedidos');
    
    // Obtener un pedido existente
    const pedido = await pedidosCollection.findOne({});
    
    if (!pedido) {
      console.log('❌ No hay pedidos para asociar el mensaje');
      return;
    }
    
    // Crear mensaje con fecha de hace 25 horas (debe ser eliminado)
    const hace25Horas = new Date(Date.now() - 25 * 60 * 60 * 1000);
    
    const mensajeAntiguo = {
      pedidoId: pedido._id.toString(),
      mensaje: 'Este es un mensaje antiguo que debería ser eliminado automáticamente',
      remitente: 'usuario',
      tipo: 'mensaje',
      usuarioEmail: 'test@test.com',
      timestamp: hace25Horas,
      leido: false
    };
    
    const resultado = await chatCollection.insertOne(mensajeAntiguo);
    console.log(`✅ Mensaje antiguo creado con ID: ${resultado.insertedId}`);
    console.log(`📅 Fecha del mensaje: ${hace25Horas.toISOString()}`);
    console.log(`⏰ Edad: 25 horas (debería ser eliminado por TTL)`);
    
    // Mostrar estadísticas actuales
    console.log('\n📊 Estadísticas después de crear mensaje antiguo:');
    const totalMensajes = await chatCollection.countDocuments();
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const mensajesRecientes = await chatCollection.countDocuments({
      timestamp: { $gte: hace24Horas }
    });
    const mensajesAntiguos = await chatCollection.countDocuments({
      timestamp: { $lt: hace24Horas }
    });
    
    console.log(`- Total de mensajes: ${totalMensajes}`);
    console.log(`- Mensajes recientes: ${mensajesRecientes}`);
    console.log(`- Mensajes antiguos: ${mensajesAntiguos}`);
    
    console.log('\n⏳ MongoDB TTL eliminará este mensaje en los próximos 60 segundos...');
    console.log('💡 Puedes verificar con: node scripts/verificarChat.js');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
};

// Ejecutar
crearMensajeAntiguo();
