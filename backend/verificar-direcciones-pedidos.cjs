const mongoose = require('mongoose');

// Configuración de conexión a MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/verduleria_online';

async function verificarDireccionesPedidos() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Definir el esquema de pedido para consulta
    const pedidoSchema = new mongoose.Schema({}, { strict: false });
    const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidos');

    console.log('📋 Consultando pedidos para verificar direcciones...');
    
    const pedidos = await Pedido.find({}).limit(10);
    
    console.log(`\n📊 Encontrados ${pedidos.length} pedidos para análisis:\n`);
    
    pedidos.forEach((pedido, index) => {
      console.log(`${index + 1}. Pedido ID: ${pedido._id}`);
      console.log(`   Cliente: ${pedido.usuario?.nombre || pedido.cliente || "Sin nombre"}`);
      console.log(`   Email: ${pedido.usuario?.email || "Sin email"}`);
      
      // Verificar diferentes campos de dirección
      const direcciones = {
        'usuario.direccion': pedido.usuario?.direccion,
        'direccion_entrega': pedido.direccion_entrega,
        'direccion': pedido.direccion,
        'usuario.direccion_completa': pedido.usuario?.direccion_completa
      };
      
      console.log(`   📍 Direcciones disponibles:`);
      Object.entries(direcciones).forEach(([campo, valor]) => {
        if (valor) {
          console.log(`      ${campo}: ${valor}`);
        }
      });
      
      if (!Object.values(direcciones).some(d => d)) {
        console.log(`   ⚠️  No se encontró dirección en ningún campo`);
      }
      
      console.log(`   Estado: ${pedido.estado || "Sin estado"}`);
      console.log(`   Total: $${pedido.total || 0}`);
      console.log(`   Fecha: ${pedido.fecha_pedido || pedido.fecha || "Sin fecha"}`);
      console.log('   ---');
    });

    console.log('\n🔧 RECOMENDACIONES:');
    console.log('   1. Verificar que el frontend envíe la dirección en el campo correcto');
    console.log('   2. Asegurar que el backend guarde la dirección en usuario.direccion');
    console.log('   3. El componente PedidosAdmin ahora busca en múltiples campos:');
    console.log('      - usuario.direccion (principal)');
    console.log('      - direccion_entrega (alternativo)');
    console.log('      - direccion (alternativo)');

  } catch (error) {
    console.error('❌ Error verificando direcciones:', error.message);
  } finally {
    console.log('\n🔄 Cerrando conexión...');
    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
  }
}

// Ejecutar la verificación
verificarDireccionesPedidos();
