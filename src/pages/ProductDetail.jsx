import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { getProductImageUrl, handleImageError } from "../utils/imageUtils";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = React.useState(1);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const producto = products.find((p) => String(p.id) === String(id));

  if (!producto) {
    return (
      <div className="error-container">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate("/productos")}>
          Volver a productos
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...producto, cantidad });
    // Resetear la cantidad a 1 después de agregar al carrito
    setCantidad(1);
    navigate("/carrito");
  };

  return (
    <div className="product-detail">
      <div className="product-image">
        <img
          src={getProductImageUrl(producto)}
          alt={producto.nombre ?? producto.name}
          className="product-detail-image"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
          onError={handleImageError}
        />
      </div>

      <div className="product-info">
        <h1>{producto.nombre}</h1>
        <span className="categoria">{producto.categoria}</span>
        <p className="descripcion">{producto.descripcion}</p>
        <p className="precio">
          ${producto.precio}/{producto.unidad}
        </p>

        <div className="cantidad-selector">
          <label>Cantidad:</label>
          <div className="cantidad-controls">
            <button
              onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
              disabled={cantidad <= 1}
            >
              -
            </button>
            <input
              id="product-quantity"
              name="quantity"
              type="number"
              value={cantidad}
              onChange={(e) =>
                setCantidad(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max={producto.stock}
              aria-label="Cantidad del producto"
            />
            <button
              onClick={() => setCantidad((prev) => Math.min(producto.stock, prev + 1))}
              disabled={cantidad >= producto.stock}
            >
              +
            </button>
          </div>
        </div>

        <div className="stock-info">
          Stock disponible: {producto.stock} {producto.unidad}
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          Agregar al carrito
        </button>

        <button
          className="back-button"
          onClick={() => navigate("/productos")}
        >
          Volver a productos
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
