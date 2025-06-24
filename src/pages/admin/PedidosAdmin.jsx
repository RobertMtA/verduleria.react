import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PedidosAdmin.css";

const PedidosAdmin = () => {
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

  // Obtener pedidos
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost/api/pedidos_admin.php");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setPedidos(data);
      } catch (err) {
        setError("No se pudieron cargar los pedidos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Actualizar estado
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      setError("");
      setSuccess("");
      
      const response = await fetch("http://localhost/api/actualizar_pedido.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, estado: nuevoEstado })
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Respuesta no válida del servidor");
      }

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error al actualizar");
      }

      // Actualizar estado local
      setPedidos(pedidos.map(pedido => 
        pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
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
        <div>Cargando...</div>
      ) : pedidosFiltrados.length === 0 ? (
        <p>No hay pedidos {filter !== "todos" ? `con estado ${filter}` : ""}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td>${pedido.total.toLocaleString()}</td>
                <td>
                  <select
                    value={pedido.estado}
                    onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                    name={`estado-${pedido.id}`}
                    id={`estado-${pedido.id}`}
                  >
                    {Object.entries(ESTADOS).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => navigate(`/admin/editar-pedido/${pedido.id}`)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PedidosAdmin;