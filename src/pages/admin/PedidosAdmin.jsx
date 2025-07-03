import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./PedidosAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const PedidosAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");

  const ESTADOS = {
    PENDIENTE: 'pendiente',
    CONFIRMADO: 'confirmado',
    EN_PROCESO: 'en_proceso',
    EN_CAMINO: 'en_camino',
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

  // Eliminar pedido
  const eliminarPedido = async (id, nombreCliente) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el pedido #${id.slice(-8)} de ${nombreCliente}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error al eliminar pedido");
      }

      // Actualizar estado local - remover el pedido eliminado
      setPedidos(pedidos.filter(pedido => pedido._id !== id));

      setSuccess(`Pedido #${id.slice(-8)} eliminado exitosamente`);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(`Error al eliminar pedido: ${err.message}`);
      console.error("Error al eliminar:", err);
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

      <div style={{
        background: '#f0f8ff', 
        border: '1px solid #1976d2', 
        borderRadius: '8px', 
        padding: '12px', 
        margin: '15px 0',
        fontSize: '13px',
        color: '#1976d2'
      }}>
        <strong>📍 Leyenda de Direcciones:</strong> Las direcciones en <strong style={{color: '#1976d2'}}>azul con ícono 📍</strong> indican que el usuario actualizó su dirección después de hacer el pedido. 
        Hover para ver tanto la dirección actual como la original del pedido.
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
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Dirección</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Fecha</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Total</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Estado</th>
              <th style={{padding: '15px', backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? pedidosFiltrados.map(pedido => (
              <tr key={pedido._id}>
                <td data-label="ID">#{pedido._id}</td>
                <td data-label="Cliente">{pedido.usuario?.nombre || pedido.cliente || "-"}</td>
                <td data-label="Dirección" style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px'}}>
                  {(() => {
                    const direccionActual = pedido.usuario?.direccion_actual;
                    const direccionPedido = pedido.usuario?.direccion_pedido || pedido.usuario?.direccion;
                    const direccionMostrar = direccionActual || direccionPedido || pedido.direccion_entrega || pedido.direccion || "-";
                    
                    const esDiferente = direccionActual && direccionPedido && direccionActual !== direccionPedido;
                    
                    return (
                      <span 
                        title={esDiferente ? 
                          `Dirección actual: ${direccionActual}\nDirección del pedido: ${direccionPedido}` : 
                          direccionMostrar
                        }
                        style={{
                          color: esDiferente ? '#1976d2' : 'inherit',
                          fontWeight: esDiferente ? 'bold' : 'normal'
                        }}
                      >
                        {direccionMostrar}
                        {esDiferente && <span style={{marginLeft: '4px', color: '#ff9800'}}>📍</span>}
                      </span>
                    );
                  })()}
                </td>
                <td data-label="Fecha">{pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleDateString() : "-"}</td>
                <td data-label="Total">${Number(pedido.total).toLocaleString()}</td>
                <td data-label="Estado">
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
                <td data-label="Acciones">
                  <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                    <button 
                      onClick={() => navigate(`/admin/editar-pedido/${pedido._id}`)}
                      style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        minWidth: '60px'
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarPedido(pedido._id, pedido.usuario?.nombre || pedido.cliente || 'Cliente')}
                      style={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        minWidth: '60px'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
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
