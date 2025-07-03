import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';
import ProductList from '../components/ProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from "../context/AuthContext";
import Reseñas from '../components/Reseñas';
import FormularioReseña from '../components/FormularioReseña';
import ImageWithFallback from '../components/common/ImageWithFallback';
import './Home.css';

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const Home = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [ofertasLoading, setOfertasLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Filtrar productos destacados y cargar ofertas
  useEffect(() => {
    if (products.length) {
      setFeaturedProducts(products.slice(0, 3));
    }
    // Cargar ofertas para mostrar en destacados
    cargarOfertas();
  }, [products]);

  const cargarOfertas = async () => {
    try {
      setOfertasLoading(true);
      
      // Importar dinámicamente el servicio proxy
      const corsProxyService = await import('../services/corsProxyService.js');
      const data = await corsProxyService.default.getOfertas(true); // activas_solo = true
      
      if (data && data.success && data.ofertas && Array.isArray(data.ofertas)) {
        const ofertasLimitadas = data.ofertas.slice(0, 3); // Solo las primeras 3 ofertas
        setOfertas(ofertasLimitadas);
      } else if (data && data.ofertas && Array.isArray(data.ofertas)) {
        // Formato sin success flag
        const ofertasLimitadas = data.ofertas.slice(0, 3);
        setOfertas(ofertasLimitadas);
      } else if (Array.isArray(data)) {
        // Array directo
        const ofertasLimitadas = data.slice(0, 3);
        setOfertas(ofertasLimitadas);
      } else {
        setOfertas([]); // Establecer array vacío en lugar de mantener undefined
      }
    } catch (error) {
      setOfertas([]); // Array vacío en caso de error
    } finally {
      setOfertasLoading(false);
    }
  };

  const handleAddOfertaToCart = (oferta) => {
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

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(
    p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limitar productos para la página de inicio (2 filas = 8 productos máximo)
  // Solo cuando NO hay búsqueda activa para mantener la página concisa
  const homeProducts = searchTerm.trim() 
    ? filteredProducts // Mostrar todos los resultados de búsqueda
    : filteredProducts.slice(0, 3); // Limitar a 3 productos en vista normal

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) {
      alert("Por favor ingresa un correo válido.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/suscriptores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setIsSubscribed(true);
        setNewsletterEmail("");
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        alert(data.error || "No se pudo suscribir.");
      }
    } catch (err) {
      alert("Error de red al suscribirse.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner" aria-label="Banner principal">
        <div className="container">
          <div className="hero-content">
            <h1>Frescura Natural en Cada Pedido</h1>
            {/* Imagen del banner */}
            <ImageWithFallback
              src="/img-banner.jpg"
              alt="Banner de Verdulería"
              className="banner-image"
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover", margin: "20px 0" }}
            />
            <p className="subtitle">
              Productos orgánicos seleccionados cuidadosamente y entregados en tu hogar
            </p>
            
            <div className="search-container">
              <form onSubmit={handleSearch}>
                <label htmlFor="busqueda" className="visually-hidden">Buscar productos</label>
                <input
                  type="text"
                  id="busqueda"
                  name="busqueda"
                  autoComplete="off"
                  placeholder="Buscar frutas, verduras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Buscar productos"
                />
                <button type="submit" className="search-button" aria-label="Buscar">
                  <i className="fas fa-search" aria-hidden="true"></i>
                </button>
              </form>
            </div>

            <div className="cta-buttons">
              <Link to="/productos" className="btn btn-primary">
                Ver Todos los Productos
              </Link>
              <Link to="/ofertas" className="btn btn-secondary">
                Ofertas Especiales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas Destacadas */}
      {ofertasLoading ? (
        <section className="featured-section" aria-label="Cargando ofertas">
          <div className="container">
            <h2 className="section-title">
              <i className="fas fa-star" aria-hidden="true"></i> Nuestros Destacados - ¡En Oferta!
            </h2>
            <div className="loading-ofertas">
              <p>Cargando ofertas especiales...</p>
            </div>
          </div>
        </section>
      ) : ofertas.length > 0 ? (
        <section className="featured-section" aria-label="Ofertas destacadas">
          <div className="container">
            <h2 className="section-title">
              <i className="fas fa-star" aria-hidden="true"></i> Nuestros Destacados - ¡En Oferta!
            </h2>
            <div className="ofertas-grid">
              {ofertas.map((oferta) => (
                <div className="oferta-card-home" key={oferta._id}>
                  <div className="oferta-badge">
                    {oferta.descuento_porcentaje}% OFF
                  </div>
                  
                  <div className="oferta-imagen-container">
                    {oferta.imagen ? (
                      <ImageWithFallback
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
                      <span className="precio-original">${oferta.precio_original?.toLocaleString()}</span>
                      <span className="precio-oferta">${oferta.precio_oferta?.toLocaleString()}</span>
                    </div>
                    
                    <button 
                      className="btn-agregar-oferta"
                      onClick={() => handleAddOfertaToCart(oferta)}
                    >
                      🛒 Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/ofertas" className="btn btn-outline">
                Ver todas las ofertas
              </Link>
            </div>
          </div>
        </section>
      ) : featuredProducts.length > 0 ? (
        <section className="featured-section" aria-label="Productos destacados">
          <div className="container">
            <h2 className="section-title">
              <i className="fas fa-star" aria-hidden="true"></i> Nuestros Destacados
            </h2>
            <ProductList 
              products={featuredProducts.slice(0, 3)} 
              addToCart={addToCart}
              className="grid-limitado"
            />
            <div className="text-center">
              <Link to="/productos/destacados" className="btn btn-outline">
                Ver más destacados
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Resultados de Búsqueda/Todos los Productos */}
      <section className="products-section" aria-label="Listado de productos">
        <div className="container">
          <h2 className="section-title">
            {searchTerm.trim()
              ? <>Resultados para "<span className="search-term">{searchTerm}</span>"</>
              : 'Nuestros Productos Frescos'}
          </h2>
          
          {loading ? (
            <LoadingSpinner message="Cargando productos frescos..." />
          ) : error ? (
            <EmptyState 
              icon="fas fa-exclamation-triangle"
              title="Error al cargar productos"
              message={error}
              actionText="Reintentar"
              onAction={() => window.location.reload()}
            />
          ) : homeProducts.length > 0 ? (
            <>
              <ProductList 
                products={homeProducts} 
                addToCart={addToCart}
                className="grid-limitado"
              />
              {/* Mostrar botón "Ver más" solo si hay más productos disponibles */}
              {!searchTerm.trim() && filteredProducts.length > 3 && (
                <div className="text-center" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                  <Link to="/productos" className="btn btn-view-more">
                    <i className="fas fa-chevron-right" style={{ marginRight: '8px' }}></i>
                    Ver Todos los Productos ({filteredProducts.length} disponibles)
                  </Link>
                </div>
              )}
              {/* Si hay búsqueda activa, mostrar enlace al catálogo completo */}
              {searchTerm.trim() && (
                <div className="text-center" style={{ marginTop: '2rem' }}>
                  <Link to="/productos" className="btn btn-primary">
                    Ver Todo el Catálogo
                  </Link>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              icon="fas fa-search"
              title="No encontramos productos"
              message={searchTerm.trim()
                ? "Intenta con otros términos de búsqueda" 
                : "Pronto tendremos más productos disponibles"
              }
              actionText={searchTerm.trim() ? "Ver todos los productos" : undefined}
              onAction={searchTerm.trim() ? () => window.location.href = '/productos' : undefined}
            />
          )}
        </div>
      </section>

      {/* Beneficios */}
      <section className="benefits-section" aria-label="Beneficios">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fas fa-leaf" aria-hidden="true"></i>
              <h3>100% Orgánico</h3>
              <p>Productos cultivados sin pesticidas ni químicos dañinos</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-truck" aria-hidden="true"></i>
              <h3>Envío Rápido</h3>
              <p>Recibe tus productos frescos en menos de 24 horas</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-hand-holding-usd" aria-hidden="true"></i>
              <h3>Precios Justos</h3>
              <p>Directo del productor a tu mesa sin intermediarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Reseñas */}
      <section className="reviews-section" aria-label="Reseñas de clientes">
        <div className="container">
          <h2 className="section-title">
            <i className="fas fa-star" aria-hidden="true"></i> Lo que dicen nuestros clientes
          </h2>
          
          {/* Mostrar reseñas existentes */}
          <Reseñas />
          
          {/* Formulario para nuevas reseñas */}
          <FormularioReseña className="compact" />
        </div>
      </section>

      {/* Newsletter - Solo se muestra cuando no hay búsqueda activa */}
      <section className="newsletter-section" aria-label="Suscripción al newsletter">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h2>Recibe nuestras ofertas</h2>
              <p>Suscríbete y obtén un 10% de descuento en tu primer pedido</p>
              
              {isSubscribed ? (
                <div className="alert alert-success" role="alert">
                  ¡Gracias por suscribirte! Pronto recibirás nuestras mejores ofertas.
                </div>
              ) : (
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    id="newsletter-email"
                    name="email"
                    placeholder="Tu correo electrónico" 
                    required
                    className="newsletter-input form-input"
                    aria-label="Correo electrónico para suscripción"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Suscribirse
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
