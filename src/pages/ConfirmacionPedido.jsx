import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./ConfirmacionPedido.css";

const ConfirmacionPedido = () => {
  const location = useLocation();
  const { pedidoId, cliente, total } = location.state || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="confirmacion-pedido-container">
      <div className="confirmacion-pedido-card">
        <h1>¡Gracias por tu compra, {cliente}!</h1>
        <p>Tu pedido #{pedidoId} fue recibido correctamente.</p>
        <p>Total pagado: {formatPrice(total)}</p>
        <p>
          Te enviamos un email con los detalles. Pronto recibirás tu pedido en la
          dirección indicada.
        </p>
        <Link to="/productos" className="btn-volver-productos">
          Volver a productos
        </Link>
      </div>
    </div>
  );
};

export default ConfirmacionPedido;