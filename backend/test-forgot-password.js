import fetch from 'node-fetch';

const testForgotPassword = async () => {
  try {
    console.log('🧪 Iniciando prueba de recuperación de contraseña...\n');
    
    const response = await fetch('http://localhost:4001/api/forgot_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'robertogaona1985@gmail.com'
      })
    });
    
    const data = await response.json();
    
    console.log('📤 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Message:', data.message);
    
    if (data.resetUrl) {
      console.log('\n🔗 URL de reset generada:');
      console.log(data.resetUrl);
      
      // Extraer el token del URL
      const token = data.resetUrl.split('/').pop();
      console.log('\n🎫 Token extraído:', token);
      
      // Simular el reset de contraseña
      console.log('\n🔄 Probando reset de contraseña...');
      
      const resetResponse = await fetch('http://localhost:4001/api/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: 'nuevapassword123'
        })
      });
      
      const resetData = await resetResponse.json();
      
      console.log('\n📥 Respuesta del reset:');
      console.log('Status:', resetResponse.status);
      console.log('Success:', resetData.success);
      console.log('Message:', resetData.message);
      
      if (resetData.success) {
        console.log('\n✅ ¡Flujo de recuperación completado exitosamente!');
        
        // Probar login con nueva contraseña
        console.log('\n🔐 Probando login con nueva contraseña...');
        
        const loginResponse = await fetch('http://localhost:4001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'robertogaona1985@gmail.com',
            password: 'nuevapassword123'
          })
        });
        
        const loginData = await loginResponse.json();
        
        console.log('\n🔑 Respuesta del login:');
        console.log('Status:', loginResponse.status);
        console.log('Success:', loginData.success);
        
        if (loginData.success) {
          console.log('✅ Login exitoso con nueva contraseña!');
        } else {
          console.log('❌ Error en login:', loginData.error);
        }
      } else {
        console.log('\n❌ Error en reset:', resetData.error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
};

// Ejecutar la prueba
testForgotPassword();
