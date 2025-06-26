import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  const handleAddToCart = () => {
    if (product.stock < cantidad) {
      alert('No hay suficiente stock');
      return;
    }
    addToCart(product, cantidad);
    // Resetear la cantidad a 1 después de agregar al carrito
    setCantidad(1);
    // Si quieres redirigir al carrito:
    // navigate('/carrito');
  };

  const handleIncrease = () => {
    setCantidad(prev => Math.min(prev + 1, product.stock || 99));
  };

  const handleDecrease = () => {
    setCantidad(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="product-card">
      <h3>{product.nombre}</h3>
      <p className="description">{product.descripcion}</p>
      <p className="price">${product.precio?.toLocaleString('es-AR')}</p>
      <p className="stock">Stock: {product.stock || 'Disponible'}</p>
      
      {product.imagen && (
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-image"
          onError={e => { e.target.src = '/images/placeholder.jpg'; }}
        />
      )}

      <div className="quantity-controls">
        <button 
          onClick={handleDecrease} 
          disabled={cantidad <= 1}
        >
          -
        </button>
        <span>{cantidad}</span>
        <button 
          onClick={handleIncrease} 
          disabled={cantidad >= (product.stock || 99)}
        >
          +
        </button>
      </div>

      <button 
        type="button" 
        onClick={handleAddToCart}
        className="add-to-cart"
        disabled={product.stock <= 0}
      >
        {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  );
};

export default ProductCard;