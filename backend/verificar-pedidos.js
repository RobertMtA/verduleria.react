import { MongoClient } from 'mongodb';

const verificarPedidos = async () => {
  const client = new MongoClient('mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0');
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('verduleria');
    const pedidos = await db.collection('pedidos').find({}).toArray();
    
    console.log(`📦 Total de pedidos: ${pedidos.length}`);
    console.log('');
    
    pedidos.forEach((p, i) => {
      const idCorto = p._id.toString().slice(-8);
      console.log(`${i+1}. ID Completo: ${p._id}`);
      console.log(`   ID Corto: ${idCorto}`);
      console.log(`   Usuario: ${p.usuario.nombre} (${p.usuario.email})`);
      console.log(`   Productos: ${p.productos.length} items`);
      p.productos.forEach(prod => {
        console.log(`     - ${prod.nombre}: ${prod.cantidad}x $${prod.precio} = $${prod.subtotal}`);
      });
      console.log(`   Total: $${p.total}`);
      console.log(`   Estado: ${p.estado}`);
      console.log(`   Fecha: ${new Date(p.fecha_pedido).toLocaleString('es-ES')}`);
      console.log('---');
    });
    
    // Buscar específicamente el que termina en 4c8e20e9
    const pedidoBuscado = pedidos.find(p => p._id.toString().endsWith('4c8e20e9'));
    if (pedidoBuscado) {
      console.log('🎯 PEDIDO ENCONTRADO que termina en 4c8e20e9:');
      console.log('ID:', pedidoBuscado._id.toString());
      console.log('Usuario:', pedidoBuscado.usuario.nombre);
      console.log('Email:', pedidoBuscado.usuario.email);
      console.log('Productos:', pedidoBuscado.productos.length);
      console.log('Total:', pedidoBuscado.total);
      console.log('Estado:', pedidoBuscado.estado);
    } else {
      console.log('❌ No se encontró pedido que termine en 4c8e20e9');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
};

verificarPedidos();
