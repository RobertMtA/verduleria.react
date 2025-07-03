import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-animation">
          <div className="not-found-404">404</div>
          <div className="not-found-circle"></div>
          <div className="not-found-shadow"></div>
        </div>
        
        <h1 className="not-found-title">¡Página no encontrada!</h1>
        
        <p className="not-found-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="not-found-button">
            <i className="fas fa-home"></i> Volver al inicio
          </Link>
          
          
        </div>
      </div>
    </div>
  );
};

export default NotFound;
