import React from "react";
import "./Ofertas.css";

const productosOferta = [
  {
    id: 1,
    nombre: "Tomate",
    precio: 3500,
    descuento: "20% OFF",
    descripcion: "Tomate fresco y jugoso, ideal para ensaladas.",
    imagen: "images/img-tomate1.jpg",
  },
  {
    id: 2,
    nombre: "Lechuga",
    precio: 3800,
    descuento: "15% OFF",
    descripcion: "Lechuga orgánica recién cosechada.",
    imagen: "images/img-lechuga1.jpg",
  },
  {
    id: 3,
    nombre: "Papa",
    precio: 3500,
    descuento: "10% OFF",
    descripcion: "Papa seleccionada, perfecta para guarniciones.",
    imagen: "images/img-papa1.jpg",
  },
];

const Ofertas = () => (
  <div className="ofertas-page">
    <h1>Ofertas Especiales</h1>
    <p>Aprovechá los mejores precios en productos frescos y orgánicos.</p>
    <div className="ofertas-lista">
      {productosOferta.map((prod) => (
        <div className="oferta-card" key={prod.id}>
          <img
            src={`/${prod.imagen}`}
            alt={prod.nombre}
            className="oferta-img"
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <h3>{prod.nombre}</h3>
          <div className="oferta-precio">${prod.precio}</div>
          <div className="oferta-descuento">{prod.descuento}</div>
          <p>{prod.descripcion}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Ofertas;