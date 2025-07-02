// Script para probar el flujo de seguimiento de entregas
// Este script simula el cambio de estados de un pedido desde admin

const API_URL = 'http://localhost:4001/api';

// Función para obtener pedidos
const obtenerPedidos = async () => {
  try {
    const response = await fetch(`${API_URL}/pedidos`);
    const data = await response.json();
    console.log('📦 Pedidos encontrados:', data.length);
    
    data.forEach(pedido => {
      console.log(`- Pedido #${pedido._id.slice(-6)}: ${pedido.estado} - $${pedido.total}`);
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo pedidos:', error.message);
  }
};

// Función para cambiar estado de pedido
const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
  try {
    console.log(`🔄 Cambiando pedido ${pedidoId.slice(-6)} a estado: ${nuevoEstado}`);
    
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    const result = await response.json();
    
    if (response.ok && (result.success || result.ok)) {
      console.log(`✅ Pedido actualizado a: ${nuevoEstado}`);
      return true;
    } else {
      console.error('❌ Error actualizando pedido:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error en la petición:', error.message);
    return false;
  }
};

// Función principal para simular el flujo completo
const simularFlujoEntrega = async () => {
  console.log('🚀 Iniciando simulación del flujo de entrega...\n');
  
  // Obtener pedidos
  const pedidos = await obtenerPedidos();
  
  if (!pedidos || pedidos.length === 0) {
    console.log('❌ No hay pedidos para simular');
    return;
  }
  
  // Tomar el primer pedido que no esté entregado
  const pedidoParaSimular = pedidos.find(p => 
    ['pendiente', 'en_proceso'].includes(p.estado)
  );
  
  if (!pedidoParaSimular) {
    console.log('❌ No hay pedidos pendientes o en proceso para simular');
    return;
  }
  
  console.log(`\n🎯 Simulando flujo con pedido #${pedidoParaSimular._id.slice(-6)}`);
  console.log(`   Estado actual: ${pedidoParaSimular.estado}`);
  console.log(`   Cliente: ${pedidoParaSimular.usuario?.nombre || 'Usuario'}`);
  console.log(`   Total: $${pedidoParaSimular.total}`);
  
  // Simular el flujo paso a paso
  const flujo = [
    { estado: 'pendiente', descripcion: 'Pedido confirmado' },
    { estado: 'en_proceso', descripcion: 'Preparando pedido' },
    { estado: 'en_camino', descripcion: 'En camino al cliente' },
    { estado: 'entregado', descripcion: 'Entrega completada' }
  ];
  
  // Encontrar el índice actual
  const indiceActual = flujo.findIndex(f => f.estado === pedidoParaSimular.estado);
  
  if (indiceActual === -1) {
    console.log('❌ Estado actual no reconocido');
    return;
  }
  
  // Avanzar al siguiente estado
  if (indiceActual < flujo.length - 1) {
    const siguienteEstado = flujo[indiceActual + 1];
    console.log(`\n⏭️  Avanzando a: ${siguienteEstado.estado} (${siguienteEstado.descripcion})`);
    
    const exito = await cambiarEstadoPedido(pedidoParaSimular._id, siguienteEstado.estado);
    
    if (exito) {
      console.log('\n✅ Flujo simulado exitosamente!');
      console.log('👀 Ahora puedes:');
      console.log('   1. Ir a http://localhost:5173/seguimiento para ver el seguimiento como usuario');
      console.log('   2. Ir a http://localhost:5173/admin/pedidos para gestionar como admin');
      console.log('   3. Ejecutar este script nuevamente para avanzar al siguiente estado');
    }
  } else {
    console.log('\n🏁 El pedido ya está en el estado final (entregado)');
  }
};

// Función específica para poner un pedido "en camino"
const ponerEnCamino = async () => {
  console.log('🚚 Buscando pedidos para poner "en camino"...\n');
  
  const pedidos = await obtenerPedidos();
  
  if (!pedidos || pedidos.length === 0) {
    console.log('❌ No hay pedidos disponibles');
    return;
  }
  
  // Buscar pedidos en proceso
  const pedidosEnProceso = pedidos.filter(p => p.estado === 'en_proceso');
  
  if (pedidosEnProceso.length === 0) {
    console.log('❌ No hay pedidos en proceso para poner en camino');
    console.log('💡 Tip: Cambia algún pedido a "en_proceso" primero desde el panel admin');
    return;
  }
  
  const pedido = pedidosEnProceso[0];
  console.log(`🎯 Poniendo en camino pedido #${pedido._id.slice(-6)}`);
  
  const exito = await cambiarEstadoPedido(pedido._id, 'en_camino');
  
  if (exito) {
    console.log('\n✅ ¡Pedido en camino!');
    console.log('🔍 Ve a http://localhost:5173/seguimiento para ver el progreso visual');
  }
};

// Ejecutar la función principal
console.log('='.repeat(60));
console.log('🚚 SIMULADOR DE FLUJO DE ENTREGAS - VERDULERÍA ONLINE');
console.log('='.repeat(60));

// Ejecutar simulación
simularFlujoEntrega();

// Exportar funciones para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    obtenerPedidos,
    cambiarEstadoPedido,
    simularFlujoEntrega,
    ponerEnCamino
  };
}
