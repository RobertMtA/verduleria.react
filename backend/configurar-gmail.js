import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configurarGmail = () => {
  console.log('🔧 CONFIGURADOR DE GMAIL PARA EMAILS REALES');
  console.log('=' .repeat(50));
  console.log('');
  console.log('📋 ANTES DE CONTINUAR, ASEGÚRATE DE TENER:');
  console.log('1. ✅ Tu email de Gmail');
  console.log('2. ✅ App Password de Gmail generado');
  console.log('   (NO tu contraseña normal)');
  console.log('');
  console.log('❓ Si no tienes App Password, sigue la guía en:');
  console.log('   📖 CONFIGURAR_GMAIL_REAL.md');
  console.log('');

  rl.question('📧 Ingresa tu email de Gmail: ', (email) => {
    if (!email.includes('@gmail.com')) {
      console.log('❌ Error: Debe ser un email de Gmail (@gmail.com)');
      rl.close();
      return;
    }

    rl.question('🔐 Ingresa tu App Password (16 caracteres): ', (password) => {
      // Limpiar espacios del password
      const cleanPassword = password.replace(/\s/g, '');
      
      if (cleanPassword.length !== 16) {
        console.log('❌ Error: App Password debe tener exactamente 16 caracteres');
        console.log('   Ejemplo: abcdefghijklmnop (sin espacios)');
        rl.close();
        return;
      }

      // Crear nuevo archivo .env
      const envContent = `# Configuración de Email REAL para Gmail
EMAIL_USER=${email}
EMAIL_PASS=${cleanPassword}

# URL del Frontend 
FRONTEND_URL=http://localhost:5174

# Configuración de la aplicación
NODE_ENV=development

# Puerto del servidor
PORT=4001
`;

      try {
        // Backup del archivo actual
        if (fs.existsSync('.env')) {
          fs.copyFileSync('.env', '.env.backup');
          console.log('📄 Backup creado: .env.backup');
        }

        // Escribir nuevo .env
        fs.writeFileSync('.env', envContent);
        
        console.log('');
        console.log('✅ CONFIGURACIÓN COMPLETADA!');
        console.log('');
        console.log('📧 Email configurado:', email);
        console.log('🔐 App Password configurado: ' + '*'.repeat(16));
        console.log('');
        console.log('🔄 PRÓXIMOS PASOS:');
        console.log('1. Reinicia el servidor backend');
        console.log('2. Prueba envío de email');
        console.log('3. Verifica que llegue a la bandeja real');
        console.log('');
        console.log('🧪 COMANDO PARA PROBAR:');
        console.log('node test-gmail-real.js');
        
      } catch (error) {
        console.log('❌ Error escribiendo archivo .env:', error.message);
      }

      rl.close();
    });
  });
};

console.log('🚀 Iniciando configuración de Gmail...\n');
configurarGmail();
