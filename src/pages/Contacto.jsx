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
        <p>Av. Principal 123, Ciudad, País</p>
        <p>Tel: (123) 456-7890</p>
        <p>Email: pedidos@verduleriaonline.com</p>
      </div>
    </div>
  </div>
);

export default Contacto;