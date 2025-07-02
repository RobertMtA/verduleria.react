// Script para verificar las fechas de los pedidos en la base de datos
const API_URL = 'http://localhost:4001/api';

const verificarFechasPedidos = async () => {
  try {
    console.log('🔍 Verificando fechas de pedidos...\n');
    
    const response = await fetch(`${API_URL}/pedidos`);
    const pedidos = await response.json();
    
    console.log(`📦 Total de pedidos encontrados: ${pedidos.length}\n`);
    
    pedidos.forEach((pedido, index) => {
      const numero = pedido._id.slice(-6);
      const fechaPedido = pedido.fecha_pedido;
      const fecha = pedido.fecha;
      const estado = pedido.estado;
      
      console.log(`${index + 1}. Pedido #${numero} (${estado})`);
      console.log(`   fecha_pedido: ${fechaPedido}`);
      console.log(`   fecha: ${fecha}`);
      
      if (fechaPedido) {
        const fechaFormateada = new Date(fechaPedido).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        console.log(`   ✅ Formateada: ${fechaFormateada}`);
      } else {
        console.log(`   ❌ Sin fecha válida`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error verificando fechas:', error.message);
  }
};

// Ejecutar verificación
verificarFechasPedidos();
