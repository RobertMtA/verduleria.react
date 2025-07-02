import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configurarGmailReal = async () => {
  console.log('📧 CONFIGURADOR DE GMAIL REAL PARA VERDULERÍA ONLINE');
  console.log('=' .repeat(60));
  console.log('');
  
  console.log('🔐 PASO 1: CREAR APP PASSWORD EN GMAIL');
  console.log('1. Ve a: https://myaccount.google.com/');
  console.log('2. Seguridad → Verificación en 2 pasos (actívala si no está)');
  console.log('3. Contraseñas de aplicaciones → Generar nueva');
  console.log('4. App: "Correo", Dispositivo: "Otro" → "Verduleria Online"');
  console.log('5. Copia la contraseña de 16 caracteres');
  console.log('');
  
  // Solicitar email
  const emailUser = await new Promise(resolve => {
    rl.question('📧 Ingresa tu email de Gmail (ej: tuusuario@gmail.com): ', resolve);
  });
  
  if (!emailUser.includes('@gmail.com')) {
    console.log('❌ Error: Debe ser un email de Gmail (@gmail.com)');
    rl.close();
    return;
  }
  
  // Solicitar App Password
  const appPassword = await new Promise(resolve => {
    rl.question('🔑 Ingresa tu App Password de 16 caracteres (sin espacios): ', resolve);
  });
  
  if (appPassword.length < 16) {
    console.log('❌ Error: La App Password debe tener 16 caracteres');
    rl.close();
    return;
  }
  
  // Crear nuevo archivo .env
  const newEnvContent = `# Configuración de Email REAL para Gmail
EMAIL_USER=${emailUser}
EMAIL_PASS=${appPassword}

# URL del Frontend 
FRONTEND_URL=http://localhost:5174

# Configuración de la aplicación
NODE_ENV=production

# Puerto del servidor
PORT=4001
`;

  // Hacer backup del .env actual
  const currentEnv = fs.readFileSync('.env', 'utf8');
  fs.writeFileSync('.env.backup', currentEnv);
  console.log('✅ Backup creado: .env.backup');
  
  // Escribir nueva configuración
  fs.writeFileSync('.env', newEnvContent);
  console.log('✅ Archivo .env actualizado con Gmail real');
  
  console.log('');
  console.log('🎉 CONFIGURACIÓN COMPLETADA');
  console.log('=' .repeat(60));
  console.log('✅ Email configurado:', emailUser);
  console.log('✅ App Password configurada');
  console.log('✅ Modo: PRODUCCIÓN (emails reales)');
  console.log('');
  console.log('🔄 PRÓXIMOS PASOS:');
  console.log('1. Reinicia el servidor backend: npm start');
  console.log('2. Prueba desde: http://localhost:5174/forgot-password');
  console.log('3. Los emails llegarán a las bandejas reales de los usuarios');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('- Los emails ahora se envían desde tu Gmail real');
  console.log('- Asegúrate de que tu cuenta tenga buen standing');
  console.log('- Para desarrollo, puedes volver a Ethereal restaurando .env.backup');
  
  rl.close();
};

console.log('🚀 Iniciando configuración de Gmail real...\n');
configurarGmailReal().catch(console.error);
