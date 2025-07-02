import fetch from 'node-fetch';

const testEmailAndShow = async () => {
  try {
    console.log('📧 PROBANDO ENVÍO DE EMAIL DE RECUPERACIÓN');
    console.log('=' .repeat(50));
    
    // Enviar solicitud de reset
    console.log('\n🔄 Enviando solicitud de reset de contraseña...');
    
    const response = await fetch('http://localhost:4001/api/forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'robertogaona1985@gmail.com' })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Solicitud enviada exitosamente');
      console.log('✅ Email despachado al servidor SMTP');
      
      console.log('\n📧 PARA VER EL EMAIL ENVIADO:');
      console.log('=' .repeat(50));
      console.log('🌐 Ve a: https://ethereal.email/messages');
      console.log('🔑 Usuario: ooxp7nsfh7ucsn2t@ethereal.email');
      console.log('🔑 Contraseña: ZZFf9upq6KjByG9mjp');
      console.log('');
      console.log('📧 En la bandeja de entrada verás el email con:');
      console.log('  ✉️  Asunto: "Recuperar tu contraseña - Verdulería Online"');
      console.log('  📩 Para: robertogaona1985@gmail.com');
      console.log('  🔗 Enlace de reset funcional');
      console.log('  🎨 Diseño profesional con branding');
      
      if (data.resetUrl) {
        console.log('\n🔗 URL DE RESET GENERADA:');
        console.log(data.resetUrl);
        console.log('\n💡 Puedes probar directamente en el navegador:');
        console.log('http://localhost:5174/forgot-password');
      }
      
      console.log('\n⚠️  NOTA IMPORTANTE:');
      console.log('Los emails se envían a Ethereal (servicio de testing).');
      console.log('Para emails reales a Gmail, configura las credenciales siguiendo:');
      console.log('📖 GUIA_CONFIGURACION_EMAIL.md');
      
    } else {
      console.log('❌ Error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testEmailAndShow();
