import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const EditarPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Traer datos del pedido desde el backend Node/MongoDB
    fetch(`${API_URL}/pedidos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el pedido");
        return res.json();
      })
      .then(data => {
        setPedido(data);
        setEstado(data.estado);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el pedido");
        setLoading(false);
      });
  }, [id, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
      });
      const result = await res.json();
      if (res.ok) {
        navigate("/admin/pedidos");
      } else {
        setError(result.error || "Error al actualizar");
      }
    } catch (err) {
      setError("Error al actualizar");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div className="editar-pedido-container">
      <h2>Editar Pedido #{id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Estado:</label>
          <select value={estado} onChange={e => setEstado(e.target.value)}>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarPedido;