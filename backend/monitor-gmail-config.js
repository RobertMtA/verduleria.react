import fs from 'fs';
import fetch from 'node-fetch';

const monitorearConfiguracion = () => {
  console.log('👀 MONITOREANDO CONFIGURACIÓN DE GMAIL...');
  console.log('=' .repeat(50));
  console.log('');
  console.log('📋 PASOS PENDIENTES:');
  console.log('1. Obtener App Password de Google');
  console.log('2. Actualizar archivo .env');
  console.log('3. Reiniciar servidor');
  console.log('');
  console.log('⏰ Verificando cada 10 segundos...');
  console.log('');

  const verificarCambios = async () => {
    try {
      // Leer .env actual
      const envContent = fs.readFileSync('.env', 'utf8');
      const emailUser = envContent.match(/EMAIL_USER=(.+)/)?.[1];
      const emailPass = envContent.match(/EMAIL_PASS=(.+)/)?.[1];
      
      // Verificar si es Gmail real
      const esGmailReal = emailUser?.includes('@gmail.com') && 
                         emailPass && 
                         emailPass.length >= 16 && 
                         !emailUser.includes('ethereal');
      
      if (esGmailReal) {
        console.log('🎉 ¡GMAIL DETECTADO!');
        console.log('=' .repeat(30));
        console.log('✅ Email configurado:', emailUser);
        console.log('✅ App Password configurada');
        console.log('');
        console.log('🔄 Verificando servidor...');
        
        // Verificar si el servidor está corriendo
        try {
          const response = await fetch('http://localhost:4001/api/productos');
          if (response.ok) {
            console.log('✅ Servidor backend corriendo');
            console.log('');
            console.log('🧪 PROBANDO ENVÍO DE EMAIL...');
            
            // Probar envío de email
            const testResponse = await fetch('http://localhost:4001/api/forgot_password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'robertogaona1985@gmail.com' })
            });
            
            const testData = await testResponse.json();
            
            if (testData.success) {
              console.log('🎉 ¡EMAIL ENVIADO CON GMAIL REAL!');
              console.log('=' .repeat(40));
              console.log('✅ Sistema configurado correctamente');
              console.log('✅ Emails llegarán a usuarios reales');
              console.log('✅ Listo para producción');
              console.log('');
              console.log('🔗 Prueba desde: http://localhost:5174/forgot-password');
              console.log('');
              process.exit(0);
            } else {
              console.log('❌ Error enviando email:', testData.message);
              console.log('💡 Revisa las credenciales en .env');
            }
          } else {
            console.log('⚠️  Servidor no responde - Reinicia con: npm start');
          }
        } catch (serverError) {
          console.log('⚠️  Servidor backend no está corriendo');
          console.log('🔄 Ejecuta: npm start');
        }
        
        console.log('');
        console.log('⏰ Siguiendo monitoreando...');
      } else {
        // Mostrar estado actual
        process.stdout.write('⏳ Esperando configuración Gmail... ');
        if (emailUser && !emailUser.includes('ethereal')) {
          process.stdout.write(`(Email: ${emailUser}) `);
        }
        process.stdout.write('\r');
      }
      
    } catch (error) {
      console.log('❌ Error leyendo configuración:', error.message);
    }
  };

  // Verificar inmediatamente y luego cada 10 segundos
  verificarCambios();
  const interval = setInterval(verificarCambios, 10000);
  
  // Limpiar en caso de Ctrl+C
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n\n👋 Monitoreo detenido');
    process.exit(0);
  });
};

monitorearConfiguracion();
