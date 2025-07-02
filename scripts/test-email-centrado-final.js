const mongoose = require('mongoose');
const emailService = require('../backend/services/emailService');

// Configuración de conexión a MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/verduleria_online';

async function testEmailCentradoFinal() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear un pedido de prueba con múltiples productos
    const pedidoPrueba = {
      _id: new mongoose.Types.ObjectId(),
      usuario: {
        nombre: 'María González',
        email: 'maria.gonzalez@gmail.com'
      },
      productos: [
        {
          nombre: 'Tomates Cherry Orgánicos',
          cantidad: 2,
          precio: 850,
          subtotal: 1700
        },
        {
          nombre: 'Lechuga Criolla Premium',
          cantidad: 1,
          precio: 420,
          subtotal: 420
        },
        {
          nombre: 'Naranjas Valencia',
          cantidad: 3,
          precio: 150,
          subtotal: 450
        }
      ],
      total: 2570,
      estado: 'confirmado',
      metodo_pago: 'efectivo',
      direccion_entrega: 'Av. Corrientes 1234, CABA',
      fecha_pedido: new Date(),
      notas: 'Entregar en portería. Timbre: Apt 4B'
    };

    console.log('📧 Enviando email de prueba con centrado final mejorado...');
    
    const resultado = await emailService.enviarEmailConfirmacion(pedidoPrueba);
    
    if (resultado.success) {
      console.log('✅ Email enviado exitosamente!');
      console.log(`📮 Enviado a: ${pedidoPrueba.usuario.email}`);
      console.log('🎯 El email incluye:');
      console.log('   - Carrito centrado con tabla HTML para máxima compatibilidad');
      console.log('   - Tilde de confirmación centrado usando estructura de tabla');
      console.log('   - Diseño responsive para móviles y escritorio');
      console.log('   - Íconos de información alineados correctamente');
      console.log('');
      console.log('📱 VERIFICACIÓN REQUERIDA:');
      console.log('   1. Abrir email en Gmail (móvil y web)');
      console.log('   2. Verificar que el carrito esté perfectamente centrado');
      console.log('   3. Verificar que la tilde verde esté perfectamente centrada');
      console.log('   4. Verificar que los íconos de información estén alineados');
      console.log('   5. Verificar responsividad en diferentes tamaños de pantalla');
    } else {
      console.error('❌ Error al enviar email:', resultado.error);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    console.log('🔄 Cerrando conexión...');
    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
  }
}

// Ejecutar la prueba
testEmailCentradoFinal();
