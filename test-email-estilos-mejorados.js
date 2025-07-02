// Script para probar el email de confirmación con estilos mejorados
const API_URL = 'http://localhost:4001/api';

const enviarEmailPrueba = async () => {
  try {
    console.log('📧 Enviando email de prueba con estilos mejorados...\n');
    
    // Crear un pedido de prueba para generar el email
    const pedidoPrueba = {
      usuario: {
        nombre: "Roberto Gaona",
        email: "robertegaona1958@gmail.com", // Email real para recibir la prueba
        telefono: "+54 11 7766377",
        direccion: "Tucumán 766 piso 2 depto 192, CABA"
      },
      productos: [
        {
          nombre: "Banana",
          cantidad: 3,
          precio: 6000,
          subtotal: 18000,
          imagen: "img-banana1.jpg"
        },
        {
          nombre: "Cebolla",
          cantidad: 2,
          precio: 3800,
          subtotal: 7600,
          imagen: "img-cebollas1.jpg"
        }
      ],
      total: 25600,
      metodo_pago: "mercadopago",
      estado: "pendiente"
    };

    console.log('🛒 Datos del pedido de prueba:');
    console.log(`   Cliente: ${pedidoPrueba.usuario.nombre}`);
    console.log(`   Email: ${pedidoPrueba.usuario.email}`);
    console.log(`   Total: $${pedidoPrueba.total.toLocaleString()}`);
    console.log(`   Productos: ${pedidoPrueba.productos.length} items\n`);

    // Hacer la petición para crear el pedido y enviar email
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoPrueba)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Pedido creado exitosamente!');
      console.log(`   ID del pedido: ${result.pedido?._id || result._id}`);
      console.log('📧 Email de confirmación enviado con los nuevos estilos');
      console.log('\n📮 Revisa tu bandeja de entrada para ver:');
      console.log('   ✓ Carrito centrado con mejor diseño');
      console.log('   ✓ Tilde de confirmación mejorado');
      console.log('   ✓ Iconos perfectamente alineados');
      console.log('   ✓ Mejores espacios y proporções');
    } else {
      const error = await response.text();
      console.error('❌ Error al crear pedido:', error);
    }

  } catch (error) {
    console.error('❌ Error en el script:', error.message);
  }
};

// Función alternativa para probar solo el envío de email
const probarEmailExistente = async () => {
  try {
    console.log('📧 Probando email con pedido existente...\n');
    
    // Obtener un pedido existente
    const response = await fetch(`${API_URL}/pedidos`);
    const pedidos = await response.json();
    
    if (pedidos.length > 0) {
      const pedido = pedidos[0];
      console.log(`🎯 Usando pedido existente: #${pedido._id.slice(-6)}`);
      
      // Llamar al endpoint de reenvío de email
      const emailResponse = await fetch(`${API_URL}/pedidos/${pedido._id}/reenviar-email`, {
        method: 'POST'
      });
      
      if (emailResponse.ok) {
        console.log('✅ Email reenviado con estilos mejorados!');
        console.log('📮 Revisa tu bandeja de entrada');
      } else {
        console.error('❌ Error al reenviar email');
      }
    } else {
      console.log('❌ No hay pedidos existentes');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Ejecutar la prueba
console.log('='.repeat(60));
console.log('📧 PRUEBA DE EMAIL CON ESTILOS MEJORADOS');
console.log('='.repeat(60));

// Usar la función principal
enviarEmailPrueba();
