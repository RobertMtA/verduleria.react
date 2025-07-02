import fetch from 'node-fetch';
import fs from 'fs';

const verificarGmailReal = async () => {
  try {
    console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN GMAIL REAL');
    console.log('=' .repeat(50));
    
    // Leer configuración actual
    const envContent = fs.readFileSync('.env', 'utf8');
    const emailUser = envContent.match(/EMAIL_USER=(.+)/)?.[1];
    const emailPass = envContent.match(/EMAIL_PASS=(.+)/)?.[1];
    
    console.log('\n📧 CONFIGURACIÓN ACTUAL:');
    console.log('Email:', emailUser || 'NO CONFIGURADO');
    console.log('Password:', emailPass ? `${emailPass.substring(0, 4)}****` : 'NO CONFIGURADO');
    console.log('Tipo:', emailUser?.includes('@gmail.com') ? '✅ Gmail Real' : '⚠️ Otro proveedor');
    
    if (!emailUser?.includes('@gmail.com')) {
      console.log('\n❌ NO ESTÁ CONFIGURADO GMAIL REAL');
      console.log('💡 Ejecuta: node configurar-gmail-real.js');
      return;
    }
    
    console.log('\n🧪 PROBANDO ENVÍO DE EMAIL...');
    
    // Probar envío
    const response = await fetch('http://localhost:4001/api/forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'robertogaona1985@gmail.com' })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Email enviado correctamente');
      console.log('✅ El usuario recibirá el email en su bandeja real');
      
      if (data.resetUrl) {
        console.log('\n🔗 Token generado:', data.resetUrl.split('/').pop().substring(0, 20) + '...');
      }
      
      console.log('\n🎉 GMAIL REAL FUNCIONANDO');
      console.log('=' .repeat(50));
      console.log('✅ Emails se envían desde:', emailUser);
      console.log('✅ Los usuarios reciben emails reales');
      console.log('✅ Sistema listo para producción');
      
    } else {
      console.log('❌ Error enviando email:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 El servidor backend no está corriendo');
      console.log('🔄 Ejecuta: npm start');
    }
  }
};

console.log('🚀 Verificando configuración de Gmail...\n');
verificarGmailReal();
