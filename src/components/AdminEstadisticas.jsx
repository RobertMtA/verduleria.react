import React, { useState, useEffect } from 'react';
import './AdminEstadisticas.css';

const AdminEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/admin/estadisticas`);
      const data = await response.json();
      
      if (data.success) {
        setEstadisticas(data.estadisticas);
      } else {
        setMensaje('Error cargando estadísticas');
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setMensaje('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarLimpieza = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/admin/limpiar`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMensaje(`✅ ${data.mensaje}`);
        // Recargar estadísticas después de la limpieza
        setTimeout(() => {
          cargarEstadisticas();
        }, 1000);
      } else {
        setMensaje(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error ejecutando limpieza:', error);
      setMensaje('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(cargarEstadisticas, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !estadisticas) {
    return (
      <div className="admin-estadisticas">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-estadisticas">
      <div className="estadisticas-header">
        <h2>
          <i className="fas fa-chart-bar"></i>
          Estadísticas del Sistema
        </h2>
        <button 
          className="btn-refresh"
          onClick={cargarEstadisticas}
          disabled={loading}
        >
          <i className="fas fa-sync-alt"></i>
          Actualizar
        </button>
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('✅') ? 'success' : 'error'}`}>
          {mensaje}
          <button onClick={() => setMensaje('')}>✕</button>
        </div>
      )}

      {estadisticas && (
        <div className="estadisticas-content">
          <div className="stats-grid">
            {/* Estadísticas de Mensajes */}
            <div className="stat-card mensajes">
              <div className="stat-header">
                <i className="fas fa-comments"></i>
                <h3>Mensajes de Chat</h3>
              </div>
              <div className="stat-body">
                <div className="stat-item">
                  <span className="label">Total:</span>
                  <span className="value">{estadisticas.mensajes.total}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Recientes (24h):</span>
                  <span className="value recent">{estadisticas.mensajes.recientes}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Antiguos (+24h):</span>
                  <span className="value old">{estadisticas.mensajes.antiguos}</span>
                </div>
              </div>
            </div>

            {/* Estadísticas de Pedidos */}
            <div className="stat-card pedidos">
              <div className="stat-header">
                <i className="fas fa-shopping-cart"></i>
                <h3>Pedidos</h3>
              </div>
              <div className="stat-body">
                <div className="stat-item">
                  <span className="label">Total:</span>
                  <span className="value">{estadisticas.pedidos.total}</span>
                </div>
              </div>
            </div>

            {/* Estadísticas de Base de Datos */}
            <div className="stat-card database">
              <div className="stat-header">
                <i className="fas fa-database"></i>
                <h3>Base de Datos</h3>
              </div>
              <div className="stat-body">
                <div className="stat-item">
                  <span className="label">Tamaño Chat:</span>
                  <span className="value">{estadisticas.baseDatos.tamañoEnMB} MB</span>
                </div>
                <div className="stat-item">
                  <span className="label">Documentos:</span>
                  <span className="value">{estadisticas.baseDatos.documentos}</span>
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div className="stat-card config">
              <div className="stat-header">
                <i className="fas fa-cogs"></i>
                <h3>Configuración</h3>
              </div>
              <div className="stat-body">
                <div className="stat-item">
                  <span className="label">TTL:</span>
                  <span className="value">{estadisticas.configuracion.ttlHoras}h</span>
                </div>
                <div className="stat-item">
                  <span className="label">Auto-limpieza:</span>
                  <span className="value active">
                    {estadisticas.configuracion.limpiezaAutomatica ? '✅ Activa' : '❌ Inactiva'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones de Limpieza */}
          <div className="limpieza-section">
            <div className="limpieza-card">
              <div className="limpieza-header">
                <i className="fas fa-broom"></i>
                <h3>Limpieza Manual</h3>
              </div>
              <div className="limpieza-body">
                <p>
                  Los mensajes se eliminan automáticamente después de 24 horas. 
                  Puedes ejecutar una limpieza manual si es necesario.
                </p>
                <div className="limpieza-info">
                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <span>Automática cada 60 segundos (MongoDB TTL)</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>Previene crecimiento excesivo de la BD</span>
                  </div>
                </div>
                <button 
                  className="btn-limpiar"
                  onClick={ejecutarLimpieza}
                  disabled={loading || estadisticas.mensajes.antiguos === 0}
                >
                  <i className="fas fa-trash-alt"></i>
                  {estadisticas.mensajes.antiguos > 0 
                    ? `Limpiar ${estadisticas.mensajes.antiguos} mensajes antiguos`
                    : 'No hay mensajes para limpiar'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEstadisticas;
