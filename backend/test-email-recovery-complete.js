import fetch from 'node-fetch';

const testEmailRecoveryFlow = async () => {
  try {
    console.log('🧪 PRUEBA COMPLETA DEL FLUJO DE RECUPERACIÓN DE CONTRASEÑA');
    console.log('=' .repeat(60));
    
    const email = 'robertogaona1985@gmail.com';
    
    // Paso 1: Solicitar reset de contraseña
    console.log('\n📧 PASO 1: Solicitando reset de contraseña...');
    
    const forgotResponse = await fetch('http://localhost:4001/api/forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const forgotData = await forgotResponse.json();
    
    console.log('✅ Solicitud enviada:');
    console.log('  - Status:', forgotResponse.status);
    console.log('  - Success:', forgotData.success);
    console.log('  - Message:', forgotData.message);
    
    if (!forgotData.success || !forgotData.resetUrl) {
      console.log('❌ Error: No se generó el enlace de reset');
      return;
    }
    
    // Extraer token
    const token = forgotData.resetUrl.split('/').pop();
    console.log('\n🎫 Token generado:', token.substring(0, 20) + '...');
    console.log('🔗 URL completa:', forgotData.resetUrl);
    
    // Paso 2: Simular que el usuario hace clic en el enlace y cambia su contraseña
    console.log('\n🔄 PASO 2: Simulando reset de contraseña...');
    
    const newPassword = 'nuevaContrasena' + Date.now();
    
    const resetResponse = await fetch('http://localhost:4001/api/reset_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        newPassword: newPassword
      })
    });
    
    const resetData = await resetResponse.json();
    
    console.log('✅ Contraseña actualizada:');
    console.log('  - Status:', resetResponse.status);
    console.log('  - Success:', resetData.success);
    console.log('  - Message:', resetData.message);
    
    if (!resetData.success) {
      console.log('❌ Error:', resetData.error);
      return;
    }
    
    // Paso 3: Verificar que el login funciona con la nueva contraseña
    console.log('\n🔐 PASO 3: Verificando login con nueva contraseña...');
    
    const loginResponse = await fetch('http://localhost:4001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: newPassword
      })
    });
    
    const loginData = await loginResponse.json();
    
    console.log('✅ Login verificado:');
    console.log('  - Status:', loginResponse.status);
    console.log('  - Success:', loginData.success);
    
    if (loginData.success) {
      console.log('  - Usuario:', loginData.user.nombre);
      console.log('  - Email:', loginData.user.email);
    }
    
    // Paso 4: Verificar que el token ya no es válido
    console.log('\n🚫 PASO 4: Verificando que el token ya no es válido...');
    
    const reusedTokenResponse = await fetch('http://localhost:4001/api/reset_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        newPassword: 'otraContrasena123'
      })
    });
    
    const reusedTokenData = await reusedTokenResponse.json();
    
    console.log('✅ Token invalidado correctamente:');
    console.log('  - Status:', reusedTokenResponse.status);
    console.log('  - Success:', reusedTokenData.success);
    console.log('  - Error:', reusedTokenData.error);
    
    // Resumen final
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 RESULTADO FINAL:');
    
    if (forgotData.success && resetData.success && loginData.success && !reusedTokenData.success) {
      console.log('✅ ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
      console.log('');
      console.log('✅ Flujo de recuperación funcionando correctamente');
      console.log('✅ Generación de token funcionando');
      console.log('✅ Validación de token funcionando');
      console.log('✅ Cambio de contraseña funcionando');
      console.log('✅ Login con nueva contraseña funcionando');
      console.log('✅ Invalidación de token usado funcionando');
      console.log('');
      console.log('🌐 URLs para probar en navegador:');
      console.log('  - Login: http://localhost:5174/login');
      console.log('  - Forgot Password: http://localhost:5174/forgot-password');
      console.log('  - Reset Password: http://localhost:5174/reset-password/[token]');
      
    } else {
      console.log('❌ Algunas pruebas fallaron. Revisar logs arriba.');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:', error.message);
    console.error('Stack:', error.stack);
  }
};

console.log('🚀 Iniciando prueba completa del sistema de recuperación...\n');
testEmailRecoveryFlow();
