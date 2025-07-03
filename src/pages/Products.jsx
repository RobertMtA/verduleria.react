import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../context/CartContext.jsx";
import useProducts from '../hooks/useProducts';
import { getProductImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/common/ImageWithFallback';
import ImageDiagnostic from '../components/common/ImageDiagnostic';
import SEOComponent from '../components/common/SEOComponent';
import './Products.css';

const Products = () => {
  const { addToCart } = useCart();
  const { products, setProducts, loading, error, reloadProducts } = useProducts();
  const [cantidades, setCantidades] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      const inicial = {};
      products.forEach(p => {
        inicial[p.id] = 1;
      });
      setCantidades(inicial);
    }
  }, [products]);

  const handleIncrease = (id, stock) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 1) + 1, stock)
    }));
  };

  const handleDecrease = (id) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1)
    }));
  };

  const handleAddToCart = async (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    
    if (producto.stock < cantidad) {
      alert('No hay suficiente stock');
      return;
    }

    try {
      addToCart({ ...producto, cantidad });
      
      // Resetear la cantidad a 1 después de agregar al carrito
      setCantidades(prev => ({
        ...prev,
        [producto.id]: 1
      }));
      
      // Actualización optimista del stock
      setProducts(prev =>
        prev.map(p =>
          p.id === producto.id ? { ...p, stock: p.stock - cantidad } : p
        )
      );
      
      // No recargar todos los productos, solo mostrar mensaje de éxito
      console.log('Producto agregado al carrito:', producto.nombre);
      
    } catch (err) {
      console.error("Error al actualizar el carrito:", err);
      // Revertir cambios si falla
      setProducts(prev =>
        prev.map(p =>
          p.id === producto.id ? { ...p, stock: p.stock + cantidad } : p
        )
      );
    }
  };

  // Filtrar productos por búsqueda y activos
  const filteredProducts = products
    .filter(p => p.activo)
    .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  // Debug: verificar si hay IDs duplicados
  const productIds = filteredProducts.map(p => p.id);
  const uniqueIds = [...new Set(productIds)];
  if (productIds.length !== uniqueIds.length) {
    console.warn('⚠️ Productos con IDs duplicados detectados');
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={reloadProducts} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* SEO Component */}
      <SEOComponent 
        title="Productos | Frutas y Verduras Frescas Online - Verdulería Buenos Aires"
        description="🍎 Catálogo completo de frutas y verduras frescas online. Tomates, lechugas, bananas, manzanas y más. Entrega a domicilio en Buenos Aires. ¡Comprá ahora!"
        keywords="productos frescos, frutas online, verduras online, tomates frescos, lechugas, bananas, manzanas, catálogo verdulería"
        image="/images/img-tomate1.jpg"
        url="https://tudominio.com/productos"
      />
      
      <div className="products-header">
        <h1>Nuestros Productos</h1>
        
        <form
          className="products-search-form"
          onSubmit={e => e.preventDefault()}
          autoComplete="off"
        >
          <input
            id="search-products"
            name="search"
            type="text"
            className="products-search-input"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Buscar productos"
          />
          <button type="submit" className="products-search-btn" aria-label="Buscar">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products-message">
            No se encontraron productos.
          </div>
        ) : (
          filteredProducts.map(producto => {
            const cantidad = cantidades[producto.id] || 1;

            return (
              <div className='card' key={producto.id}>
                <Link to={`/productos/${producto.id}`} className="product-link">
                  <div className="product-image-container">
                    <ImageWithFallback 
                      src={getProductImageUrl(producto)} 
                      alt={producto.nombre}
                    />
                    {producto.stock === 0 && (
                      <div className="out-of-stock-badge">Agotado</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{producto.nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                  </div>
                </Link>

                <div className="product-footer">
                  <p className="price">${producto.precio.toLocaleString('es-AR')}</p>
                  <p className={`stock ${producto.stock === 0 ? 'out-of-stock' : ''}`}>
                    {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                  </p>
                </div>

                <div className="cantidadContainer">
                  <button 
                    onClick={() => handleDecrease(producto.id)} 
                    className="quantity-btn"
                    disabled={cantidad <= 1}
                    aria-label={`Disminuir cantidad de ${producto.nombre}`}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="quantity">{cantidad}</span>
                  <button 
                    onClick={() => handleIncrease(producto.id, producto.stock)} 
                    className="quantity-btn"
                    disabled={cantidad >= producto.stock || producto.stock === 0}
                    aria-label={`Aumentar cantidad de ${producto.nombre}`}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>

                <button
                  className="add-to-cart-btn"
                  disabled={producto.stock === 0}
                  onClick={() => handleAddToCart(producto)}
                  aria-label={`Agregar ${producto.nombre} al carrito`}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {producto.stock > 0 ? ' Agregar al carrito' : ' Agotado'}
                </button>

                <Link to={`/productos/${producto.id}`} className="view-details-link">
                  Ver detalles <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Products;
