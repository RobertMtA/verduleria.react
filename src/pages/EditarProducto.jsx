import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarProducto.css";

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener datos del producto por ID
    fetch(`${API_URL}/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && (data.data || data.producto)) {
          setProducto(data.data || data.producto);
        } else if (data && data.nombre) {
          setProducto(data);
        } else {
          setError("No se pudo cargar el producto");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el producto");
        setLoading(false);
      });
  }, [id, API_URL]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    fetch(`${API_URL}/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.ok) {
          alert("Producto actualizado");
          navigate("/admin/productos");
        } else {
          setError(data.error || "Error al actualizar producto");
        }
      })
      .catch(() => setError("Error al actualizar producto"));
  };

  if (loading) return <p className="loading-message">Cargando producto...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <form className="editar-producto-form" onSubmit={handleSubmit}>
      <label htmlFor="edit-nombre">
        Nombre:
        <input 
          id="edit-nombre"
          name="nombre" 
          value={producto.nombre} 
          onChange={handleChange} 
          required 
        />
      </label>
      <label htmlFor="edit-precio">
        Precio:
        <input 
          id="edit-precio"
          name="precio" 
          type="number" 
          step="0.01" 
          value={producto.precio} 
          onChange={handleChange} 
          required 
        />
      </label>
      <label htmlFor="edit-stock">
        Stock:
        <input 
          id="edit-stock"
          name="stock" 
          type="number" 
          value={producto.stock} 
          onChange={handleChange} 
          required 
        />
      </label>
      <label htmlFor="edit-categoria">
        Categoría:
        <input 
          id="edit-categoria"
          name="categoria" 
          value={producto.categoria} 
          onChange={handleChange} 
        />
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default EditarProducto;
