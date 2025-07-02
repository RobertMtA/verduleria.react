import { enviarEmailConfirmacion } from './services/emailService.js';
import { generarComprobantePDF } from './services/pdfService.js';
import dotenv from 'dotenv';
import fs from 'fs';

// Cargar variables de entorno
dotenv.config();

// Datos de pedido de prueba
const pedidoPrueba = {
  _id: "6756f123abc123def456789a",
  usuario: {
    nombre: "Roberto Testeo",
    email: "tu-email-de-prueba@gmail.com", // 👈 CAMBIA ESTE EMAIL
    direccion: "Av. Corrientes 1234, CABA, Buenos Aires",
    telefono: "+54 11 1234-5678"
  },
  productos: [
    {
      nombre: "Tomates Cherry Orgánicos",
      cantidad: 2,
      precio: 850,
      subtotal: 1700
    },
    {
      nombre: "Lechuga Mantecosa",
      cantidad: 1,
      precio: 650,
      subtotal: 650
    },
    {
      nombre: "Zanahorias Orgánicas (kg)",
      cantidad: 1,
      precio: 1200,
      subtotal: 1200
    },
    {
      nombre: "Espinaca Fresca (atado)",
      cantidad: 2,
      precio: 400,
      subtotal: 800
    },
    {
      nombre: "Manzanas Rojas (kg)",
      cantidad: 1,
      precio: 950,
      subtotal: 950
    }
  ],
  total: 5300,
  estado: "pendiente",
  metodo_pago: "mercadopago",
  fecha_pedido: new Date(),
  fecha: new Date()
};

console.log('🧪 ===============================');
console.log('🥬 VERDULERÍA ONLINE - TEST SUITE');
console.log('🧪 ===============================');
console.log('');

console.log('📧 Configuración de Email:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER || '❌ NO CONFIGURADO');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ CONFIGURADO' : '❌ NO CONFIGURADO');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5174');
console.log('- Destinatario:', pedidoPrueba.usuario.email);
console.log('');

if (pedidoPrueba.usuario.email === "tu-email-de-prueba@gmail.com") {
  console.log('⚠️  IMPORTANTE: Debes cambiar el email destinatario en test-email.js');
  console.log('');
}

const probarEmail = async () => {
  console.log('📧 ======= PRUEBA DE EMAIL =======');
  try {
    const resultado = await enviarEmailConfirmacion(pedidoPrueba);
    
    if (resultado.success) {
      console.log('✅ ¡Email enviado exitosamente!');
      console.log('📩 Message ID:', resultado.messageId);
      console.log('');
      console.log('🎉 ¡Revisa tu bandeja de entrada y carpeta de SPAM!');
    } else {
      console.log('❌ Error enviando email:', resultado.error);
      console.log('');
      console.log('🔧 Posibles soluciones:');
      console.log('1. Verifica que EMAIL_USER y EMAIL_PASS estén correctos en .env');
      console.log('2. Asegúrate de haber habilitado 2FA en Gmail');
      console.log('3. Genera un App Password específico para esta aplicación');
      console.log('4. Verifica que el email destinatario sea válido');
    }
  } catch (error) {
    console.log('💥 Error inesperado:', error.message);
  }
};

const probarPDF = async () => {
  console.log('📄 ======= PRUEBA DE PDF =======');
  try {
    const resultado = await generarComprobantePDF(pedidoPrueba);
    
    if (resultado.success) {
      // Guardar el PDF de prueba
      const nombreArchivo = `comprobante-prueba-${Date.now()}.pdf`;
      fs.writeFileSync(nombreArchivo, resultado.buffer);
      
      console.log('✅ ¡PDF generado exitosamente!');
      console.log('📁 Archivo guardado como:', nombreArchivo);
      console.log('📊 Tamaño del archivo:', (resultado.buffer.length / 1024).toFixed(2), 'KB');
      console.log('');
      console.log('🎉 ¡Abre el archivo PDF para verificar el formato!');
    } else {
      console.log('❌ Error generando PDF:', resultado.error);
    }
  } catch (error) {
    console.log('💥 Error inesperado generando PDF:', error.message);
  }
};

const probarEmailConPDF = async () => {
  console.log('📧📎 ===== PRUEBA EMAIL + PDF =====');
  try {
    const resultado = await enviarEmailConfirmacion(pedidoPrueba, true); // Con PDF adjunto
    
    if (resultado.success) {
      console.log('✅ ¡Email con PDF enviado exitosamente!');
      console.log('📩 Message ID:', resultado.messageId);
      console.log('📎 PDF adjunto automáticamente');
      console.log('');
      console.log('🎉 ¡Revisa tu bandeja de entrada y descarga el PDF!');
    } else {
      console.log('❌ Error enviando email con PDF:', resultado.error);
    }
  } catch (error) {
    console.log('💥 Error inesperado enviando email con PDF:', error.message);
  }
};

const ejecutarPruebas = async () => {
  await probarEmail();
  console.log('');
  await probarPDF();
  console.log('');
  await probarEmailConPDF();
  console.log('');
  console.log('🎯 ===============================');
  console.log('✨ PRUEBAS COMPLETADAS');
  console.log('🎯 ===============================');
  console.log('');
  console.log('📋 Pasos siguientes:');
  console.log('1. Verificar que llegaron los emails (revisar SPAM)');
  console.log('2. Abrir el archivo PDF generado localmente');
  console.log('3. Verificar que el email tiene el PDF adjunto');
  console.log('4. Probar desde el frontend creando un pedido real');
  console.log('5. Configurar en producción con credenciales reales');
  console.log('');
  console.log('📧 Endpoints disponibles:');
  console.log('- POST /api/pedidos/:id/enviar-email (email simple)');
  console.log('- POST /api/pedidos/:id/enviar-email-con-pdf (email con PDF)');
  console.log('- GET /api/pedidos/:id/comprobante (descargar PDF)');
};

ejecutarPruebas();
