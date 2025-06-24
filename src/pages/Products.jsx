import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../context/CartContext.jsx";
import useProducts from '../hooks/useProducts';
import './Products.css';

const Products = () => {
  const { addToCart } = useCart();
  const { products, setProducts, loading, error, reloadProducts } = useProducts();
  const [cantidades, setCantidades] = useState({});

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
      
      // Actualización optimista del stock
      setProducts(prev =>
        prev.map(p =>
          p.id === producto.id ? { ...p, stock: p.stock - cantidad } : p
        )
      );
      
      // Sincronización con el backend
      await reloadProducts();
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

  console.log("Productos en Products.jsx:", products);

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
      <div className="products-header">
        <h1>Nuestros Productos</h1>
      </div>

      <div className="products-grid">
        {products.filter(p => p.activo).map(producto => {
          const cantidad = cantidades[producto.id] || 1;

          return (
            <div className='card' key={producto.id}>
              <Link to={`/productos/${producto.id}`} className="product-link">
                <div className="product-image-container">
                  <img 
                    src={producto.imagen || '/default-product.png'} 
                    alt={producto.nombre} 
                    onError={(e) => {
                      e.target.src = '/default-product.png';
                    }}
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
        })}
      </div>
    </div>
  );
};

export default Products;