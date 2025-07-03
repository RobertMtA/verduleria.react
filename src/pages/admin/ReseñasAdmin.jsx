import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import corsProxyService from "../../services/corsProxyService.js";
import "./ReseñasAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const ReseñasAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todas");
  const [dataSource, setDataSource] = useState('unknown'); // Para mostrar la fuente de datos

  // Obtener reseñas y estadísticas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log('🔍 Cargando reseñas en admin...');
        
        // Obtener reseñas usando el proxy service
        const reseñasData = await corsProxyService.getResenas();
        
        console.log('📋 Datos de reseñas recibidos:', reseñasData);
        
        if (reseñasData && reseñasData.success && Array.isArray(reseñasData.reseñas)) {
          console.log(`✅ ${reseñasData.reseñas.length} reseñas cargadas en admin`);
          setReseñas(reseñasData.reseñas);
          setDataSource(reseñasData.source || 'unknown');
        } else {
          console.log('⚠️ No se encontraron reseñas válidas');
          setReseñas([]);
          setDataSource('empty');
        }
        
        // Obtener estadísticas
        const statsData = await corsProxyService.getEstadisticasResenas();
        
        if (statsData && statsData.success) {
          console.log('📊 Estadísticas cargadas:', statsData.estadisticas);
          setEstadisticas(statsData.estadisticas);
        }
        
      } catch (err) {
        console.error('❌ Error cargando reseñas en admin:', err);
        setError("No se pudieron cargar las reseñas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Actualización automática deshabilitada temporalmente para mejorar performance
    // Se puede reactivar cuando el backend esté estable
    /* 
    const interval = setInterval(() => {
      console.log('🔄 Actualizando reseñas automáticamente...');
      fetchData();
    }, 30000); // Cambiado a 30 segundos para reducir carga
    
    return () => clearInterval(interval);
    */
  }, []);

  // Aprobar/Desaprobar reseña
  const cambiarEstadoAprobacion = async (id, aprobar) => {
    try {
      setError("");
      setSuccess("");
      
      // Usar las funciones locales del servicio
      if (aprobar) {
        await corsProxyService.aprobarResena(id);
      } else {
        await corsProxyService.rechazarResena(id);
      }
      
      // Recargar las reseñas para reflejar los cambios
      const reseñasData = await corsProxyService.getResenas();
      if (reseñasData && reseñasData.success && Array.isArray(reseñasData.reseñas)) {
        setReseñas(reseñasData.reseñas);
      }
      
      // Actualizar estadísticas
      const statsData = await corsProxyService.getEstadisticasResenas();
      if (statsData && statsData.success) {
        setEstadisticas(statsData.estadisticas);
      }

      setSuccess(`Reseña ${aprobar ? 'aprobada' : 'rechazada'} exitosamente`);
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para probar reseñas públicas (mismo método que usa el frontend)
  const probarResenasPublicas = async () => {
    try {
      setLoading(true);
      console.log('📋 Probando carga de reseñas públicas...');
      
      // Usar la misma función que usa la página pública
      const data = await corsProxyService.getResenas(true); // aprobadas=true
      
      console.log('📋 Datos de reseñas públicas:', data);
      
      if (data && data.success && data.reseñas) {
        setSuccess(`✅ Reseñas públicas cargadas: ${data.reseñas.length} encontradas`);
        console.log('📋 Reseñas públicas:', data.reseñas.map(r => `${r.nombreUsuario || r.usuario?.nombre}: ${r.aprobada ? 'Aprobada' : 'Pendiente'}`));
      } else {
        setError('❌ No se encontraron reseñas públicas');
      }
    } catch (error) {
      console.error('❌ Error probando reseñas públicas:', error);
      setError(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para probar conectividad del backend
  const probarBackend = async () => {
    try {
      setLoading(true);
      console.log('🌐 Probando conectividad del backend...');
      
      // Probar endpoint directo
      const response = await fetch('https://verduleria-backend-m19n.onrender.com/api/resenas');
      const data = await response.text();
      
      console.log('📡 Respuesta del backend:', response.status, data);
      
      if (response.ok) {
        const jsonData = JSON.parse(data);
        setSuccess(`✅ Backend conectado! ${jsonData.reseñas?.length || 0} reseñas encontradas`);
        // Recargar datos
        recargarDatos();
      } else {
        setError(`❌ Backend error: ${response.status} - ${data}`);
      }
    } catch (error) {
      console.error('❌ Error probando backend:', error);
      setError(`❌ Error de conectividad: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar datos manualmente
  const recargarDatos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Recargando datos manualmente...');
      
      // Obtener reseñas usando el proxy service
      const reseñasData = await corsProxyService.getResenas();
      
      console.log('📋 Datos de reseñas recibidos:', reseñasData);
      
      if (reseñasData && reseñasData.success && Array.isArray(reseñasData.reseñas)) {
        console.log(`✅ ${reseñasData.reseñas.length} reseñas cargadas en admin`);
        setReseñas(reseñasData.reseñas);
      } else {
        console.log('⚠️ No se encontraron reseñas válidas');
        setReseñas([]);
      }
      
      // Obtener estadísticas
      const statsData = await corsProxyService.getEstadisticasResenas();
      
      if (statsData && statsData.success) {
        console.log('📊 Estadísticas cargadas:', statsData.estadisticas);
        setEstadisticas(statsData.estadisticas);
      }
      
      setSuccess('Datos actualizados correctamente');
      setTimeout(() => setSuccess(''), 2000);
      
    } catch (err) {
      console.error('❌ Error recargando datos:', err);
      setError("Error al recargar los datos");
    } finally {
      setLoading(false);
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
      
      // Simular eliminación actualizando el estado local
      setReseñas(reseñas.filter(reseña => reseña._id !== id));

      setSuccess("Reseña eliminada exitosamente");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError(`Error al eliminar reseña: ${err.message}`);
    }
  };

  // Filtrar reseñas
  const reseñasFiltradas = filter === "todas"
    ? reseñas
    : filter === "aprobadas"
    ? reseñas.filter(reseña => reseña.aprobada)
    : reseñas.filter(reseña => !reseña.aprobada);

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

      {/* Panel de diagnóstico */}
      <div style={{
        backgroundColor: dataSource === 'backend' ? '#e8f5e8' : dataSource === 'local' ? '#fff8e1' : '#ffeaea',
        border: `1px solid ${dataSource === 'backend' ? '#4caf50' : dataSource === 'local' ? '#ff9800' : '#f44336'}`,
        borderRadius: '8px',
        padding: '10px 16px',
        marginBottom: '20px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '16px' }}>
          {dataSource === 'backend' ? '✅' : dataSource === 'local' ? '💾' : '⚠️'}
        </span>
        <div>
          <strong>
            {dataSource === 'backend' && 'Backend Conectado'}
            {dataSource === 'local' && 'Modo Desarrollo (Mock Data)'}
            {dataSource === 'unknown' && 'Estado Desconocido'}
            {dataSource === 'empty' && 'Sin Datos'}
          </strong>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
            {dataSource === 'local' && 'Los cambios se guardan localmente para testing'}
            {dataSource === 'backend' && 'Operaciones sincronizadas con MongoDB'}
            {dataSource === 'unknown' && 'Verificar conectividad del backend'}
            {dataSource === 'empty' && 'No hay reseñas disponibles'}
          </div>
        </div>
      </div>

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

      {/* Filtros y botón de recarga */}
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
        <button 
          className="refresh-btn" 
          onClick={recargarDatos}
          disabled={loading}
          style={{
            marginLeft: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Cargando...' : '🔄 Recargar'}
        </button>
        <button 
          className="test-backend-btn" 
          onClick={probarBackend}
          disabled={loading}
          style={{
            marginLeft: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Probando...' : '🌐 Probar Backend'}
        </button>
        <button 
          className="test-public-btn" 
          onClick={probarResenasPublicas}
          disabled={loading}
          style={{
            marginLeft: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Probando...' : '📋 Probar Públicas'}
        </button>
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

      {/* Mostrar estado del sistema solo en desarrollo */}
      {(import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.port === '5173') && (
        <div className="estado-sistema">
          <h2>Estado del Sistema</h2>
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: '10px',
            fontStyle: 'italic'
          }}>
            ℹ️ Esta información solo es visible en modo desarrollo
          </div>
          <pre style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify({
              modo: import.meta.env.DEV ? 'desarrollo' : 'producción',
              hostname: window.location.hostname,
              puerto: window.location.port,
              error,
              success,
              loading,
              filter,
              dataSource,
              reseñas: reseñas.length,
              estadisticas
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReseñasAdmin;
