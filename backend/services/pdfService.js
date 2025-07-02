import htmlPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';

// Configuración de PDF
const pdfOptions = {
  format: 'A4',
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  printBackground: true,
  preferCSSPageSize: true
};

// Plantilla HTML mejorada para el comprobante PDF
const createReceiptTemplate = (pedido) => {
  const fecha = new Date(pedido.fecha_pedido || pedido.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const numeroCorto = (pedido._id?.toString() || pedido.id?.toString() || 'N/A').slice(-8).toUpperCase();
  const fechaActual = new Date().toLocaleDateString('es-ES');
  const horaActual = new Date().toLocaleTimeString('es-ES');

  const productosHtml = pedido.productos.map((producto, index) => `
    <tr style="${index % 2 === 0 ? 'background-color: #f9f9f9;' : ''}">
      <td style="padding: 12px 8px; border-bottom: 1px solid #ddd; font-size: 13px;">${producto.nombre}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #ddd; text-align: center; font-size: 13px;">${producto.cantidad}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #ddd; text-align: right; font-size: 13px;">$${Number(producto.precio).toLocaleString('es-AR')}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; font-size: 13px;">$${Number(producto.subtotal || (producto.cantidad * producto.precio)).toLocaleString('es-AR')}</td>
    </tr>
  `).join('');

  const obtenerEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { color: '#FF9800', texto: 'PENDIENTE' },
      'en_proceso': { color: '#2196F3', texto: 'EN PROCESO' },
      'en_camino': { color: '#9C27B0', texto: 'EN CAMINO' },
      'entregado': { color: '#4CAF50', texto: 'ENTREGADO' },
      'cancelado': { color: '#F44336', texto: 'CANCELADO' }
    };
    const info = estados[estado?.toLowerCase()] || estados['pendiente'];
    return `<span style="background: ${info.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${info.texto}</span>`;
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Comprobante de Pago - Verdulería Online</title>
      <style>
        @page { 
          size: A4; 
          margin: 20mm; 
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.4;
          font-size: 14px;
        }

        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          color: rgba(76, 175, 80, 0.08);
          z-index: -1;
          font-weight: bold;
          white-space: nowrap;
        }

        .header {
          background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
          color: white;
          padding: 30px 25px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
          animation: float 20s linear infinite;
        }

        .header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .header .subtitle {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }

        .company-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #4CAF50;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        .info-box {
          background: #f8f9fa;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .info-box h3 {
          margin: 0 0 12px 0;
          color: #4CAF50;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-box p {
          margin: 6px 0;
          font-size: 13px;
          line-height: 1.5;
        }

        .products-section {
          margin: 25px 0;
        }

        .section-title {
          color: #4CAF50;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #4CAF50;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .products-table th {
          background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
        }

        .products-table th:nth-child(2),
        .products-table th:nth-child(3),
        .products-table th:nth-child(4) {
          text-align: center;
        }

        .products-table th:nth-child(3),
        .products-table th:nth-child(4) {
          text-align: right;
        }

        .total-row {
          background: linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%);
          border-top: 2px solid #4CAF50;
        }

        .total-row td {
          padding: 15px 12px;
          font-weight: bold;
          font-size: 16px;
        }

        .total-amount {
          font-size: 20px;
          color: #4CAF50;
          font-weight: 700;
        }

        .summary-section {
          background: linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%);
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
          border: 1px solid #C8E6C9;
        }

        .footer {
          margin-top: 40px;
          padding: 25px 0;
          border-top: 2px solid #4CAF50;
          text-align: center;
          color: #666;
          font-size: 12px;
        }

        .footer .company-name {
          font-size: 16px;
          font-weight: 600;
          color: #4CAF50;
          margin-bottom: 8px;
        }

        .qr-code {
          float: right;
          width: 80px;
          height: 80px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #666;
          margin-left: 15px;
        }

        .status-badge {
          display: inline-block;
          margin-left: 8px;
        }

        .fiscal-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
          font-size: 12px;
          color: #856404;
        }

        @media print {
          .watermark {
            display: block;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark">VERDULERÍA ONLINE</div>
      
      <!-- Header Principal -->
      <div class="header">
        <h1>🧾 COMPROBANTE DE PAGO</h1>
        <p class="subtitle">Verdulería Online - Productos Frescos y Naturales</p>
      </div>

      <!-- Información de la Empresa -->
      <div class="company-info">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 8px 0; color: #4CAF50; font-size: 18px;">🥬 Verdulería Online S.A.S</h3>
            <p style="margin: 3px 0; font-size: 13px;"><strong>CUIT:</strong> 30-12345678-9</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Dirección:</strong> Av. Productos Frescos 1234, CABA</p>
            <p style="margin: 3px 0; font-size: 13px;"><strong>Tel:</strong> +54 11 1234-5678 | <strong>Email:</strong> info@verduleria.com</p>
          </div>
          <div class="qr-code">
            QR CODE
          </div>
        </div>
      </div>

      <!-- Grid de Información -->
      <div class="info-grid">
        <div class="info-box">
          <h3>📋 Datos del Pedido</h3>
          <p><strong>Número de Pedido:</strong> #${numeroCorto}</p>
          <p><strong>Fecha del Pedido:</strong> ${fecha}</p>
          <p><strong>Estado del Pedido:</strong> ${obtenerEstadoBadge(pedido.estado)}</p>
          <p><strong>Método de Pago:</strong> ${pedido.metodo_pago || 'MercadoPago'}</p>
          <p><strong>Condición de Venta:</strong> Contado</p>
        </div>
        
        <div class="info-box">
          <h3>👤 Datos del Cliente</h3>
          <p><strong>Nombre Completo:</strong> ${pedido.usuario.nombre}</p>
          <p><strong>Email:</strong> ${pedido.usuario.email}</p>
          <p><strong>Teléfono:</strong> ${pedido.usuario.telefono}</p>
          <p><strong>Dirección de Entrega:</strong><br>${pedido.usuario.direccion}</p>
        </div>
      </div>

      <!-- Sección de Productos -->
      <div class="products-section">
        <h2 class="section-title">🛍️ Detalle de Productos</h2>
        <table class="products-table">
          <thead>
            <tr>
              <th style="width: 45%;">Descripción del Producto</th>
              <th style="width: 15%; text-align: center;">Cantidad</th>
              <th style="width: 20%; text-align: right;">Precio Unitario</th>
              <th style="width: 20%; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productosHtml}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding: 15px 12px;">
                <strong>TOTAL GENERAL:</strong>
              </td>
              <td style="text-align: right; padding: 15px 12px;">
                <span class="total-amount">$${Number(pedido.total).toLocaleString('es-AR')}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen del Pago -->
      <div class="summary-section">
        <h3 style="margin: 0 0 15px 0; color: #4CAF50; font-size: 16px; display: flex; align-items: center; gap: 8px;">
          💳 Resumen del Pago
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Subtotal:</strong> $${Number(pedido.total).toLocaleString('es-AR')}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Descuentos:</strong> $0,00</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>IVA (21%):</strong> Incluido</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 5px 0; font-size: 18px; color: #4CAF50;"><strong>TOTAL PAGADO: $${Number(pedido.total).toLocaleString('es-AR')}</strong></p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">Pago procesado exitosamente</p>
          </div>
        </div>
      </div>

      <!-- Información Fiscal -->
      <div class="fiscal-info">
        <p style="margin: 0 0 8px 0; font-weight: bold;">📋 Información Fiscal y Legal</p>
        <p style="margin: 3px 0;">• Este comprobante es válido como documento fiscal electrónico</p>
        <p style="margin: 3px 0;">• IVA incluido en los precios según normativa vigente</p>
        <p style="margin: 3px 0;">• Régimen de facturación electrónica autorizado por AFIP</p>
        <p style="margin: 3px 0;">• Válido como comprobante de compra para garantías y devoluciones</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="company-name">🥬 Verdulería Online</div>
        <p>Comprobante generado electrónicamente - Válido sin firma autógrafa</p>
        <p><strong>Fecha de emisión:</strong> ${fechaActual} a las ${horaActual}</p>
        <p style="margin-top: 15px;">
          <strong>Política de devoluciones:</strong> 24 horas para productos frescos | 
          <strong>Garantía:</strong> Satisfacción 100% garantizada
        </p>
        <p style="margin-top: 10px; font-size: 11px; color: #888;">
          Para consultas sobre este comprobante: comprobantes@verduleria.com | Tel: +54 11 1234-5678
        </p>
      </div>
    </body>
    </html>
  `;
};

// Función para generar PDF del comprobante
export const generarComprobantePDF = async (pedido) => {
  try {
    const html = createReceiptTemplate(pedido);
    
    const file = {
      content: html
    };

    // Generar el PDF
    const pdfBuffer = await htmlPdf.generatePdf(file, pdfOptions);
    
    // Crear nombre del archivo
    const fileName = `comprobante-${(pedido._id?.toString() || pedido.id?.toString() || 'N/A').slice(-8)}.pdf`;
    
    console.log('✅ PDF generado exitosamente');
    
    return {
      success: true,
      buffer: pdfBuffer,
      fileName,
      contentType: 'application/pdf'
    };
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para guardar PDF en el servidor (opcional)
export const guardarComprobantePDF = async (pedido, outputDir = './comprobantes') => {
  try {
    // Crear directorio si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const result = await generarComprobantePDF(pedido);
    
    if (!result.success) {
      return result;
    }
    
    const filePath = path.join(outputDir, result.fileName);
    fs.writeFileSync(filePath, result.buffer);
    
    console.log('✅ PDF guardado en:', filePath);
    
    return {
      success: true,
      filePath,
      fileName: result.fileName
    };
    
  } catch (error) {
    console.error('❌ Error guardando PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generarComprobantePDF,
  guardarComprobantePDF
};
