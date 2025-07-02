import React, { useState, useEffect } from "react";
import { getProductImageUrl, handleImageError } from '../utils/imageUtils';
import './ProductList.css';

const ProductList = ({ products, addToCart, className = "" }) => {
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
    const cantidad = quantities[product.id] || 1;
    if (product.stock < cantidad) {
      alert('No hay suficiente stock');
      return;
    }
    addToCart(product, cantidad);
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

  return (
    <div className={`product-list ${className}`.trim()}>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.nombre}</h3>
          <p>{product.descripcion}</p>
          <p>
            $
            {typeof product.precio === "number" && !isNaN(product.precio)
              ? product.precio.toLocaleString("es-AR")
              : "0"}
          </p>
          <p>
            Stock: {typeof product.stock === "number" && !isNaN(product.stock)
              ? product.stock
              : "0"}
          </p>
          <img
            src={getProductImageUrl(product)}
            alt={product.nombre}
            className="product-image"
            onError={handleImageError}
          />
          
          {addToCart && (
            <div className="product-actions">
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
                onClick={() => handleAddToCart(product)}
                className="add-to-cart"
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
