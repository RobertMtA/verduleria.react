import fetch from 'node-fetch';

const generateResetToken = async () => {
  try {
    console.log('🔗 Generando nuevo token de reset...\n');
    
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
    
    if (data.success && data.resetUrl) {
      console.log('✅ Token generado exitosamente!');
      console.log('\n🔗 URL completa:');
      console.log(data.resetUrl);
      
      const token = data.resetUrl.split('/').pop();
      console.log('\n🎫 Token:', token);
      
      console.log('\n🌐 Puedes probar el frontend en:');
      console.log(`http://localhost:5174/reset-password/${token}`);
      
    } else {
      console.log('❌ Error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

generateResetToken();
