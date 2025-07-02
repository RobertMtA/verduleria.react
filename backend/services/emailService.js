import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configuración del transportador de email
const createTransporter = () => {
  // Configuración para Gmail con App Password
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER.includes('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Configuración para Ethereal (testing) o otros proveedores SMTP
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Configuración por defecto para desarrollo
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass'
    }
  });
};

// Plantilla HTML mejorada para el email de confirmación
const createEmailTemplate = (pedido) => {
  const fecha = new Date(pedido.fecha_pedido || pedido.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const numeroCorto = (pedido._id?.toString() || pedido.id?.toString() || 'N/A').slice(-8).toUpperCase();
  
  const productosHtml = pedido.productos.map(producto => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 8px; text-align: left; font-weight: 500;">${producto.nombre}</td>
      <td style="padding: 12px 8px; text-align: center; color: #666;">${producto.cantidad}x</td>
      <td style="padding: 12px 8px; text-align: right; color: #333;">$${Number(producto.precio).toLocaleString('es-AR')}</td>
      <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #4CAF50;">$${Number(producto.subtotal || (producto.cantidad * producto.precio)).toLocaleString('es-AR')}</td>
    </tr>
  `).join('');

  const tiempoEntrega = obtenerTiempoEntrega(pedido.estado);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Pedido Confirmado! - Verdulería Online</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      </style>
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
      
      <!-- Header Principal -->
      <div style="background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 0;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 25px; width: 90px; height: 90px;">
          <tr>
            <td style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 90px; height: 90px; text-align: center; vertical-align: middle; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <span style="font-size: 45px; line-height: 1; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🛒</span>
            </td>
          </tr>
        </table>
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">¡Gracias por tu compra!</h1>
        <p style="margin: 0; font-size: 18px; opacity: 0.95; font-weight: 500;">${pedido.usuario.nombre}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.8;">Tu pedido ha sido confirmado exitosamente</p>
      </div>

      <!-- Contenido Principal -->
      <div style="background: white; margin: 0; padding: 0;">
        
        <!-- Status Banner -->
        <div style="background: linear-gradient(90deg, #E8F5E8 0%, #F1F8E9 100%); padding: 25px 30px; border-left: 5px solid #4CAF50;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td style="width: 55px; vertical-align: top; padding-right: 15px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 55px; height: 55px; background: #4CAF50; border-radius: 50%; box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3);">
                  <tr>
                    <td style="width: 55px; height: 55px; text-align: center; vertical-align: middle; color: white; font-size: 24px; font-weight: bold; line-height: 1;">
                      <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">✓</span>
                    </td>
                  </tr>
                </table>
              </td>
              <td style="vertical-align: top;">
                <h2 style="margin: 0; color: #2E7D32; font-size: 20px; font-weight: 600;">Pedido #${numeroCorto} Confirmado</h2>
                <p style="margin: 5px 0 0 0; color: #388E3C; font-size: 14px;">📅 ${fecha} • ⏱️ ${tiempoEntrega}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Información del Pedido -->
        <div style="padding: 30px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            
            <!-- Resumen de Pago -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border: 1px solid #e9ecef;">
              <h3 style="color: #4CAF50; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px; line-height: 1; display: flex; align-items: center;">💳</span>
                Información de Pago
              </h3>
              <div style="space-y: 8px;">
                <p style="margin: 6px 0; font-size: 14px;"><strong>Total Pagado:</strong> <span style="color: #4CAF50; font-weight: 700; font-size: 18px;">$${Number(pedido.total).toLocaleString('es-AR')}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Método:</strong> ${obtenerMetodoPago(pedido.metodo_pago)}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Estado:</strong> <span style="background: #4CAF50; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase; font-weight: 600;">Pagado</span></p>
              </div>
            </div>

            <!-- Información de Entrega -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border: 1px solid #e9ecef;">
              <h3 style="color: #4CAF50; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px; line-height: 1; display: flex; align-items: center;">🚚</span>
                Entrega
              </h3>
              <div style="space-y: 8px;">
                <p style="margin: 6px 0; font-size: 13px; line-height: 1.4;"><strong>Dirección:</strong><br>${pedido.usuario.direccion}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Teléfono:</strong> ${pedido.usuario.telefono}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Tiempo estimado:</strong> ${tiempoEntrega}</p>
              </div>
            </div>
          </div>

          <!-- Productos Ordenados -->
          <div style="margin: 30px 0;">
            <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 22px; line-height: 1; display: flex; align-items: center;">🛍️</span>
              Productos de tu Pedido
            </h3>
            <div style="background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e9ecef; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%); color: white;">
                    <th style="padding: 15px 12px; text-align: left; font-weight: 600; font-size: 14px;">Producto</th>
                    <th style="padding: 15px 12px; text-align: center; font-weight: 600; font-size: 14px;">Cant.</th>
                    <th style="padding: 15px 12px; text-align: right; font-weight: 600; font-size: 14px;">Precio</th>
                    <th style="padding: 15px 12px; text-align: right; font-weight: 600; font-size: 14px;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productosHtml}
                  <tr style="background: #f8f9fa; border-top: 2px solid #4CAF50;">
                    <td colspan="3" style="padding: 15px 12px; text-align: right; font-weight: 600; font-size: 16px; color: #333;">TOTAL:</td>
                    <td style="padding: 15px 12px; text-align: right; font-weight: 700; font-size: 18px; color: #4CAF50;">$${Number(pedido.total).toLocaleString('es-AR')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Próximos Pasos -->
          <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border: 1px solid #FFB74D; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #E65100; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
              📋 ¿Qué sigue ahora?
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #FF9800; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">1</span>
                <span style="color: #E65100; font-size: 14px;">Tu pedido está siendo preparado con productos frescos</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #FF9800; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">2</span>
                <span style="color: #E65100; font-size: 14px;">Te notificaremos cuando esté en camino</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #FF9800; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">3</span>
                <span style="color: #E65100; font-size: 14px;">Puedes hacer seguimiento desde tu perfil</span>
              </div>
            </div>
          </div>

          <!-- Call to Action Buttons -->
          <div style="text-align: center; margin: 35px 0; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/perfil/seguimiento" 
               style="background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); transition: all 0.3s ease;">
              🔍 Seguir mi Pedido
            </a>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/productos" 
               style="background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3); transition: all 0.3s ease;">
              🛒 Seguir Comprando
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #2E7D32; color: white; padding: 30px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">🥬 Verdulería Online</h4>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Productos frescos directo a tu hogar</p>
          </div>
          
          <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
            <p style="margin: 5px 0; font-size: 13px; opacity: 0.8; display: flex; align-items: center; gap: 5px; justify-content: center;">
              <span style="font-size: 14px; line-height: 1;">�</span>
              <strong>Dirección:</strong> ${process.env.DIRECCION_NEGOCIO || 'Tucumán 766'}
            </p>
            <p style="margin: 5px 0; font-size: 13px; opacity: 0.8; display: flex; align-items: center; gap: 5px; justify-content: center;">
              <span style="font-size: 14px; line-height: 1;">�📞</span>
              <strong>Contacto:</strong> +54 11 1234-5678 | 
              <span style="font-size: 14px; line-height: 1;">📧</span>
              <strong>Email:</strong> <a href="mailto:info@verduleria.com" style="color: #81C784;">info@verduleria.com</a>
            </p>
            <p style="margin: 5px 0; font-size: 13px; opacity: 0.8; display: flex; align-items: center; gap: 5px; justify-content: center;">
              <span style="font-size: 14px; line-height: 1;">🕒</span>
              <strong>Horarios:</strong> Lunes a Domingo de 8:00 a 22:00
            </p>
            <p style="margin: 15px 0 5px 0; font-size: 12px; opacity: 0.7;">
              Gracias por elegir Verdulería Online para tus compras de productos frescos
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Funciones auxiliares
const obtenerTiempoEntrega = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pendiente': return '30-60 minutos';
    case 'en_proceso': return '20-45 minutos';
    case 'en_camino': return '10-25 minutos';
    case 'entregado': return 'Entregado';
    default: return '30-60 minutos';
  }
};

const obtenerMetodoPago = (metodo) => {
  switch (metodo?.toLowerCase()) {
    case 'mercadopago': return 'MercadoPago';
    case 'tarjeta': return 'Tarjeta de Crédito/Débito';
    case 'efectivo': return 'Efectivo';
    case 'transferencia': return 'Transferencia Bancaria';
    default: return 'MercadoPago';
  }
};

// Función para enviar email de confirmación
export const enviarEmailConfirmacion = async (pedido, adjuntarPDF = false) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"🥬 Verdulería Online" <${process.env.EMAIL_USER || 'noreply@verduleria.com'}>`,
      to: pedido.usuario.email,
      subject: `✅ Pedido Confirmado #${(pedido._id?.toString() || pedido.id?.toString() || 'N/A').slice(-8)} - Verdulería Online`,
      html: createEmailTemplate(pedido),
      attachments: []
    };

    // Adjuntar PDF si se solicita
    if (adjuntarPDF) {
      try {
        const { generarComprobantePDF } = await import('./pdfService.js');
        const pdfResult = await generarComprobantePDF(pedido);
        
        if (pdfResult.success) {
          mailOptions.attachments.push({
            filename: pdfResult.fileName,
            content: pdfResult.buffer,
            contentType: 'application/pdf'
          });
          console.log('📎 PDF adjuntado al email');
        }
      } catch (pdfError) {
        console.warn('⚠️ No se pudo adjuntar el PDF:', pdfError.message);
      }
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar email de reset de contraseña
export const enviarEmailResetPassword = async (usuario, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    const resetEmailTemplate = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperar Contraseña - Verdulería Online</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
        
        <!-- Header Principal -->
        <div style="background: linear-gradient(135deg, #FF9800 0%, #FF7043 50%, #FF5722 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 0;">
          <div style="background: rgba(255,255,255,0.1); border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 40px;">🔐</span>
          </div>
          <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Recuperar Contraseña</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.95; font-weight: 500;">Hola ${usuario.nombre}</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.8;">Hemos recibido una solicitud para restablecer tu contraseña</p>
        </div>

        <!-- Contenido Principal -->
        <div style="background: white; margin: 0; padding: 30px;">
          
          <!-- Mensaje Principal -->
          <div style="background: linear-gradient(90deg, #FFF3E0 0%, #FFE0B2 100%); padding: 25px 30px; border-left: 5px solid #FF9800; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; color: #E65100; font-size: 20px; font-weight: 600;">🔑 Restablecer tu contraseña</h2>
            <p style="margin: 0; color: #BF360C; font-size: 16px;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Verdulería Online. 
              Si no solicitaste este cambio, puedes ignorar este email.
            </p>
          </div>

          <!-- Botón de Acción -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #FF9800 0%, #FF7043 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 25px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3); transition: all 0.3s ease;">
              🔐 Restablecer Contraseña
            </a>
          </div>

          <!-- Instrucciones -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Instrucciones:</h3>
            <ol style="margin: 0; padding-left: 20px; color: #666;">
              <li style="margin-bottom: 8px;">Haz clic en el botón "Restablecer Contraseña"</li>
              <li style="margin-bottom: 8px;">Serás redirigido a una página segura</li>
              <li style="margin-bottom: 8px;">Ingresa tu nueva contraseña</li>
              <li style="margin-bottom: 8px;">Confirma los cambios</li>
            </ol>
          </div>

          <!-- Información de Seguridad -->
          <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border: 1px solid #2196F3; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #1565C0; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              🛡️ Información de Seguridad
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #1976D2; font-size: 14px;">
              <li style="margin-bottom: 8px;">Este enlace expira en <strong>1 hora</strong></li>
              <li style="margin-bottom: 8px;">Solo puede usarse una vez</li>
              <li style="margin-bottom: 8px;">Si no solicitaste este cambio, ignora este email</li>
              <li style="margin-bottom: 8px;">Tu contraseña actual permanece segura</li>
            </ul>
          </div>

          <!-- Enlace Manual -->
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            <p style="margin: 0; word-break: break-all; font-size: 12px; color: #2196F3;">
              ${resetUrl}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #2E7D32; color: white; padding: 30px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">🥬 Verdulería Online</h4>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Productos frescos directo a tu hogar</p>
          </div>
          
          <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
            <p style="margin: 5px 0; font-size: 13px; opacity: 0.8;">
              📞 <strong>Soporte:</strong> +54 11 1234-5678 | 
              📧 <strong>Email:</strong> <a href="mailto:soporte@verduleria.com" style="color: #81C784;">soporte@verduleria.com</a>
            </p>
            <p style="margin: 15px 0 5px 0; font-size: 12px; opacity: 0.7;">
              Este email fue enviado desde una dirección automática. No responder.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: `"🥬 Verdulería Online - Soporte" <${process.env.EMAIL_USER || 'noreply@verduleria.com'}>`,
      to: usuario.email,
      subject: `🔐 Recuperar Contraseña - Verdulería Online`,
      html: resetEmailTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de reset enviado exitosamente:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email de reset:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar notificación al admin de nueva venta
export const enviarEmailNotificacionAdmin = async (pedido) => {
  try {
    const transporter = createTransporter();
    
    const fecha = new Date(pedido.fecha_pedido || pedido.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const numeroCorto = (pedido._id?.toString() || pedido.id?.toString() || 'N/A').slice(-8).toUpperCase();
    
    const productosHtml = pedido.productos.map(producto => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px; text-align: left;">${producto.nombre}</td>
        <td style="padding: 8px; text-align: center;">${producto.cantidad}x</td>
        <td style="padding: 8px; text-align: right;">$${Number(producto.precio).toLocaleString('es-AR')}</td>
        <td style="padding: 8px; text-align: right; font-weight: bold;">$${Number(producto.subtotal || (producto.cantidad * producto.precio)).toLocaleString('es-AR')}</td>
      </tr>
    `).join('');

    const adminEmailTemplate = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Venta - Verdulería Online</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        
        <!-- Header Admin -->
        <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🚨 ¡NUEVA VENTA!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Pedido #${numeroCorto}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">${fecha}</p>
        </div>

        <!-- Información del Cliente -->
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 15px 0; color: #FF6B35; font-size: 20px;">👤 Información del Cliente</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 120px;">Nombre:</td>
              <td style="padding: 5px 0;">${pedido.usuario.nombre}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Email:</td>
              <td style="padding: 5px 0;">${pedido.usuario.email}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Teléfono:</td>
              <td style="padding: 5px 0;">${pedido.usuario.telefono || 'No proporcionado'}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Dirección:</td>
              <td style="padding: 5px 0;">${pedido.direccion || 'Por definir'}</td>
            </tr>
          </table>
        </div>

        <!-- Productos del Pedido -->
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 15px 0; color: #FF6B35; font-size: 20px;">🛒 Productos del Pedido</h2>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #ddd;">Producto</th>
                <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #ddd;">Cant.</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Precio</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productosHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; text-align: right;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #FF6B35;">
              Total: $${Number(pedido.total).toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        <!-- Información del Pago -->
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 15px 0; color: #FF6B35; font-size: 20px;">💳 Información del Pago</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 120px;">Método:</td>
              <td style="padding: 5px 0;">${obtenerMetodoPago(pedido.metodo_pago)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Estado:</td>
              <td style="padding: 5px 0;">
                <span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  ${pedido.estado?.toUpperCase() || 'PENDIENTE'}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Acciones Rápidas -->
        <div style="background: white; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px 0; color: #FF6B35; font-size: 20px;">⚡ Acciones Rápidas</h2>
          <div style="margin: 15px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/admin/pedidos" 
               style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">
              Ver en Admin Panel
            </a>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/admin/pedidos" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">
              Cambiar Estado
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; color: #666;">
          <p style="margin: 0; font-size: 14px;">🥬 Verdulería Online - ${process.env.DIRECCION_NEGOCIO || 'Tucumán 766'}</p>
          <p style="margin: 5px 0; font-size: 12px;">Este es un email automático del sistema de Verdulería Online</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">Generado el ${fecha}</p>
        </div>

      </body>
      </html>
    `;

    const mailOptions = {
      from: `"🥬 Sistema Verdulería Online" <${process.env.EMAIL_USER || 'noreply@verduleria.com'}>`,
      to: process.env.ADMIN_EMAIL || 'admin@verduleria.com',
      subject: `🚨 NUEVA VENTA #${numeroCorto} - $${Number(pedido.total).toLocaleString('es-AR')} - ${pedido.usuario.nombre}`,
      html: adminEmailTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de notificación admin enviado exitosamente:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email de notificación admin:', error);
    return { success: false, error: error.message };
  }
};

export default {
  enviarEmailConfirmacion,
  enviarEmailResetPassword,
  enviarEmailNotificacionAdmin
};
