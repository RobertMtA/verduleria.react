import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapaRecorrido from './MapaRecorrido';
import './MapaWidget.css';

const MapaWidget = () => {
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://verduleria-backend-m19n.onrender.com/api';

  useEffect(() => {
    cargarPedidosRecientes();
  }, []);

  const cargarPedidosRecientes = async () => {
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
      
      // Tomar solo los pedidos más recientes que no estén entregados o cancelados
      const pedidosActivos = data
        .filter(pedido => ['pendiente', 'preparando', 'en_camino'].includes(pedido.estado))
        .slice(0, 5) // Solo los primeros 5
        .map(pedido => ({
          id: pedido._id,
          numero: pedido._id.slice(-6),
          usuario: pedido.usuario,
          direccion: pedido.direccion || `${pedido.usuario?.nombre} - Dirección`,
          estado: pedido.estado || 'pendiente',
          total: pedido.total,
          fecha: pedido.fecha,
          coordenadas: generarCoordenadasPorId(pedido._id)
        }));

      setPedidosRecientes(pedidosActivos);
    } catch (error) {
      console.error('Error:', error);
      setError('Error cargando pedidos');
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
    
    // Coordenadas base: Tucumán 766, Buenos Aires
    const baseLat = -34.6037;
    const baseLng = -58.3816;
    
    const latOffset = ((hash % 1000) / 10000) * (Math.random() > 0.5 ? 1 : -1);
    const lngOffset = (((hash * 7) % 1000) / 10000) * (Math.random() > 0.5 ? 1 : -1);
    
    return [baseLat + latOffset, baseLng + lngOffset];
  };

  if (loading) {
    return (
      <div className="mapa-widget">
        <div className="widget-header">
          <h3>🗺️ Mapa de Entregas</h3>
        </div>
        <div className="widget-loading">
          <div className="spinner-small"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || pedidosRecientes.length === 0) {
    return (
      <div className="mapa-widget">
        <div className="widget-header">
          <h3>🗺️ Mapa de Entregas</h3>
          <Link to="/admin/mapa" className="btn-ver-completo">
            Ver completo
          </Link>
        </div>
        <div className="widget-empty">
          <p>No hay entregas activas</p>
          <small>Los pedidos en curso aparecerán aquí</small>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-widget">
      <div className="widget-header">
        <h3>🗺️ Entregas Activas</h3>
        <Link to="/admin/mapa" className="btn-ver-completo">
          Ver completo →
        </Link>
      </div>
      
      <div className="widget-stats">
        <div className="stat-mini">
          <span className="numero">{pedidosRecientes.length}</span>
          <span className="etiqueta">Entregas</span>
        </div>
        <div className="stat-mini">
          <span className="numero">
            ${pedidosRecientes.reduce((total, p) => total + (p.total || 0), 0).toLocaleString()}
          </span>
          <span className="etiqueta">Total</span>
        </div>
      </div>

      <div className="mapa-widget-container">
        <MapaRecorrido
          pedidos={pedidosRecientes}
          mostrarRuta={true}
          altura="300px"
          zoom={10}
          modo="admin"
        />
      </div>

      <div className="widget-footer">
        <div className="pedidos-resumen">
          {pedidosRecientes.map(pedido => (
            <div key={pedido.id} className="pedido-mini">
              <span className="pedido-numero">#{pedido.numero}</span>
              <span className={`estado-mini ${pedido.estado}`}>
                {pedido.estado}
              </span>
              <span className="pedido-total">${pedido.total?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapaWidget;
