import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';
import ProductList from '../components/ProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from "../context/AuthContext";
import './Home.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const Home = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Filtrar productos destacados (reducir a 4 para balance)
  useEffect(() => {
    if (products.length) {
      setFeaturedProducts(products.slice(0, 4));
    }
  }, [products]);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(
    p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limitar productos para la página de inicio (2 filas = 8 productos máximo)
  // Solo cuando NO hay búsqueda activa para mantener la página concisa
  const homeProducts = searchTerm.trim() 
    ? filteredProducts // Mostrar todos los resultados de búsqueda
    : filteredProducts.slice(0, 8); // Limitar a 8 productos en vista normal

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
            <img
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

      {/* Productos Destacados */}
      {featuredProducts.length > 0 && (
        <section className="featured-section" aria-label="Productos destacados">
          <div className="container">
            <h2 className="section-title">
              <i className="fas fa-star" aria-hidden="true"></i> Nuestros Destacados
            </h2>
            <ProductList 
              products={featuredProducts.slice(0, 4)} 
              addToCart={addToCart}
            />
            <div className="text-center">
              <Link to="/productos/destacados" className="btn btn-outline">
                Ver más destacados
              </Link>
            </div>
          </div>
        </section>
      )}

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
              />
              {/* Mostrar botón "Ver más" solo si hay más productos disponibles */}
              {!searchTerm.trim() && filteredProducts.length > 8 && (
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