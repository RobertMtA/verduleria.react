import React, { useState } from 'react';
import './DemoBanner.css';

const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <div className="demo-banner-icon">
          🧪
        </div>
        <div className="demo-banner-text">
          <h3>🥬 Demo de Verdulería Online</h3>
          <p>
            Esta es una <strong>demostración</strong> de un sistema de venta de verduras y frutas frescas. 
            Si estás interesado en tener tu propia tienda online, ¡contáctame!
          </p>
          <div className="demo-banner-contact">
            <a 
              href="mailto:roberto@verduleria-demo.com" 
              className="contact-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              📧 Contáctame
            </a>
            <a 
              href="https://wa.me/5491234567890?text=Hola,%20me%20interesa%20el%20sistema%20de%20verdulería%20online"
              className="contact-btn whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
        <button 
          className="demo-banner-close"
          onClick={() => setIsVisible(false)}
          aria-label="Cerrar banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
