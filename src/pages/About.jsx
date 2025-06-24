import React from 'react';
import './About.css';

const About = () => (
  <div className="about-page">
    <h1>Sobre Nosotros</h1>
    <p>Somos una empresa comprometida con la calidad y el servicio</p>

    <div className="vision-mision">
      <div className="card">
        <h2>Misión</h2>
        <p>Ofrecer productos frescos y de calidad a nuestros clientes</p>
      </div>
      
      <div className="card">
        <h2>Visión</h2>
        <p>Ser la tienda online de referencia en productos frescos</p>
      </div>
    </div>

    <div className="equipo-section">
      <h2>Nuestro Equipo</h2>
      <p>Contamos con profesionales dedicados a brindarte el mejor servicio</p>
    </div>
  </div>
);

export default About;