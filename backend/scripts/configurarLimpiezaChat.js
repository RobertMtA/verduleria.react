// Script para configurar limpieza automática de mensajes de chat
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

async function configurarLimpieza() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // 1. Mostrar estadísticas actuales
    console.log('\n📊 ESTADÍSTICAS ACTUALES:');
    const totalMensajes = await chatCollection.countDocuments();
    console.log(`Total de mensajes: ${totalMensajes}`);
    
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const mensajesRecientes = await chatCollection.countDocuments({
      timestamp: { $gte: hace24Horas }
    });
    const mensajesAntiguos = await chatCollection.countDocuments({
      timestamp: { $lt: hace24Horas }
    });
    
    console.log(`Mensajes recientes (últimas 24h): ${mensajesRecientes}`);
    console.log(`Mensajes antiguos (más de 24h): ${mensajesAntiguos}`);
    
    // 2. Verificar si existe el índice TTL
    console.log('\n🔍 VERIFICANDO ÍNDICES:');
    const indices = await chatCollection.listIndexes().toArray();
    const indiceTTL = indices.find(index => 
      index.expireAfterSeconds !== undefined
    );
    
    if (indiceTTL) {
      console.log('✅ Índice TTL ya configurado:');
      console.log(`   - Expira después de: ${indiceTTL.expireAfterSeconds} segundos (${indiceTTL.expireAfterSeconds / 3600} horas)`);
    } else {
      console.log('❌ No se encontró índice TTL');
      
      // Crear índice TTL
      console.log('\n🔧 CONFIGURANDO ÍNDICE TTL...');
      await chatCollection.createIndex(
        { "timestamp": 1 }, 
        { expireAfterSeconds: 24 * 60 * 60 } // 24 horas
      );
      console.log('✅ Índice TTL configurado (24 horas)');
    }
    
    // 3. Limpiar mensajes antiguos manualmente (una vez)
    if (mensajesAntiguos > 0) {
      console.log('\n🧹 LIMPIEZA MANUAL DE MENSAJES ANTIGUOS:');
      const resultado = await chatCollection.deleteMany({
        timestamp: { $lt: hace24Horas }
      });
      console.log(`✅ ${resultado.deletedCount} mensajes antiguos eliminados`);
    } else {
      console.log('\n✅ No hay mensajes antiguos para eliminar');
    }
    
    // 4. Mostrar estadísticas finales
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    const totalFinal = await chatCollection.countDocuments();
    console.log(`Total de mensajes: ${totalFinal}`);
    
    // 5. Obtener tamaño de la colección
    try {
      const stats = await db.command({ collStats: 'chat_messages' });
      const tamañoMB = Math.round(stats.size / (1024 * 1024) * 100) / 100;
      console.log(`Tamaño de la colección: ${tamañoMB} MB`);
    } catch (error) {
      console.log('No se pudo obtener el tamaño de la colección');
    }
    
    console.log('\n🎉 CONFIGURACIÓN COMPLETADA:');
    console.log('✅ Los mensajes se eliminarán automáticamente después de 24 horas');
    console.log('✅ MongoDB TTL se ejecuta aproximadamente cada 60 segundos');
    console.log('✅ La base de datos se mantendrá limpia automáticamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

configurarLimpieza();
