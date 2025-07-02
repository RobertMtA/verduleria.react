import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PaymentResult.css';

const TransferInstructions = () => {
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (!state) {
      // Si no hay estado, redirigir al inicio
      window.location.href = '/';
    }
  }, [state]);

  if (!state) {
    return (
      <div className="payment-result-container">
        <div className="error-container">
          <h2>Error: No se encontraron datos del pedido</h2>
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  const { pedidoId, cliente, total, email } = state;

  const bankData = {
    banco: "Banco Nación",
    titular: "Verdulería Online S.A.",
    cbu: "0110599520000012345678",
    alias: "VERDURA.ONLINE.SA",
    cuit: "30-12345678-9"
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('¡Copiado al portapapeles!');
    });
  };

  return (
    <div className="payment-result-container">
      <div className="transfer-container">
        <div className="transfer-icon">🏦</div>
        <h1>Instrucciones de Transferencia</h1>
        <p className="transfer-message">
          Completa tu pago realizando una transferencia bancaria
        </p>

        <div className="order-summary">
          <h3>📦 Resumen del Pedido</h3>
          <div className="summary-details">
            <div className="detail-row">
              <span>Número de Pedido:</span>
              <span><strong>#{pedidoId?.slice(-8)}</strong></span>
            </div>
            <div className="detail-row">
              <span>Cliente:</span>
              <span>{cliente}</span>
            </div>
            <div className="detail-row">
              <span>Total a Transferir:</span>
              <span className="total-amount"><strong>${total?.toLocaleString('es-AR')}</strong></span>
            </div>
          </div>
        </div>

        <div className="bank-details">
          <h3>💳 Datos Bancarios</h3>
          <div className="bank-info">
            <div className="bank-row">
              <span>Banco:</span>
              <span>{bankData.banco}</span>
            </div>
            <div className="bank-row">
              <span>Titular:</span>
              <span>{bankData.titular}</span>
            </div>
            <div className="bank-row">
              <span>CBU:</span>
              <div className="copyable">
                <span>{bankData.cbu}</span>
                <button 
                  onClick={() => copyToClipboard(bankData.cbu)}
                  className="copy-btn"
                  title="Copiar CBU"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="bank-row">
              <span>Alias:</span>
              <div className="copyable">
                <span>{bankData.alias}</span>
                <button 
                  onClick={() => copyToClipboard(bankData.alias)}
                  className="copy-btn"
                  title="Copiar Alias"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="bank-row">
              <span>CUIT:</span>
              <span>{bankData.cuit}</span>
            </div>
          </div>
        </div>

        <div className="transfer-instructions">
          <h3>📋 Instrucciones</h3>
          <ol>
            <li>
              <strong>Realiza la transferencia</strong> por el monto exacto de <strong>${total?.toLocaleString('es-AR')}</strong>
            </li>
            <li>
              <strong>En el concepto o referencia</strong> incluye: "Pedido #{pedidoId?.slice(-8)}"
            </li>
            <li>
              <strong>Envía el comprobante</strong> por email a: 
              <a href={`mailto:pagos@verduleria.com?subject=Comprobante Pedido ${pedidoId?.slice(-8)}&body=Hola! Adjunto el comprobante de transferencia para el pedido ${pedidoId?.slice(-8)}. Cliente: ${cliente}`} 
                 className="email-link">
                pagos@verduleria.com
              </a>
            </li>
            <li>
              <strong>Una vez verificado el pago</strong>, confirmaremos tu pedido por email
            </li>
          </ol>
        </div>

        <div className="important-notes">
          <h3>⚠️ Importante</h3>
          <ul>
            <li>El pedido se reservará por <strong>48 horas</strong></li>
            <li>Incluye siempre el número de pedido en la transferencia</li>
            <li>Los pagos se verifican en horarios bancarios</li>
            <li>Recibirás confirmación por email una vez verificado</li>
          </ul>
        </div>

        <div className="quick-actions">
          <h3>🚀 Acciones Rápidas</h3>
          <div className="quick-buttons">
            <button 
              onClick={() => copyToClipboard(`CBU: ${bankData.cbu}\nAlias: ${bankData.alias}\nImporte: $${total?.toLocaleString('es-AR')}\nConcepto: Pedido #${pedidoId?.slice(-8)}`)}
              className="btn btn-primary"
            >
              📋 Copiar Todos los Datos
            </button>
            <a 
              href={`mailto:pagos@verduleria.com?subject=Comprobante Pedido ${pedidoId?.slice(-8)}&body=Hola! Adjunto el comprobante de transferencia para el pedido ${pedidoId?.slice(-8)}. Cliente: ${cliente}. Importe: $${total?.toLocaleString('es-AR')}`}
              className="btn btn-secondary"
            >
              📧 Abrir Email
            </a>
          </div>
        </div>

        <div className="actions">
          <Link to="/perfil" className="btn btn-outline">
            Ver Mi Pedido
          </Link>
          <Link to="/productos" className="btn btn-outline">
            Seguir Comprando
          </Link>
        </div>

        <div className="support">
          <p>
            ¿Tienes problemas? 
            <Link to="/contacto" className="support-link"> Contáctanos </Link>
            y te ayudaremos con tu transferencia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransferInstructions;
