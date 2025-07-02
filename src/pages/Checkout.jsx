import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductImageUrl, handleImageError } from "../utils/imageUtils";
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
    metodoPago: "mercadopago", // MercadoPago por defecto
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
        setError("🔄 Redirigiendo a Mercado Pago...");
        
        const itemsMP = cartItems.map(item => ({
          title: item.nombre || item.name,
          quantity: Number(item.cantidad),
          unit_price: Number(item.precio || item.price)
        }));

        console.log('📦 Enviando datos a MercadoPago:', {
          items: itemsMP,
          email: formData.email,
          usuario: formData.nombre,
          direccion: `${formData.direccion}, ${formData.ciudad}`
        });

        const response = await fetch(`${API_URL}/crear-preferencia`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsMP,
            email: formData.email,
            usuario: formData.nombre,
            direccion: `${formData.direccion}, ${formData.ciudad}`
          })
        });
        
        const data = await response.json();
        console.log('📄 Respuesta de MercadoPago:', data);
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Error al crear preferencia de pago');
        }
        
        if (data.init_point || data.sandbox_init_point) {
          // Guardar datos del pedido en localStorage antes de redirigir
          localStorage.setItem('pendingOrder', JSON.stringify({
            usuario: {
              nombre: formData.nombre,
              email: formData.email,
              telefono: formData.telefono,
              direccion: `${formData.direccion}, ${formData.ciudad}`
            },
            productos: cartItems,
            total: total,
            metodo_pago: 'mercadopago',
            preference_id: data.preference_id,
            timestamp: Date.now()
          }));
          
          setError("✅ Redirigiendo a Mercado Pago...");
          
          // Redirigir a MercadoPago
          setTimeout(() => {
            window.location.href = data.sandbox_init_point || data.init_point;
          }, 1500);
          
          return;
        } else {
          throw new Error('No se recibió URL de pago válida');
        }
      } catch (err) {
        console.error('❌ Error con MercadoPago:', err);
        setError(`❌ Error al procesar el pago: ${err.message}`);
        setLoading(false);
        return;
      }
    }

    if (formData.metodoPago === "transferencia") {
      try {
        setError("🔄 Procesando transferencia bancaria...");
        
        // Crear el pedido pero con estado pendiente
        const pedidoData = {
          usuario: {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            direccion: `${formData.direccion}, ${formData.ciudad}`
          },
          productos: cartItems.map(item => ({
            nombre: item.nombre || item.name,
            precio: Number(item.precio || item.price),
            cantidad: Number(item.cantidad),
            subtotal: Number(item.precio || item.price) * Number(item.cantidad),
            // Incluir información de imagen
            image: item.image || item.imagen || item.foto || item.imagePath || item.img || item.src,
            imagen: item.imagen || item.image,
            foto: item.foto,
            imagePath: item.imagePath,
            img: item.img
          })),
          total: total,
          metodo_pago: 'transferencia',
          estado: 'pendiente_pago'
        };

        const response = await fetch(`${API_URL}/pedidos`, {
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
        navigate("/instrucciones-transferencia", { 
          state: { 
            pedidoId: responseData.pedido?._id || responseData.pedido?.id,
            cliente: formData.nombre,
            total: total,
            productos: cartItems,
            email: formData.email
          } 
        });
        
        return;
      } catch (err) {
        console.error('❌ Error con transferencia:', err);
        setError(`❌ Error al procesar transferencia: ${err.message}`);
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
        usuario: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          direccion: `${formData.direccion}, ${formData.ciudad}`
        },
        productos: cartItems.map(item => ({
          nombre: item.nombre || item.name,
          precio: Number(item.precio || item.price),
          cantidad: Number(item.cantidad),
          subtotal: Number(item.precio || item.price) * Number(item.cantidad),
          // Incluir información de imagen
          image: item.image || item.imagen || item.foto || item.imagePath || item.img || item.src,
          imagen: item.imagen || item.image,
          foto: item.foto,
          imagePath: item.imagePath,
          img: item.img
        })),
        total: total,
        metodo_pago: formData.metodoPago
      };

      const response = await fetch(`${API_URL}/pedidos`, {
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
      navigate("/confirmacion-pedido", { 
        state: { 
          pedidoId: responseData.pedido?._id || responseData.pedido?.id,
          cliente: formData.nombre,
          total: total,
          productos: cartItems
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
              <div 
                className={`payment-method ${formData.metodoPago === 'mercadopago' ? 'selected' : ''}`}
                data-method="mercadopago"
              >
                <input
                  type="radio"
                  id="payment-mercadopago"
                  name="metodoPago"
                  value="mercadopago"
                  checked={formData.metodoPago === 'mercadopago'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="payment-mercadopago">
                  <div className="payment-option">
                    <div className="payment-icon">💳</div>
                    <div className="payment-details">
                      <strong>Mercado Pago</strong>
                      <span>Tarjetas de crédito, débito y otros medios</span>
                    </div>
                  </div>
                </label>
              </div>

              <div 
                className={`payment-method ${formData.metodoPago === 'transferencia' ? 'selected' : ''}`}
                data-method="transferencia"
              >
                <input
                  type="radio"
                  id="payment-transferencia"
                  name="metodoPago"
                  value="transferencia"
                  checked={formData.metodoPago === 'transferencia'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="payment-transferencia">
                  <div className="payment-option">
                    <div className="payment-icon">🏦</div>
                    <div className="payment-details">
                      <strong>Transferencia Bancaria</strong>
                      <span>Transferencia directa a cuenta bancaria</span>
                    </div>
                  </div>
                </label>
              </div>

              <div 
                className={`payment-method ${formData.metodoPago === 'efectivo' ? 'selected' : ''}`}
                data-method="efectivo"
              >
                <input
                  type="radio"
                  id="payment-efectivo"
                  name="metodoPago"
                  value="efectivo"
                  checked={formData.metodoPago === 'efectivo'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="payment-efectivo">
                  <div className="payment-option">
                    <div className="payment-icon">💵</div>
                    <div className="payment-details">
                      <strong>Efectivo</strong>
                      <span>Pago contra entrega</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Información adicional sobre el método seleccionado */}
            {formData.metodoPago === 'mercadopago' && (
              <div className="payment-info">
                <p>✅ Pago seguro con Mercado Pago</p>
                <p>💳 Acepta todas las tarjetas de crédito y débito</p>
                <p>🔒 Protección al comprador</p>
              </div>
            )}

            {formData.metodoPago === 'transferencia' && (
              <div className="payment-info">
                <p>🏦 Recibirás las instrucciones de transferencia</p>
                <p>⏱️ El pedido se confirmará al recibir el pago</p>
                <p>📧 Envía el comprobante por email</p>
              </div>
            )}

            {formData.metodoPago === 'efectivo' && (
              <div className="payment-info">
                <p>💵 Pago contra entrega</p>
                <p>🚚 Ten el dinero exacto listo</p>
                <p>📦 Se confirma al momento de la entrega</p>
              </div>
            )}
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
                      src={getProductImageUrl(item)} 
                      alt={item.nombre || item.name} 
                      onError={handleImageError}
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