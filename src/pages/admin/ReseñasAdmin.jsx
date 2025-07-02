import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./ReseñasAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const ReseñasAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todas");

  // Obtener reseñas y estadísticas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener reseñas
        const reseñasResponse = await fetch(`${API_URL}/resenas`);
        if (reseñasResponse.ok) {
          const reseñasData = await reseñasResponse.json();
          console.log('📥 Datos de reseñas recibidos:', reseñasData);
          
          // El backend devuelve {success: true, reseñas: [...]}
          if (reseñasData.success && Array.isArray(reseñasData.reseñas)) {
            setReseñas(reseñasData.reseñas);
          } else {
            // Fallback para compatibilidad con formato anterior
            setReseñas(Array.isArray(reseñasData) ? reseñasData : []);
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
        setError("No se pudieron cargar las reseñas");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aprobar/Desaprobar reseña
  const cambiarEstadoAprobacion = async (id, aprobar) => {
    try {
      setError("");
      setSuccess("");
      
      const response = await fetch(`${API_URL}/resenas/${id}/aprobar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aprobada: aprobar })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error al actualizar reseña");
      }

      // Actualizar estado local
      setReseñas(reseñas.map(reseña =>
        reseña._id === id ? { ...reseña, aprobada: aprobar } : reseña
      ));

      setSuccess(`Reseña ${aprobar ? 'aprobada' : 'desaprobada'} exitosamente`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error al actualizar:", err);
    }
  };

  // Eliminar reseña
  const eliminarReseña = async (id, nombreUsuario) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar la reseña de ${nombreUsuario}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      setError("");
      setSuccess("");
      
      const response = await fetch(`${API_URL}/resenas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error al eliminar reseña");
      }

      // Actualizar estado local
      setReseñas(reseñas.filter(reseña => reseña._id !== id));

      setSuccess("Reseña eliminada exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Error al eliminar reseña: ${err.message}`);
      console.error("Error al eliminar:", err);
    }
  };

  // Filtrar reseñas
  const reseñasFiltradas = filter === "todas"
    ? reseñas
    : filter === "aprobadas"
    ? reseñas.filter(reseña => reseña.aprobada)
    : reseñas.filter(reseña => !reseña.aprobada);

  // Debug logging
  console.log('🔍 Estado actual del componente:');
  console.log('   Filter:', filter);
  console.log('   Reseñas totales:', reseñas.length);
  console.log('   Reseñas filtradas:', reseñasFiltradas.length);
  console.log('   Estadísticas:', estadisticas);
  
  if (filter === "pendientes") {
    console.log('📝 Reseñas pendientes:', reseñas.filter(r => !r.aprobada));
  }

  // Renderizar estrellas
  const renderEstrellas = (calificacion) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        style={{ 
          color: index < calificacion ? '#ffc107' : '#e0e0e0',
          fontSize: '16px'
        }}
      >
        ★
      </span>
    ));
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="reseñas-admin-container">
      <h1>Gestión de Reseñas</h1>

      {error && (
        <div className="alert error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="estadisticas-container">
          <div className="estadistica-card">
            <h3>Total Reseñas</h3>
            <p className="numero">{estadisticas.total}</p>
          </div>
          <div className="estadistica-card">
            <h3>Aprobadas</h3>
            <p className="numero verde">{estadisticas.aprobadas}</p>
          </div>
          <div className="estadistica-card">
            <h3>Pendientes</h3>
            <p className="numero naranja">{estadisticas.pendientes}</p>
          </div>
          <div className="estadistica-card">
            <h3>Promedio</h3>
            <p className="numero azul">{estadisticas.promedio}/5 ★</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filters">
        {["todas", "aprobadas", "pendientes"].map(filtro => (
          <button
            key={filtro}
            className={filter === filtro ? "active" : ""}
            onClick={() => setFilter(filtro)}
          >
            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Cargando reseñas...</div>
      ) : reseñasFiltradas.length === 0 ? (
        <div className="no-data">
          <p>No hay reseñas {filter !== "todas" ? `${filter}` : ""}</p>
        </div>
      ) : (
        <div className="reseñas-grid">
          {reseñasFiltradas.map(reseña => (
            <div key={reseña._id} className={`reseña-card ${reseña.aprobada ? 'aprobada' : 'pendiente'}`}>
              <div className="reseña-header">
                <div className="usuario-info">
                  <h4>{reseña.usuario.nombre}</h4>
                  <p className="email">{reseña.usuario.email}</p>
                </div>
                <div className="calificacion">
                  {renderEstrellas(reseña.calificacion)}
                  <span className="numero-calificacion">({reseña.calificacion}/5)</span>
                </div>
              </div>
              
              <div className="reseña-body">
                <p className="comentario">"{reseña.comentario}"</p>
                <div className="metadata">
                  <span className="fecha">{formatearFecha(reseña.fecha_reseña)}</span>
                  <span className="producto">Producto: {reseña.producto}</span>
                </div>
              </div>
              
              <div className="reseña-actions">
                <div className="estado">
                  <span className={`badge ${reseña.aprobada ? 'aprobada' : 'pendiente'}`}>
                    {reseña.aprobada ? '✓ Aprobada' : '⏳ Pendiente'}
                  </span>
                </div>
                
                <div className="botones">
                  {!reseña.aprobada ? (
                    <button 
                      onClick={() => cambiarEstadoAprobacion(reseña._id, true)}
                      className="btn-aprobar"
                    >
                      ✓ Aprobar
                    </button>
                  ) : (
                    <button 
                      onClick={() => cambiarEstadoAprobacion(reseña._id, false)}
                      className="btn-desaprobar"
                    >
                      ✗ Desaprobar
                    </button>
                  )}
                  
                  <button 
                    onClick={() => eliminarReseña(reseña._id, reseña.usuario.nombre)}
                    className="btn-eliminar"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReseñasAdmin;
