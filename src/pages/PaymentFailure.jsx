import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PaymentResult.css';

const PaymentFailure = () => {
  const location = useLocation();

  useEffect(() => {
    // Obtener parámetros de la URL para debugging
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    const preferenceId = urlParams.get('preference_id');
    
    console.log('❌ Pago fallido - Parámetros:', {
      status,
      preferenceId
    });
  }, [location]);

  return (
    <div className="payment-result-container">
      <div className="failure-container">
        <div className="failure-icon">😔</div>
        <h1>Pago No Completado</h1>
        <p className="failure-message">
          No pudimos procesar tu pago. Esto puede deberse a varios motivos.
        </p>

        <div className="failure-reasons">
          <h3>Posibles causas:</h3>
          <ul>
            <li>🚫 Pago cancelado por el usuario</li>
            <li>💳 Problema con la tarjeta o método de pago</li>
            <li>🏦 Fondos insuficientes</li>
            <li>⚠️ Error de conexión</li>
          </ul>
        </div>

        <div className="recommendations">
          <h3>¿Qué puedes hacer?</h3>
          <ul>
            <li>✅ Verificar los datos de tu tarjeta</li>
            <li>💰 Comprobar que tengas fondos suficientes</li>
            <li>🔄 Intentar con otro método de pago</li>
            <li>📞 Contactar a tu banco si persiste el problema</li>
          </ul>
        </div>

        <div className="actions">
          <Link to="/checkout" className="btn btn-primary">
            Intentar Nuevamente
          </Link>
          <Link to="/carrito" className="btn btn-secondary">
            Volver al Carrito
          </Link>
          <Link to="/productos" className="btn btn-outline">
            Seguir Comprando
          </Link>
        </div>

        <div className="support">
          <p>
            Si sigues teniendo problemas, 
            <Link to="/contacto" className="support-link"> contáctanos </Link>
            y te ayudaremos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
