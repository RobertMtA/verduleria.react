import React from "react";
import "./Contacto.css";

const Contacto = () => (
  <div className="contacto-page">
    <h1>Contáctanos</h1>
    <p>
      Estamos aquí para ayudarte. Completa el formulario y nos pondremos en
      contacto contigo.
    </p>
    <div className="contacto-contenido">
      <form className="contacto-form">
        <label htmlFor="contact-name">Nombre completo</label>
        <input 
          id="contact-name"
          name="name"
          type="text" 
          placeholder="Tu nombre" 
          required 
        />
        <label htmlFor="contact-email">Email</label>
        <input 
          id="contact-email"
          name="email"
          type="email" 
          placeholder="Tu correo" 
          required 
        />
        <label htmlFor="contact-message">Mensaje</label>
        <textarea 
          id="contact-message"
          name="message"
          placeholder="Escribe tu mensaje" 
          required 
        />
        <button type="submit">Enviar</button>
      </form>
      <div className="contacto-info">
        <h2>Información de contacto</h2>
        <div className="info-item">
          <span className="icon">📍</span>
          <div>
            <strong>Dirección:</strong>
            <p>Tucumán 766</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">📞</span>
          <div>
            <strong>Teléfono:</strong>
            <p>+54 11 1234-5678</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">📧</span>
          <div>
            <strong>Email:</strong>
            <p>pedidos@verduleriaonline.com</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">🕒</span>
          <div>
            <strong>Horarios de atención:</strong>
            <p>Lunes a Domingo de 8:00 a 22:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contacto;