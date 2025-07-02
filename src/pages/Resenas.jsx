import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Reseñas from '../components/Reseñas';
import FormularioReseña from '../components/FormularioReseña';
import './Resenas.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const ResenasPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarReseñas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/resenas?publicas=true`);
      const data = await response.json();
      
      if (data.success) {
        setReseñas(data.reseñas || []);
      } else {
        setError('Error al cargar las reseñas');
      }
    } catch (error) {
      console.error('Error cargando reseñas:', error);
      setError('Error de conexión al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReseñas();
  }, []);

  const handleReseñaEnviada = () => {
    // Recargar las reseñas después de enviar una nueva
    cargarReseñas();
  };

  return (
    <div className="resenas-page">
      <div className="container">
        <h1 className="page-title">
          <i className="fas fa-star"></i> Reseñas de Nuestros Clientes
        </h1>
        <p className="page-subtitle">
          Conoce lo que opinan nuestros clientes sobre nuestros productos y servicio
        </p>

        {/* Formulario para escribir reseña (solo usuarios autenticados) */}
        {isAuthenticated && (
          <div className="formulario-resena-section">
            <h2>Escribe tu reseña</h2>
            <FormularioReseña onReseñaEnviada={handleReseñaEnviada} />
          </div>
        )}

        {/* Mensaje para usuarios no autenticados */}
        {!isAuthenticated && (
          <div className="login-prompt">
            <p>
              <i className="fas fa-info-circle"></i>
              Para escribir una reseña, <a href="/login">inicia sesión</a> o <a href="/registro">regístrate</a>
            </p>
          </div>
        )}

        {/* Lista de reseñas públicas */}
        <div className="resenas-section">
          <h2>Todas las Reseñas</h2>
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> Cargando reseñas...
            </div>
          ) : error ? (
            <div className="error">
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          ) : (
            <Reseñas reseñas={reseñas} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResenasPage;
