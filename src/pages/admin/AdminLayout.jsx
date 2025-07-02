import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const adminLinks = [
  { to: "/admin/productos", label: "Productos" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/reseñas", label: "Reseñas", icon: "fas fa-star" },
  { to: "/admin/mapa", label: "Mapa Entregas", icon: "fas fa-map-marker-alt" },
  { to: "/admin/ofertas", label: "Ofertas", icon: "fas fa-tags" },
  { to: "/admin/chat", label: "Chat Soporte", icon: "fas fa-comments" },
  { to: "/admin/estadisticas", label: "Estadísticas", icon: "fas fa-chart-bar" },
  { to: "/admin/usuarios", label: "Usuarios" },
  { to: "/admin/reportes", label: "Reportes" },
  { to: "/admin/suscripciones", label: "Suscripciones" }
];

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
          {adminLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to}>
                {link.icon && <i className={link.icon}></i>}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;