import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./HistorialPedidos.css";

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const HistorialPedidos = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      fetch(`${API_URL}/pedidos/usuario/${encodeURIComponent(user.email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Error al cargar pedidos");
          return res.json();
        })
        .then(data => {
          // El endpoint /pedidos/usuario devuelve {success: true, pedidos: [...]}
          if (data.success && Array.isArray(data.pedidos)) {
            setPedidos(data.pedidos);
          } else if (Array.isArray(data)) {
            setPedidos(data);
          } else {
            setPedidos([]);
          }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, API_URL]);

  const formatFecha = (fechaString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-ES', options);
  };

  const getEstadoClass = (estado) => {
    switch((estado || "").toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'en proceso': return 'estado-proceso';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  };

  return (
    <div className="historial-pedidos-container">
      <h2 className="historial-titulo">Mis Pedidos</h2>
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : pedidos.length === 0 ? (
        <div className="no-pedidos">
          <p>No tienes pedidos realizados aún.</p>
          <button className="btn-explorar" onClick={() => window.location.href='/productos'}>
            Explorar Productos
          </button>
        </div>
      ) : (
        <>
          <div className="resumen-pedidos">
            <div className="resumen-item">
              <span>Total Pedidos:</span>
              <strong>{pedidos.length}</strong>
            </div>
            <div className="resumen-item">
              <span>Último pedido:</span>
              <strong>{formatFecha(pedidos[0].fecha)}</strong>
            </div>
          </div>

          <table className="historial-pedidos-table">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td className="pedido-id">#{pedido.id}</td>
                  <td>{formatFecha(pedido.fecha)}</td>
                  <td className="pedido-total">${pedido.total?.toLocaleString('es-AR')}</td>
                  <td>
                    <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-detalle"
                      onClick={() => window.location.href=`/pedidos/${pedido.id}`}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default HistorialPedidos;
