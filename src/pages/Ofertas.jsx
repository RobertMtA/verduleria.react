import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./OfertasNuevo.css";

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL || 'https://verduleria-backend-m19n.onrender.com/api';

  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ofertas?activas_solo=true`);
      const data = await response.json();

      if (data.success) {
        setOfertas(data.ofertas);
      } else {
        setError('Error cargando ofertas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = (oferta) => {
    const producto = {
      id: oferta._id,
      nombre: oferta.nombre,
      precio: oferta.precio_oferta,
      imagen: oferta.imagen,
      descripcion: oferta.descripcion,
      esOferta: true,
      descuento: oferta.descuento_porcentaje
    };
    
    addToCart(producto);
  };

  if (loading) {
    return (
      <div className="ofertas-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ofertas-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarOfertas}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ofertas-page">
      <div className="ofertas-header">
        <h1>🏷️ Ofertas Especiales</h1>
        <p>Aprovechá los mejores precios en productos frescos y orgánicos.</p>
      </div>
      
      {ofertas.length === 0 ? (
        <div className="sin-ofertas">
          <h3>No hay ofertas disponibles</h3>
          <p>Vuelve pronto para ver nuestras promociones especiales</p>
        </div>
      ) : (
        <div className="ofertas-lista">
          {ofertas.map((oferta) => (
            <div className="oferta-card" key={oferta._id}>
              <div className="oferta-badge">
                {oferta.descuento_porcentaje}% OFF
              </div>
              
              <div className="oferta-imagen-container">
                {oferta.imagen ? (
                  <img
                    src={oferta.imagen.startsWith('/') ? oferta.imagen : `/${oferta.imagen}`}
                    alt={oferta.nombre}
                    className="oferta-img"
                  />
                ) : (
                  <div className="sin-imagen-oferta">
                    <span>📦</span>
                  </div>
                )}
              </div>
              
              <div className="oferta-content">
                <h3>{oferta.nombre}</h3>
                <p className="oferta-descripcion">{oferta.descripcion}</p>
                
                <div className="precios-container">
                  <span className="precio-original">${oferta.precio_original.toLocaleString()}</span>
                  <span className="precio-oferta">${oferta.precio_oferta.toLocaleString()}</span>
                </div>
                
                <div className="oferta-vigencia">
                  <small>
                    Válida hasta: {new Date(oferta.fecha_fin).toLocaleDateString('es-AR')}
                  </small>
                </div>
                
                {oferta.stock_limitado && (
                  <div className="stock-limitado">
                    ⚡ Stock limitado: {oferta.stock_limitado} unidades
                  </div>
                )}
                
                <button 
                  className="btn-agregar-oferta"
                  onClick={() => handleAgregarAlCarrito(oferta)}
                >
                  🛒 Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ofertas;
