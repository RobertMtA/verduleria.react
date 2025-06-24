import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth();

  // Verificar autenticación y rol de administrador
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <h2>Panel Admin</h2>
        <ul>
          <li><Link to="/admin/productos">Productos</Link></li>
          <li><Link to="/admin/pedidos">Pedidos</Link></li>
          <li><Link to="/admin/usuarios">Usuarios</Link></li>
          <li><Link to="/admin/reportes">Reportes</Link></li>
          <li><Link to="/admin/suscripciones">Suscripciones</Link></li> {/* <-- Agregado */}
        </ul>
      </nav>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;