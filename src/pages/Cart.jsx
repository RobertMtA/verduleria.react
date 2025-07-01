import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductImageUrl, handleImageError } from '../utils/imageUtils';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    // Cerrar con la tecla ESC
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Deshabilitar scroll
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Restaurar scroll
    };
  }, [isOpen, onClose]);

  const subtotal = cartItems.reduce(
    (total, item) => total + ((item.precio ?? item.price ?? 0) * item.cantidad),
    0
  );

  return (
    <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
      <div className="cart-overlay" onClick={onClose}></div>
      
      <div className="cart-content">
        <div className="cart-header">
          <h2>
            <i className="fas fa-shopping-cart"></i> Tu Carrito
            <span className="items-count">({cartItems.reduce((total, item) => total + item.cantidad, 0)})</span>
          </h2>
          <button onClick={onClose} className="close-btn" aria-label="Cerrar carrito">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-cart-arrow-down"></i>
            <p>Tu carrito está vacío</p>
            <Link to="/productos" className="btn primary-btn">
              <i className="fas fa-store"></i> Ver Productos
            </Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map(item => {
                const precio = item.precio ?? item.price ?? 0;

                return (
                  <div key={`${item.id ?? item._id}-${item.talla || ''}-${item.color || ''}`} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={getProductImageUrl(item)} 
                        alt={item.nombre ?? item.name} 
                        onError={handleImageError}
                      />
                    </div>
                    <div className="item-details">
                      <div className="item-info">
                        <h3>{item.nombre ?? item.name}</h3>
                        <p className="price">
                          ${typeof precio === "number" && !isNaN(precio)
                            ? precio.toLocaleString('es-AR')
                            : "0"}/kg
                        </p>
                        {item.talla && <p className="attribute"><span>Talla:</span> {item.talla}</p>}
                        {item.color && <p className="attribute"><span>Color:</span> {item.color}</p>}
                      </div>
                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.id ?? item._id, item.cantidad - 1)}
                            className="quantity-btn"
                            aria-label="Reducir cantidad"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="quantity">{item.cantidad}</span>
                          <button 
                            onClick={() => updateQuantity(item.id ?? item._id, item.cantidad + 1)}
                            className="quantity-btn"
                            aria-label="Aumentar cantidad"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id ?? item._id)}
                          className="remove-btn"
                          aria-label="Eliminar producto"
                        >
                          <i className="fas fa-trash"></i> Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="item-total">
                      {typeof precio === "number" && !isNaN(precio) && typeof item.cantidad === "number" && !isNaN(item.cantidad)
                        ? `$${(precio * item.cantidad).toLocaleString('es-AR')}`
                        : "$0"}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-summary">
              <h3>Resumen del Pedido</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  {typeof subtotal === "number" && !isNaN(subtotal)
                    ? subtotal.toLocaleString("es-AR")
                    : "0"}
                </span>
              </div>
              
              <Link to="/checkout" className="checkout-btn">
                <i className="fas fa-credit-card"></i> Finalizar Compra
              </Link>
              
              <button 
                onClick={clearCart}
                className="btn clear-cart-btn"
              >
                <i className="fas fa-broom"></i> Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
