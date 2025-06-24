import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditarPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Traer datos del pedido
    fetch(`http://localhost/api/pedido_por_id.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setPedido(data);
        setEstado(data.estado);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el pedido");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost/api/actualizar_pedido.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado })
    });
    const result = await res.json();
    if (result.success) {
      navigate("/admin/pedidos");
    } else {
      setError(result.error || "Error al actualizar");
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