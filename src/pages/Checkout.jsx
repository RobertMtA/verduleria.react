import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    metodoPago: "efectivo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcular total
  const total = cartItems.reduce(
    (sum, item) => sum + (Number(item.precio ?? item.price ?? 0) * Number(item.cantidad ?? 1)),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.metodoPago === "mercadopago") {
      try {
        const itemsMP = cartItems.map(item => ({
          title: item.nombre,
          quantity: Number(item.cantidad),
          unit_price: Number(item.precio)
        }));

        const res = await fetch("http://localhost:4001/api/crear-preferencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsMP,
            email: formData.email
          })
        });
        const data = await res.json();
        if (data.init_point) {
          setError("Redirigiendo a Mercado Pago...");
          setTimeout(() => {
            window.location.href = data.init_point;
          }, 1200);
          return;
        } else {
          setError("No se pudo iniciar el pago con Mercado Pago");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Error al conectar con Mercado Pago");
        setLoading(false);
        return;
      }
    }

    // Validación de campos
    if (!formData.nombre || !formData.email || !formData.telefono || 
        !formData.direccion || !formData.ciudad) {
      setError("Por favor completa todos los campos requeridos");
      setLoading(false);
      return;
    }

    // Validación de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Por favor ingresa un email válido");
      setLoading(false);
      return;
    }

    try {
      const pedidoData = {
        usuario_id: user?.id || null,
        cliente: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        total: total,
        metodo_pago: formData.metodoPago,
        items: cartItems.map(item => ({
          producto_id: item.id,
          nombre: item.nombre || item.name,
          cantidad: item.cantidad,
          precio: item.precio || item.price
        }))
      };

      const response = await fetch(`${API_URL}/crear_pedido.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedidoData),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || "Error al procesar el pedido");
      }

      clearCart();
      navigate("/confirmacion", { 
        state: { 
          pedidoId: responseData.id,
          cliente: formData.nombre,
          total: total
        } 
      });

    } catch (err) {
      setError(err.message || "Ocurrió un error al procesar tu pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
          {/* Información de contacto */}
          <section className="checkout-section">
            <h2>Información de contacto</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo*</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Nombre completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono*</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección*</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                autoComplete="street-address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ciudad">Ciudad*</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                autoComplete="address-level2"
              />
            </div>
          </section>

          {/* Método de pago */}
          <section className="checkout-section">
            <h2>Método de pago</h2>
            <div className="payment-methods">
              {['efectivo', 'tarjeta', 'mercadopago', 'transferencia'].map((method) => (
                <div key={method} className="payment-method">
                  <input
                    type="radio"
                    id={`payment-${method}`}
                    name="metodoPago"
                    value={method}
                    checked={formData.metodoPago === method}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor={`payment-${method}`}>
                    {method === 'efectivo' && 'Efectivo'}
                    {method === 'tarjeta' && 'Tarjeta'}
                    {method === 'mercadopago' && 'Mercado Pago'}
                    {method === 'transferencia' && 'Transferencia'}
                  </label>
                </div>
              ))}
            </div>
          </section>
        </form>

        {/* Resumen del pedido */}
        <aside className="order-summary">
          <h2>Resumen del pedido</h2>
          
          <div className="order-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart-message">Tu carrito está vacío</p>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id ?? item._id}-${item.nombre ?? item.name}`} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.imagen || item.image || '/images/default-product.jpg'} 
                      alt={item.nombre || item.name} 
                    />
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.nombre || item.name}</span>
                    <span className="item-quantity">x{item.cantidad}</span>
                  </div>
                  <span className="item-price">
                    {formatPrice((item.precio ?? item.price ?? 0) * item.cantidad)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="order-total">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button 
            type="submit" 
            form="checkout-form" 
            className="checkout-button"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              'Finalizar compra'
            )}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;