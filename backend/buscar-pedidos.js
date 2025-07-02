import { MongoClient } from 'mongodb';

const buscarPedidos = async () => {
  const client = new MongoClient('mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0');
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('verduleria');
    const pedidos = await db.collection('pedidos').find({}).limit(3).toArray();
    
    console.log(`📦 Pedidos encontrados: ${pedidos.length}`);
    console.log('');
    
    pedidos.forEach((p, i) => {
      console.log(`${i+1}. ID Completo: ${p._id}`);
      console.log(`   ID Corto: ${p._id.toString().slice(-8)}`);
      console.log(`   Usuario: ${p.usuario.nombre} (${p.usuario.email})`);
      console.log(`   Total: $${p.total}`);
      console.log(`   Estado: ${p.estado}`);
      console.log(`   Fecha: ${p.fecha_pedido || p.fecha}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
};

buscarPedidos();
