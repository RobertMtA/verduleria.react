import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './PaymentResult.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Obtener parámetros de la URL
        const urlParams = new URLSearchParams(location.search);
        const paymentId = urlParams.get('payment_id');
        const status = urlParams.get('status');
        const preferenceId = urlParams.get('preference_id');

        console.log('🎉 Pago exitoso - Parámetros:', {
          paymentId,
          status,
          preferenceId
        });

        // Recuperar datos del pedido pendiente
        const pendingOrder = localStorage.getItem('pendingOrder');
        
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          
          // Crear el pedido en la base de datos
          const pedidoData = {
            ...orderData,
            estado: 'pendiente',
            payment_id: paymentId,
            preference_id: preferenceId,
            mercadopago_status: status
          };

          const response = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pedidoData),
          });

          const responseData = await response.json();

          if (response.ok && responseData.success) {
            setPaymentData({
              pedidoId: responseData.pedido?._id || responseData.pedido?.id,
              total: orderData.total,
              productos: orderData.productos,
              cliente: orderData.usuario.nombre,
              paymentId: paymentId
            });

            // Limpiar datos temporales
            localStorage.removeItem('pendingOrder');
            clearCart();
          } else {
            throw new Error('Error al confirmar el pedido');
          }
        } else {
          setPaymentData({
            paymentId: paymentId,
            mensaje: 'Pago procesado exitosamente'
          });
        }

      } catch (err) {
        console.error('❌ Error procesando pago exitoso:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [location, clearCart]);

  if (loading) {
    return (
      <div className="payment-result-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Procesando tu pago...</h2>
          <p>Por favor espera mientras confirmamos tu pedido.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-result-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Error al procesar el pago</h2>
          <p>{error}</p>
          <div className="actions">
            <Link to="/carrito" className="btn btn-primary">
              Volver al Carrito
            </Link>
            <Link to="/productos" className="btn btn-secondary">
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      <div className="success-container">
        <div className="success-icon">🎉</div>
        <h1>¡Pago Exitoso!</h1>
        <p className="success-message">
          Tu pago ha sido procesado correctamente con Mercado Pago.
        </p>

        {paymentData && (
          <div className="payment-details">
            {paymentData.pedidoId && (
              <div className="detail-item">
                <strong>Número de Pedido:</strong>
                <span>#{paymentData.pedidoId.slice(-8)}</span>
              </div>
            )}
            
            {paymentData.paymentId && (
              <div className="detail-item">
                <strong>ID de Pago:</strong>
                <span>{paymentData.paymentId}</span>
              </div>
            )}
            
            {paymentData.total && (
              <div className="detail-item">
                <strong>Total Pagado:</strong>
                <span>${paymentData.total.toLocaleString('es-AR')}</span>
              </div>
            )}
            
            {paymentData.cliente && (
              <div className="detail-item">
                <strong>Cliente:</strong>
                <span>{paymentData.cliente}</span>
              </div>
            )}
          </div>
        )}

        <div className="next-steps">
          <h3>¿Qué sigue?</h3>
          <ul>
            <li>✅ Recibirás un email de confirmación</li>
            <li>📦 Prepararemos tu pedido</li>
            <li>🚚 Te contactaremos para coordinar la entrega</li>
            <li>📱 Puedes seguir tu pedido en "Mi Perfil"</li>
          </ul>
        </div>

        <div className="actions">
          <Link to="/perfil" className="btn btn-primary">
            Ver Mis Pedidos
          </Link>
          <Link to="/productos" className="btn btn-secondary">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
