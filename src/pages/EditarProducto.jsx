import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarProducto.css";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: ""
  });

  useEffect(() => {
    // Obtener datos del producto por ID
    fetch(`http://localhost:4000/api/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(() => alert("No se pudo cargar el producto"));
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    })
      .then(res => res.json())
      .then(() => {
        alert("Producto actualizado");
        navigate("/admin/productos");
      })
      .catch(() => alert("Error al actualizar producto"));
  };

  return (
    <form className="editar-producto-form" onSubmit={handleSubmit}>
      <label>Nombre: <input name="nombre" value={producto.nombre} onChange={handleChange} /></label>
      <label>Precio: <input name="precio" value={producto.precio} onChange={handleChange} /></label>
      <label>Stock: <input name="stock" value={producto.stock} onChange={handleChange} /></label>
      <label>Categoría: <input name="categoria" value={producto.categoria} onChange={handleChange} /></label>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default EditarProducto;