import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '/images/img-logo1.jpg'; // Corregida la ruta

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección 1: Logo y descripción */}
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Verdulería Online" className="logo-img" />
          </Link>
          <p className="footer-description">
            Frescura y calidad directamente a tu hogar. Productos orgánicos seleccionados cuidadosamente.
          </p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
          </div>
        </div>

        {/* Sección 2: Enlaces rápidos */}
        <div className="footer-section">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><Link to="/productos" className="footer-link">Nuestros Productos</Link></li>
            <li><Link to="/ofertas" className="footer-link">Ofertas Especiales</Link></li>
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Av. Siempre Fresca 123, Ciudad</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>(123) 456-7890</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>pedidos@verduleriaonline.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Lunes a Sábado: 8:00 - 20:00</span>
            </li>
          </ul>
        </div>

        {/* Sección 4: Redes sociales y newsletter */}
        <div className="footer-section">
          <h3 className="footer-title">Síguenos</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          
          
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} Desarrollador Verdulería Online..|Roberto Gaona</p>
      
      </div>
    </footer>
  );
};

export default Footer;
