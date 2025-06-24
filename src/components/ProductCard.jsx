import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, 1);
    // Si quieres redirigir al carrito:
    // navigate('/carrito');
  };

  return (
    <div>
      <h3>{product.nombre}</h3>
      <p>${product.precio}</p>
      {/* ...otros datos... */}
      <button type="button" onClick={handleAddToCart}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;