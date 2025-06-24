import React from "react";
import './ProductList.css';

const ProductList = ({ products, addToCart }) => {
  console.log("Productos recibidos:", products);

  return (
    <div className="product-list">
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
            src={product.imagen}
            alt={product.nombre}
            className="product-image"
            onError={e => {
              e.target.src = "/images/placeholder.jpg";
            }}
          />
          {addToCart && (
            <button onClick={() => addToCart(product)}>Agregar al Carrito</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
