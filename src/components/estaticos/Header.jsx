import React, { useState, useContext } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { AuthContext, useAuth } from "../../context/AuthContext";
import Cart from '../../pages/Cart';
import './Header.css';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart(); // <-- usa cartItems, no cart
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);

  const cartItemsCount = cartItems ? cartItems.length : 0;

  const rol = localStorage.getItem("rol");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Centra horizontalmente
          gap: "10px",
          padding: "10px 0"
        }}
      >
        <Link to="/">
          <img
            src="/images/img-logo1.jpg"
            alt="Logo Verdulería"
            style={{ height: "100px", width: "100px", objectFit: "contain", cursor: "pointer" }}
          />
        </Link>
      </div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand logo-text" to="/">
            <i className="fas fa-apple-alt"></i> Verdulería Online
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${navbarOpen ? ' show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="fas fa-home"></i> Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productos">
                  <i className="fas fa-carrot"></i> Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ofertas">
                  <i className="fas fa-tags"></i> Ofertas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/resenas">
                  <i className="fas fa-star"></i> Reseñas
                </Link>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <Link className="nav-link" to="/perfil/seguimiento">
                    <i className="fas fa-truck"></i> Seguimiento
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/contacto">
                  <i className="fas fa-envelope"></i> Contacto
                </Link>
              </li>
              {/* Agrega este bloque para "Sobre Nosotros" */}
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  <i className="fas fa-info-circle"></i> Sobre Nosotros
                </Link>
              </li>
            </ul>
            <button
              className="cart-icon"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito de compras"
            >
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="user-icon" aria-label="Perfil de usuario">
                  <i className="fas fa-user"></i>
                </Link>
                {user?.role === 'admin' && (
                  <button
                    className="admin-icon"
                    onClick={() => navigate('/admin')}
                    aria-label="Panel de administración"
                  >
                    <i className="fas fa-user-cog"></i>
                  </button>
                )}
                <button onClick={handleLogout}>Cerrar sesión</button>
              </>
            ) : (
              <button
                className="login-icon"
                onClick={() => navigate('/login')}
                aria-label="Iniciar sesión"
              >
                <i className="fas fa-sign-in-alt"></i>
              </button>
            )}
          </div>
        </div>
      </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {rol === "admin" && (
        <NavLink to="/admin/pedidos">Pedidos (Admin)</NavLink>
      )}
      <div>
        {user ? <span>Hola, {user.nombre}</span> : <span>No has iniciado sesión</span>}
      </div>
    </header>
  );
};

export default Header;
