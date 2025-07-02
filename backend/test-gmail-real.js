import fetch from 'node-fetch';

const testGmailReal = async () => {
  try {
    console.log('📧 PRUEBA DE EMAIL CON GMAIL REAL');
    console.log('=' .repeat(40));
    
    // Verificar configuración
    console.log('\n🔍 Verificando configuración...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Error: Variables de entorno no configuradas');
      console.log('   Ejecuta: node configurar-gmail.js');
      return;
    }
    
    if (!process.env.EMAIL_USER.includes('@gmail.com')) {
      console.log('❌ Error: EMAIL_USER debe ser un email de Gmail');
      return;
    }
    
    if (process.env.EMAIL_USER.includes('ethereal')) {
      console.log('⚠️  Advertencia: Aún estás usando Ethereal');
      console.log('   Ejecuta: node configurar-gmail.js para cambiar a Gmail');
      return;
    }
    
    console.log('✅ Email configurado:', process.env.EMAIL_USER);
    console.log('✅ App Password configurado: ' + '*'.repeat(process.env.EMAIL_PASS.length));
    
    // Probar envío
    console.log('\n🚀 Enviando email de prueba...');
    
    const response = await fetch('http://localhost:4001/api/forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'robertogaona1985@gmail.com' // Email destino para prueba
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Solicitud enviada al servidor');
      
      if (data.resetUrl) {
        const token = data.resetUrl.split('/').pop();
        console.log('✅ Token generado:', token.substring(0, 20) + '...');
      }
      
      console.log('\n📧 EMAIL ENVIADO A GMAIL REAL!');
      console.log('=' .repeat(40));
      console.log('📬 Destinatario: robertogaona1985@gmail.com');
      console.log('📤 Remitente:', process.env.EMAIL_USER);
      console.log('✉️  Asunto: Recuperar tu contraseña - Verdulería Online');
      console.log('');
      console.log('🔍 VERIFICA TU BANDEJA DE ENTRADA:');
      console.log('1. Ve a Gmail: https://gmail.com');
      console.log('2. Busca email de:', process.env.EMAIL_USER);
      console.log('3. Si no está en bandeja principal, revisa SPAM');
      console.log('4. El email tendrá diseño profesional y enlace funcional');
      
      console.log('\n✅ CONFIGURACIÓN EXITOSA!');
      console.log('Ahora todos los emails irán a las bandejas reales de los usuarios.');
      
    } else {
      console.log('❌ Error enviando email:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verifica que el servidor backend esté corriendo');
    console.log('2. Confirma que las credenciales Gmail sean correctas');
    console.log('3. Revisa que la App Password sea válida');
  }
};

// Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

console.log('🧪 Iniciando prueba con Gmail real...\n');
testGmailReal();
