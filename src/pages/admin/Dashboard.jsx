import React from 'react';
import { Link } from 'react-router-dom';
import MapaWidget from '../../components/MapaWidget';
import './Dashboard.css';

const AdminDashboard = () => {
  const stats = {
    totalVentas: 1500,
    pedidosPendientes: 5,
    productosActivos: 25,
    clientesRegistrados: 100
  };

  return (
    <div className="dashboard">
      <h1>Panel de Administración</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Ventas Totales</h3>
          <p className="stat-value">${stats.totalVentas}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pedidos Pendientes</h3>
          <p className="stat-value">{stats.pedidosPendientes}</p>
          <Link to="/admin/pedidos" className="view-more">Ver pedidos</Link>
        </div>
        
        <div className="stat-card">
          <h3>Productos Activos</h3>
          <p className="stat-value">{stats.productosActivos}</p>
          <Link to="/admin/productos" className="view-more">Gestionar productos</Link>
        </div>
        
        <div className="stat-card">
          <h3>Clientes Registrados</h3>
          <p className="stat-value">{stats.clientesRegistrados}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <Link to="/admin/productos/nuevo" className="action-card">
              <i className="fas fa-plus"></i>
              <span>Agregar Producto</span>
            </Link>
            
            <Link to="/admin/pedidos" className="action-card">
              <i className="fas fa-clipboard-list"></i>
              <span>Ver Pedidos</span>
            </Link>
            
            <Link to="/admin/mapa" className="action-card">
              <i className="fas fa-map-marker-alt"></i>
              <span>Mapa Entregas</span>
            </Link>
            
            <Link to="/admin/productos" className="action-card">
              <i className="fas fa-box"></i>
              <span>Inventario</span>
            </Link>
            
            <Link to="/admin/reportes" className="action-card">
              <i className="fas fa-chart-bar"></i>
              <span>Reportes</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-mapa-widget">
          <MapaWidget />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
