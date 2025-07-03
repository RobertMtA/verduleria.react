import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Reseñas from '../components/Reseñas';
import FormularioReseña from '../components/FormularioReseña';
import corsProxyService from '../services/corsProxyService';
import './Resenas.css';

const ResenasPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarReseñas = async () => {
    try {
      setLoading(true);
      
      // Cambiado de publicas=true a aprobadas=true para coincidir con la API
      const data = await corsProxyService.getResenas(true); // aprobadas=true
      
      if (data && (Array.isArray(data) || (data.success && data.reseñas))) {
        const reseñasArray = Array.isArray(data) ? data : (data.reseñas || []);
        
        // Filtrar solo las reseñas aprobadas para mostrar al público
        const reseñasAprobadas = reseñasArray.filter(r => r.aprobada === true);
        
        setReseñas(reseñasAprobadas);
        setError(null);
      } else {
        setError('No hay reseñas disponibles en este momento');
        setReseñas([]);
      }
    } catch (error) {
      setError('Error de conexión al cargar las reseñas');
      setReseñas([]);
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

  // Función para recargar manualmente
  const recargarManualmente = () => {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Todas las Reseñas</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {reseñas.length > 0 ? `${reseñas.length} reseñas encontradas` : 'Sin reseñas'}
              </span>
              <button 
                onClick={recargarManualmente}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {loading ? '🔄 Cargando...' : '🔄 Recargar'}
              </button>
            </div>
          </div>
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> Cargando reseñas...
            </div>
          ) : error ? (
            <div className="error">
              <i className="fas fa-exclamation-triangle"></i> {error}
              <button 
                onClick={recargarManualmente}
                style={{
                  marginLeft: '10px',
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <Reseñas reseñas={reseñas} showHeader={false} maxReseñas={50} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResenasPage;
