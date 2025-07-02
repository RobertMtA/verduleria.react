import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MapaRecorrido from '../components/MapaRecorrido';
import './SeguimientoEntrega.css';

const SeguimientoEntrega = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [mostrarCompletados, setMostrarCompletados] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  useEffect(() => {
    if (user?.email) {
      fetchPedidos();
    }
  }, [user]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pedidos/usuario/${user.email}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Verificar si la respuesta tiene el formato esperado
      const pedidosData = data.success ? data.pedidos : data;
      
      // Separar pedidos activos de completados
      const todosLosPedidos = pedidosData.map(pedido => ({
        id: pedido._id,
        numero: pedido._id.slice(-6),
        usuario: pedido.usuario,
        direccion: pedido.direccion || `${pedido.usuario?.nombre} - Dirección de entrega`,
        estado: pedido.estado || 'pendiente',
        total: pedido.total,
        fecha: pedido.fecha_pedido || pedido.fecha,
        productos: pedido.productos,
        coordenadas: generarCoordenadasPorId(pedido._id)
      }));

      setPedidos(todosLosPedidos);
      
      // Auto-seleccionar el primer pedido activo si existe
      const pedidosActivos = todosLosPedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado');
      if (pedidosActivos.length > 0 && !pedidoSeleccionado) {
        setPedidoSeleccionado(pedidosActivos[0]);
      }
      
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError('Error al cargar los pedidos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const generarCoordenadasPorId = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const baseLat = -34.6118;
    const baseLng = -58.3960;
    
    const latOffset = ((hash % 1000) / 10000) * (Math.random() > 0.5 ? 1 : -1);
    const lngOffset = (((hash * 7) % 1000) / 10000) * (Math.random() > 0.5 ? 1 : -1);
    
    return [baseLat + latOffset, baseLng + lngOffset];
  };

  const getEstadoInfo = (estado) => {
    const estados = {
      pendiente: {
        texto: 'Pedido Pendiente',
        descripcion: 'Tu pedido ha sido recibido y está pendiente de confirmación',
        icono: '⏳',
        color: '#ffc107',
        progreso: 20
      },
      confirmado: {
        texto: 'Pedido Confirmado',
        descripcion: 'Tu pedido ha sido confirmado y está en cola de preparación',
        icono: '📋',
        color: '#17a2b8',
        progreso: 40
      },
      en_proceso: {
        texto: 'Preparando Pedido',
        descripcion: 'Estamos seleccionando y empacando tus productos',
        icono: '📦',
        color: '#6f42c1',
        progreso: 60
      },
      en_camino: {
        texto: 'En Camino',
        descripcion: 'Tu pedido está en camino a tu dirección',
        icono: '🚚',
        color: '#9c27b0',
        progreso: 75
      },
      entregado: {
        texto: 'Entregado',
        descripcion: 'Tu pedido ha sido entregado exitosamente',
        icono: '✅',
        color: '#28a745',
        progreso: 100
      },
      cancelado: {
        texto: 'Cancelado',
        descripcion: 'El pedido ha sido cancelado',
        icono: '❌',
        color: '#dc3545',
        progreso: 0
      }
    };
    
    return estados[estado] || estados.pendiente;
  };

  const tiempoEstimado = (estado) => {
    switch (estado) {
      case 'pendiente': return '15-30 minutos';
      case 'confirmado': return '30-60 minutos';
      case 'en_proceso': return '20-45 minutos';
      case 'en_camino': return '10-25 minutos';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return '30-60 minutos';
    }
  };

  const pedidosActivos = pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado');
  const pedidosCompletados = pedidos.filter(p => p.estado === 'entregado' || p.estado === 'cancelado');

  if (!user) {
    return (
      <div className="seguimiento-container">
        <h2>Seguimiento de Entrega</h2>
        <p>Debes iniciar sesión para ver el seguimiento de tus pedidos.</p>
        <button onClick={() => navigate('/login')} className="login-btn">
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="seguimiento-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando seguimiento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seguimiento-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchPedidos} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seguimiento-container">
      <div className="seguimiento-header">
        <h2>Seguimiento de Entrega</h2>
        <p>Hola, {user.nombre || user.email}</p>
      </div>

      {pedidosActivos.length === 0 && pedidosCompletados.length === 0 ? (
        <div className="no-pedidos">
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No tienes pedidos</h3>
            <p>Cuando realices un pedido, podrás hacer seguimiento desde aquí.</p>
            <button 
              onClick={() => navigate('/productos')} 
              className="shop-btn"
            >
              Explorar Productos
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Sección de Pedidos Activos */}
          {pedidosActivos.length > 0 && (
            <div className="pedidos-activos">
              <h3>Pedidos en Curso</h3>
              
              {pedidosActivos.length > 1 && (
                <div className="selector-pedidos">
                  <label>Seleccionar pedido:</label>
                  <select 
                    value={pedidoSeleccionado?.id || ''} 
                    onChange={(e) => {
                      const pedido = pedidosActivos.find(p => p.id === e.target.value);
                      setPedidoSeleccionado(pedido);
                    }}
                  >
                    {pedidosActivos.map(pedido => (
                      <option key={pedido.id} value={pedido.id}>
                        Pedido #{pedido.numero} - ${pedido.total}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {pedidoSeleccionado && (
                <div className="seguimiento-detalle">
                  <div className="estado-actual">
                    <div className="estado-header">
                      <span className="estado-icono">
                        {getEstadoInfo(pedidoSeleccionado.estado).icono}
                      </span>
                      <div className="estado-info">
                        <h3>{getEstadoInfo(pedidoSeleccionado.estado).texto}</h3>
                        <p>{getEstadoInfo(pedidoSeleccionado.estado).descripcion}</p>
                        <small>Tiempo estimado: {tiempoEstimado(pedidoSeleccionado.estado)}</small>
                      </div>
                    </div>

                    <div className="progreso-entrega">
                      <div className="progreso-barra">
                        <div 
                          className="progreso-fill"
                          style={{ 
                            width: `${getEstadoInfo(pedidoSeleccionado.estado).progreso}%`,
                            backgroundColor: getEstadoInfo(pedidoSeleccionado.estado).color
                          }}
                        ></div>
                      </div>
                      <div className="progreso-etapas">
                        <div className={`etapa ${['pendiente', 'confirmado', 'en_proceso', 'en_camino', 'entregado'].includes(pedidoSeleccionado.estado) ? 'completada' : ''}`}>
                          ⏳ Pendiente
                        </div>
                        <div className={`etapa ${['confirmado', 'en_proceso', 'en_camino', 'entregado'].includes(pedidoSeleccionado.estado) ? 'completada' : ''}`}>
                          📋 Confirmado
                        </div>
                        <div className={`etapa ${['en_proceso', 'en_camino', 'entregado'].includes(pedidoSeleccionado.estado) ? 'completada' : ''}`}>
                          📦 Preparando
                        </div>
                        <div className={`etapa ${['en_camino', 'entregado'].includes(pedidoSeleccionado.estado) ? 'completada' : ''}`}>
                          🚚 En Camino
                        </div>
                        <div className={`etapa ${pedidoSeleccionado.estado === 'entregado' ? 'completada' : ''}`}>
                          ✅ Entregado
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-grid">
                    <div className="info-card">
                      <h4>📋 Detalles del Pedido</h4>
                      <div className="info-content">
                        <p><strong>Número:</strong> #{pedidoSeleccionado.numero}</p>
                        <p><strong>Total:</strong> ${pedidoSeleccionado.total}</p>
                        <p><strong>Dirección:</strong> {pedidoSeleccionado.direccion}</p>
                        <p><strong>Fecha:</strong> {new Date(pedidoSeleccionado.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>

                    <div className="info-card">
                      <h4>📞 ¿Necesitas ayuda?</h4>
                      <div className="info-content">
                        <p>Si tienes alguna pregunta sobre tu entrega:</p>
                        <div className="contact-buttons">
                          <button className="contact-btn phone">
                            📞 Llamar
                          </button>
                          <button className="contact-btn chat">
                            💬 Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mapa-container">
                    <h4>🗺️ Seguimiento de Entrega</h4>
                    <div className="mapa-info">
                      <div className="leyenda">
                        <div className="leyenda-item">
                          <span className="punto tienda">🏪</span>
                          <span>Tienda / Depósito</span>
                        </div>
                        <div className="leyenda-item">
                          <span className="punto destino">🎯</span>
                          <span>Destinos de Entrega</span>
                        </div>
                      </div>
                    </div>
                    <MapaRecorrido 
                      pedidos={[pedidoSeleccionado]} 
                      mostrarTodos={false}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toggle para pedidos completados */}
          {pedidosCompletados.length > 0 && (
            <div className="pedidos-completados-section">
              <div className="toggle-completados">
                <label>
                  <input 
                    type="checkbox" 
                    checked={mostrarCompletados}
                    onChange={(e) => setMostrarCompletados(e.target.checked)}
                  />
                  Mostrar pedidos completados ({pedidosCompletados.length})
                </label>
              </div>

              {mostrarCompletados && (
                <div className="pedidos-completados">
                  <h3>Historial de Pedidos</h3>
                  <div className="pedidos-lista">
                    {pedidosCompletados.map(pedido => (
                      <div key={pedido.id} className="pedido-completado-card">
                        <div className="pedido-header">
                          <span className="pedido-numero">#{pedido.numero}</span>
                          <span className={`estado-badge ${pedido.estado}`}>
                            {getEstadoInfo(pedido.estado).icono} {getEstadoInfo(pedido.estado).texto}
                          </span>
                        </div>
                        <div className="pedido-info">
                          <p><strong>Total:</strong> ${pedido.total}</p>
                          <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString('es-ES')}</p>
                          <p><strong>Productos:</strong> {pedido.productos?.length || 0} artículos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeguimientoEntrega;
