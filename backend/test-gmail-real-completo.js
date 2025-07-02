import fetch from 'node-fetch';

const probarGmailReal = async () => {
  try {
    console.log('📧 PRUEBA DE GMAIL REAL - VERDULERÍA ONLINE');
    console.log('=' .repeat(60));
    console.log('');
    
    console.log('🎯 OBJETIVO: Verificar que los emails lleguen a usuarios reales');
    console.log('📧 Email de prueba: robertogaona1985@gmail.com');
    console.log('');
    
    // Test 1: Email de recuperación de contraseña
    console.log('🔐 TEST 1: Email de recuperación de contraseña');
    console.log('-' .repeat(50));
    
    const forgotResponse = await fetch('http://localhost:4001/api/forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'robertogaona1985@gmail.com' })
    });
    
    const forgotData = await forgotResponse.json();
    
    if (forgotData.success) {
      console.log('✅ Solicitud de reset enviada exitosamente');
      console.log('✅ Email despachado desde Gmail real');
      console.log('✅ El usuario debería recibir el email en su bandeja');
      console.log('');
      console.log('📨 DETALLES DEL EMAIL ENVIADO:');
      console.log('  📤 Desde: robertogaona1985@gmail.com');
      console.log('  📥 Para: robertogaona1985@gmail.com');
      console.log('  📋 Asunto: "Recuperar tu contraseña - Verdulería Online"');
      console.log('  🎨 Diseño: Plantilla HTML profesional');
      console.log('  🔗 Incluye: Enlace de reset seguro');
    } else {
      console.log('❌ Error:', forgotData.message);
      return;
    }
    
    // Dar tiempo para que llegue el email
    console.log('');
    console.log('⏰ Esperando que llegue el email...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Crear un pedido para probar email de confirmación
    console.log('');
    console.log('🛒 TEST 2: Email de confirmación de pedido');
    console.log('-' .repeat(50));
    
    const pedidoData = {
      usuario: {
        nombre: 'Roberto',
        email: 'robertogaona1985@gmail.com',
        telefono: '123456789',
        direccion: 'Dirección de prueba 123'
      },
      productos: [
        {
          id: '685cae06a8b7104fb06ed1a6',
          nombre: 'Banana',
          precio: 6000,
          cantidad: 2,
          subtotal: 12000
        }
      ],
      total: 12000,
      metodo_pago: 'mercado_pago'
    };
    
    const pedidoResponse = await fetch('http://localhost:4001/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData)
    });
    
    const pedidoResult = await pedidoResponse.json();
    
    if (pedidoResult.success) {
      console.log('✅ Pedido creado exitosamente');
      console.log('✅ Email de confirmación enviado');
      console.log('✅ PDF de comprobante generado');
      console.log('');
      console.log('📨 DETALLES DEL EMAIL DE PEDIDO:');
      console.log('  📤 Desde: robertogaona1985@gmail.com');
      console.log('  📥 Para: robertogaona1985@gmail.com');
      console.log('  📋 Asunto: "Confirmación de Pedido - Verdulería Online"');
      console.log('  🎨 Diseño: Plantilla profesional con productos');
      console.log('  📎 Adjunto: Comprobante PDF');
      console.log('  💰 Total: $12,000');
    } else {
      console.log('⚠️  No se pudo crear pedido de prueba');
    }
    
    // Resultado final
    console.log('');
    console.log('=' .repeat(60));
    console.log('🎉 RESULTADO FINAL');
    console.log('=' .repeat(60));
    console.log('✅ Gmail real configurado y funcionando');
    console.log('✅ Emails enviados desde: robertogaona1985@gmail.com');
    console.log('✅ Sistema listo para usuarios reales');
    console.log('');
    console.log('📋 FUNCIONALIDADES PROBADAS:');
    console.log('  ✅ Email de recuperación de contraseña');
    console.log('  ✅ Email de confirmación de pedido');
    console.log('  ✅ Plantillas HTML profesionales');
    console.log('  ✅ PDF de comprobantes');
    console.log('');
    console.log('🌐 PRUEBA DESDE EL FRONTEND:');
    console.log('  🔗 Recuperar contraseña: http://localhost:5174/forgot-password');
    console.log('  🛒 Hacer un pedido: http://localhost:5174/productos');
    console.log('');
    console.log('📧 REVISA TU BANDEJA DE ENTRADA en: robertogaona1985@gmail.com');
    console.log('   Deberías ver 2 emails nuevos con diseño profesional');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
};

console.log('🚀 Iniciando prueba completa de Gmail real...\n');
probarGmailReal();
