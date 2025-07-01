import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./PedidosAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const PedidosAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");

  const ESTADOS = {
    PENDIENTE: 'pendiente',
    EN_PROCESO: 'en_proceso',
    ENTREGADO: 'entregado',
    CANCELADO: 'cancelado'
  };

  const navigate = useNavigate();

  // Obtener pedidos desde backend Node/MongoDB
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/pedidos`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudieron cargar los pedidos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [API_URL]);

  // Actualizar estado del pedido
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const result = await response.json();

      if (!response.ok || (!result.success && !result.ok)) {
        throw new Error(result.error || "Error al actualizar");
      }

      // Actualizar estado local
      setPedidos(pedidos.map(pedido =>
        pedido._id === id ? { ...pedido, estado: nuevoEstado } : pedido
      ));

      setSuccess(`Pedido #${id} actualizado`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error al actualizar:", err);
    }
  };

  // Filtrar pedidos
  const pedidosFiltrados = filter === "todos"
    ? pedidos
    : pedidos.filter(pedido => pedido.estado === filter);

  return (
    <div className="pedidos-container">
      <h1>Panel de Pedidos</h1>

      {error && (
        <div className="alert error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      <div className="filters">
        {["todos", ...Object.values(ESTADOS)].map(filtro => (
          <button
            key={filtro}
            className={filter === filtro ? "active" : ""}
            onClick={() => setFilter(filtro)}
          >
            {filtro === "todos" ? "Todos" : filtro.split("_").join(" ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Cargando pedidos...</div>
      ) : pedidosFiltrados.length === 0 ? (
        <div>
          <p>No hay pedidos {filter !== "todos" ? `con estado ${filter}` : ""}</p>
          <p>Total de pedidos en estado: {pedidos.length}</p>
        </div>
      ) : (
        <table className="pedidos-table" style={{width: '100%', borderCollapse: 'collapse', background: 'white'}}>
          <thead style={{backgroundColor: '#1976d2', color: 'white'}}>
            <tr>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>ID</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Cliente</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Fecha</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Total</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Estado</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? pedidosFiltrados.map(pedido => (
              <tr key={pedido._id}>
                <td>#{pedido._id}</td>
                <td>{pedido.usuario?.nombre || pedido.cliente || "-"}</td>
                <td>{pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleDateString() : "-"}</td>
                <td>${Number(pedido.total).toLocaleString()}</td>
                <td>
                  <select
                    value={pedido.estado}
                    onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
                    name={`estado-${pedido._id}`}
                    id={`estado-${pedido._id}`}
                  >
                    {Object.entries(ESTADOS).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => navigate(`/admin/editar-pedido/${pedido._id}`)}>
                    Editar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                  No hay pedidos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PedidosAdmin;