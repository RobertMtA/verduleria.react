import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PaymentResult.css';

const PaymentPending = () => {
  const location = useLocation();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(location.search);
    const paymentId = urlParams.get('payment_id');
    const status = urlParams.get('status');
    const preferenceId = urlParams.get('preference_id');
    
    console.log('⏳ Pago pendiente - Parámetros:', {
      paymentId,
      status,
      preferenceId
    });

    // Countdown para auto-refresh
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          window.location.reload();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  return (
    <div className="payment-result-container">
      <div className="pending-container">
        <div className="pending-icon">⏳</div>
        <h1>Pago Pendiente</h1>
        <p className="pending-message">
          Tu pago está siendo procesado. Esto puede tomar unos minutos.
        </p>

        <div className="pending-info">
          <div className="info-card">
            <h3>🔄 Estado del Pago</h3>
            <p>Estamos verificando tu pago con el banco.</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

          <div className="info-card">
            <h3>⏰ Tiempo de Procesamiento</h3>
            <p>Los pagos pueden tardar entre 1-10 minutos en confirmarse.</p>
            <p className="countdown">
              Actualizando en: <strong>{countdown}s</strong>
            </p>
          </div>
        </div>

        <div className="pending-types">
          <h3>Dependiendo del método de pago:</h3>
          <ul>
            <li>💳 <strong>Tarjeta de crédito:</strong> 1-3 minutos</li>
            <li>🏦 <strong>Transferencia:</strong> 1-2 días hábiles</li>
            <li>🏪 <strong>Pago en efectivo:</strong> Hasta 3 días hábiles</li>
            <li>💰 <strong>Saldo en cuenta:</strong> Inmediato</li>
          </ul>
        </div>

        <div className="next-steps">
          <h3>¿Qué hacer mientras esperas?</h3>
          <ul>
            <li>📧 Revisa tu email por actualizaciones</li>
            <li>📱 Mantén tu teléfono disponible</li>
            <li>🔍 Puedes consultar el estado en "Mi Perfil"</li>
            <li>⚠️ No realices el pago nuevamente</li>
          </ul>
        </div>

        <div className="actions">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            🔄 Actualizar Estado
          </button>
          <Link to="/perfil" className="btn btn-secondary">
            Ver Mis Pedidos
          </Link>
          <Link to="/productos" className="btn btn-outline">
            Seguir Comprando
          </Link>
        </div>

        <div className="support">
          <p>
            Si el pago no se confirma en 30 minutos, 
            <Link to="/contacto" className="support-link"> contáctanos </Link>
            con el número de transacción.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
