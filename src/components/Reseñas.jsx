import React, { useEffect, useState } from "react";
import "./Reseñas.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const Reseñas = () => {
  const [reseñas, setReseñas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReseñas = async () => {
      try {
        setLoading(true);
        
        // Obtener solo reseñas aprobadas
        const reseñasResponse = await fetch(`${API_URL}/resenas?aprobadas=true`);
        if (reseñasResponse.ok) {
          const reseñasData = await reseñasResponse.json();
          console.log('📥 Reseñas públicas recibidas:', reseñasData);
          
          // El backend devuelve {success: true, reseñas: [...]}
          if (reseñasData.success && Array.isArray(reseñasData.reseñas)) {
            setReseñas(reseñasData.reseñas.slice(0, 6)); // Solo las 6 más recientes
          } else {
            // Fallback para compatibilidad
            setReseñas(Array.isArray(reseñasData) ? reseñasData.slice(0, 6) : []);
          }
        }
        
        // Obtener estadísticas
        const statsResponse = await fetch(`${API_URL}/resenas/estadisticas`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setEstadisticas(statsData.estadisticas);
          }
        }
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReseñas();
  }, []);

  // Renderizar estrellas
  const renderEstrellas = (calificacion) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`estrella ${index < calificacion ? 'llena' : 'vacia'}`}
      >
        ★
      </span>
    ));
  };

  // Formatear fecha de manera amigable
  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaReseña = new Date(fecha);
    const diferencia = Math.floor((ahora - fechaReseña) / (1000 * 60 * 60 * 24));
    
    if (diferencia === 0) return "Hoy";
    if (diferencia === 1) return "Ayer";
    if (diferencia < 7) return `Hace ${diferencia} días`;
    if (diferencia < 30) return `Hace ${Math.floor(diferencia / 7)} semanas`;
    return fechaReseña.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="reseñas-section">
        <div className="container">
          <div className="loading">Cargando reseñas...</div>
        </div>
      </section>
    );
  }

  if (reseñas.length === 0) {
    return null; // No mostrar la sección si no hay reseñas
  }

  return (
    <section className="reseñas-section">
      <div className="container">
        <div className="reseñas-header">
          <h2>Lo que dicen nuestros clientes</h2>
          {estadisticas && (
            <div className="promedio-general">
              <div className="estrellas-promedio">
                {renderEstrellas(Math.round(estadisticas.promedio))}
              </div>
              <span className="numero-promedio">{estadisticas.promedio}/5</span>
              <span className="total-reseñas">({estadisticas.aprobadas} reseñas)</span>
            </div>
          )}
        </div>
        
        <div className="reseñas-grid">
          {reseñas.map((reseña, index) => (
            <div 
              key={reseña._id} 
              className="reseña-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="reseña-header">
                <div className="avatar">
                  {reseña.usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="usuario-info">
                  <h4>{reseña.usuario.nombre}</h4>
                  <div className="calificacion">
                    {renderEstrellas(reseña.calificacion)}
                  </div>
                </div>
                <div className="fecha">
                  {formatearFecha(reseña.fecha_reseña)}
                </div>
              </div>
              
              <div className="comentario">
                <p>"{reseña.comentario}"</p>
              </div>
              
              {reseña.producto !== 'general' && (
                <div className="producto-tag">
                  📦 {reseña.producto}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {reseñas.length >= 6 && (
          <div className="ver-mas">
            <p>¿Quieres compartir tu experiencia?</p>
            <button className="btn-escribir-reseña">
              ✍️ Escribir reseña
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reseñas;
