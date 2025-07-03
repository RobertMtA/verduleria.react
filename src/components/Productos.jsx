import React, { useState, useEffect, useContext } from 'react';
import './Productos.css';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import { CartContext } from '../context/CartContext';
import { getProductImageUrl, handleImageError } from '../utils/imageUtils';

const Productos = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = {};
      products.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: quantities[product.id] || 1,
      stock: product.stock || 0
    });
    
    // Resetear la cantidad a 1 después de agregar al carrito
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const adjustQuantity = (productId, amount) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const product = products.find(p => p.id === productId);
      const maxStock = product?.stock || 99;
      
      return {
        ...prev,
        [productId]: Math.max(1, Math.min(current + amount, maxStock))
      };
    });
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="image-container">
            <img
              src={getProductImageUrl(product)}
              alt={product.nombre}
              className="product-image"
              onError={handleImageError}
            />
          </div>
          <h3>{product.nombre}</h3>
          <p className="description">{product.descripcion}</p>
          <p className="price">${product.precio.toLocaleString('es-AR')}</p>
          <p className="stock">Stock: {product.stock || 'Disponible'}</p>
          
          <div className="quantity-controls">
            <button 
              onClick={() => adjustQuantity(product.id, -1)} 
              disabled={quantities[product.id] <= 1}
            >
              -
            </button>
            <span>{quantities[product.id] || 1}</span>
            <button 
              onClick={() => adjustQuantity(product.id, 1)} 
              disabled={quantities[product.id] >= (product.stock || 99)}
            >
              +
            </button>
          </div>

          <button
            className="add-to-cart"
            onClick={() => handleAddToCart(product)}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          <Link to={`/productos/${product.id}`} className="details-link">
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Productos;
