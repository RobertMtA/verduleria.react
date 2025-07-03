import React, { useEffect, useState } from 'react';
import './Orders.css';

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    fetch(`${API_URL}/pedidos`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [API_URL]);

  const handleUpdateStatus = (orderId, newStatus) => {
    // Actualiza en frontend
    setOrders(orders.map(order => 
      (order._id === orderId ? { ...order, estado: newStatus } : order)
    ));

    // Actualiza en backend
    fetch(`${API_URL}/pedidos/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success && !data.ok) {
          alert('No se pudo actualizar el estado en la base de datos');
        }
      })
      .catch(() => alert('Error de conexión con el servidor'));
  };

  const handleDeleteOrder = (orderId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;

    fetch(`${API_URL}/pedidos/${orderId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.ok) {
          setOrders(orders.filter(order => order._id !== orderId));
        } else {
          alert('No se pudo eliminar el pedido');
        }
      })
      .catch(() => alert('Error de conexión con el servidor'));
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'todos' || order.estado === filterStatus
  );

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div className="admin-orders">
      <h1>Gestión de Pedidos</h1>

      <div className="orders-controls">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="todos">Todos los pedidos</option>
          <option value="pendiente">Pendientes</option>
          <option value="preparacion">En preparación</option>
          <option value="enviado">Enviados</option>
          <option value="entregado">Entregados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>#{order._id}</td>
                <td>{order.cliente}</td>
                <td>{order.fecha ? new Date(order.fecha).toLocaleDateString() : "-"}</td>
                <td>${Number(order.total).toLocaleString('es-AR')}</td>
                <td>
                  <span className={`status-badge ${order.estado}`}>
                    {order.estado}
                  </span>
                </td>
                <td>
                  <select
                    value={order.estado}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="preparacion">En preparación</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button 
                    className="view-details-btn"
                    onClick={() => console.log('Ver detalles', order._id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="delete-order-btn"
                    onClick={() => handleDeleteOrder(order._id)}
                    style={{ marginLeft: "0.5rem", color: "red" }}
                    title="Eliminar pedido"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
