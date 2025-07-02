import nodemailer from 'nodemailer';
import fs from 'fs';

const setupEtherealEmail = async () => {
  try {
    console.log('🔧 Configurando email de prueba con Ethereal...\n');
    
    // Crear cuenta de prueba en Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('✅ Cuenta de prueba creada:');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('SMTP:', testAccount.smtp.host + ':' + testAccount.smtp.port);
    
    // Actualizar archivo .env
    const envContent = `# Configuración de Email para desarrollo (Ethereal - Testing)
EMAIL_USER=${testAccount.user}
EMAIL_PASS=${testAccount.pass}

# URL del Frontend 
FRONTEND_URL=http://localhost:5174

# Configuración de la aplicación
NODE_ENV=development

# Puerto del servidor
PORT=4001

# Configuración SMTP Ethereal
SMTP_HOST=${testAccount.smtp.host}
SMTP_PORT=${testAccount.smtp.port}
`;

    fs.writeFileSync('.env', envContent);
    
    console.log('\n✅ Archivo .env actualizado con credenciales de prueba');
    console.log('\n📧 Para ver los emails enviados:');
    console.log('🔗 Ve a: https://ethereal.email/messages');
    console.log('🔑 Usuario:', testAccount.user);
    console.log('🔑 Contraseña:', testAccount.pass);
    
    console.log('\n⚠️  NOTA: Los emails de Ethereal son solo para testing.');
    console.log('Para emails reales, configura Gmail siguiendo la guía en GUIA_CONFIGURACION_EMAIL.md');
    
    console.log('\n🔄 Reinicia el servidor backend para aplicar los cambios.');
    
  } catch (error) {
    console.error('❌ Error configurando email:', error.message);
  }
};

setupEtherealEmail();
