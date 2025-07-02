import React, { useState, useEffect } from 'react';
import MapaRecorrido from '../../components/MapaRecorrido';
import './MapaAdmin.css';

const MapaAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarRuta, setMostrarRuta] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pedidos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error cargando pedidos');
      }

      const data = await response.json();
      
      // Adaptar formato de pedidos para el mapa
      const pedidosParaMapa = data.map(pedido => ({
        id: pedido._id,
        numero: pedido._id.slice(-6),
        usuario: pedido.usuario,
        direccion: pedido.direccion || `${pedido.usuario?.nombre} - Dirección no especificada`,
        estado: pedido.estado || 'pendiente',
        total: pedido.total,
        fecha: pedido.fecha,
        productos: pedido.productos,
        // Generar coordenadas simuladas basadas en el ID
        coordenadas: generarCoordenadasPorId(pedido._id)
      }));

      setPedidos(pedidosParaMapa);
    } catch (error) {
      console.error('Error:', error);
      setError('Error cargando los pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Función para generar coordenadas consistentes basadas en el ID del pedido
  const generarCoordenadasPorId = (id) => {
    // Usar el hash del ID para generar coordenadas consistentes
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32bit
    }
    
    // Coordenadas base (Buenos Aires)
    const baseLat = -34.6118;
    const baseLng = -58.3960;
    
    // Generar offset basado en el hash
    const latOffset = ((hash % 1000) / 10000) * (Math.random() > 0.5 ? 1 : -1);
    const lngOffset = (((hash * 7) % 1000) / 10000) * (Math.random() > 0.5 ? 1 : -1);
    
    return [baseLat + latOffset, baseLng + lngOffset];
  };

  const filtrarPedidos = () => {
    if (filtroEstado === 'todos') {
      return pedidos;
    }
    return pedidos.filter(pedido => pedido.estado === filtroEstado);
  };

  const pedidosFiltrados = filtrarPedidos();

  const estadosDisponibles = [
    { valor: 'todos', label: 'Todos los pedidos', color: '#6c757d' },
    { valor: 'pendiente', label: 'Pendientes', color: '#ffc107' },
    { valor: 'preparando', label: 'Preparando', color: '#17a2b8' },
    { valor: 'en_camino', label: 'En camino', color: '#007bff' },
    { valor: 'entregado', label: 'Entregados', color: '#28a745' },
    { valor: 'cancelado', label: 'Cancelados', color: '#dc3545' }
  ];

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        // Actualizar el estado local
        setPedidos(prevPedidos => 
          prevPedidos.map(pedido => 
            pedido.id === pedidoId 
              ? { ...pedido, estado: nuevoEstado }
              : pedido
          )
        );
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  if (loading) {
    return (
      <div className="mapa-admin-loading">
        <div className="spinner-large"></div>
        <p>Cargando mapa de entregas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mapa-admin-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={cargarPedidos} className="btn-reintentar">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mapa-admin">
      <div className="mapa-admin-header">
        <h2>🗺️ Mapa de Entregas</h2>
        <p>Visualiza y gestiona todas las entregas en tiempo real</p>
      </div>

      <div className="controles-mapa">
        <div className="filtros-estado">
          <label>Filtrar por estado:</label>
          <div className="estado-buttons">
            {estadosDisponibles.map(estado => (
              <button
                key={estado.valor}
                className={`btn-estado ${filtroEstado === estado.valor ? 'activo' : ''}`}
                style={{ 
                  borderColor: estado.color,
                  backgroundColor: filtroEstado === estado.valor ? estado.color : 'transparent',
                  color: filtroEstado === estado.valor ? 'white' : estado.color
                }}
                onClick={() => setFiltroEstado(estado.valor)}
              >
                {estado.label}
                {estado.valor !== 'todos' && (
                  <span className="contador">
                    {pedidos.filter(p => p.estado === estado.valor).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="controles-vista">
          <label>
            <input
              type="checkbox"
              checked={mostrarRuta}
              onChange={(e) => setMostrarRuta(e.target.checked)}
            />
            Mostrar ruta optimizada
          </label>
          <button 
            onClick={cargarPedidos}
            className="btn-actualizar"
            title="Actualizar datos"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <div className="stat-numero">{pedidos.length}</div>
          <div className="stat-texto">Total Pedidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-numero">{pedidos.filter(p => p.estado === 'en_camino').length}</div>
          <div className="stat-texto">En Camino</div>
        </div>
        <div className="stat-card">
          <div className="stat-numero">{pedidos.filter(p => p.estado === 'entregado').length}</div>
          <div className="stat-texto">Entregados Hoy</div>
        </div>
        <div className="stat-card">
          <div className="stat-numero">
            ${pedidos.reduce((total, p) => total + (p.total || 0), 0).toLocaleString()}
          </div>
          <div className="stat-texto">Facturación Total</div>
        </div>
      </div>

      <MapaRecorrido
        pedidos={pedidosFiltrados}
        mostrarRuta={mostrarRuta}
        altura="500px"
        zoom={11}
        modo="admin"
      />

      <div className="lista-pedidos-rapida">
        <h3>Pedidos en el Mapa ({pedidosFiltrados.length})</h3>
        <div className="pedidos-grid">
          {pedidosFiltrados.map(pedido => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <span className="pedido-numero">#{pedido.numero}</span>
                <select
                  value={pedido.estado}
                  onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                  className="estado-select"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="preparando">Preparando</option>
                  <option value="en_camino">En Camino</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="pedido-info">
                <p><strong>{pedido.usuario?.nombre || 'Cliente'}</strong></p>
                <p className="direccion">{pedido.direccion}</p>
                <p className="total">${pedido.total?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapaAdmin;
