import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapaRecorrido.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados
const iconoTienda = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoCliente = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoRepartidor = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Coordenadas de la verdulería en Tucumán 766, Buenos Aires
const COORDENADAS_TIENDA = [-34.6037, -58.3816]; // Tucumán 766, CABA

const MapaRecorrido = ({ 
  pedidos = [], 
  mostrarRuta = true, 
  altura = '400px',
  centroPersonalizado = null,
  zoom = 12,
  modo = 'publico' // 'admin' o 'publico'
}) => {
  const [rutaCompleta, setRutaCompleta] = useState([]);
  const [loading, setLoading] = useState(false);

  // Componente para ajustar la vista del mapa
  const AjustarVista = ({ pedidos }) => {
    const map = useMap();
    
    useEffect(() => {
      if (pedidos.length > 0) {
        const puntos = [COORDENADAS_TIENDA];
        pedidos.forEach(pedido => {
          if (pedido.coordenadas) {
            puntos.push(pedido.coordenadas);
          }
        });
        
        if (puntos.length > 1) {
          const bounds = L.latLngBounds(puntos);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }, [pedidos, map]);

    return null;
  };

  // Simular coordenadas para pedidos que no las tengan
  const generarCoordenadasSimuladas = (pedido, index) => {
    if (pedido.coordenadas) return pedido.coordenadas;
    
    // Generar coordenadas aleatorias cerca de la tienda
    const lat = COORDENADAS_TIENDA[0] + (Math.random() - 0.5) * 0.1;
    const lng = COORDENADAS_TIENDA[1] + (Math.random() - 0.5) * 0.1;
    
    return [lat, lng];
  };

  // Calcular ruta optimizada (simulación básica)
  const calcularRuta = async () => {
    if (pedidos.length === 0) return;
    
    setLoading(true);
    
    try {
      // Simular tiempo de cálculo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ruta = [COORDENADAS_TIENDA];
      
      // Agregar puntos de entrega
      pedidos.forEach((pedido, index) => {
        const coordenadas = generarCoordenadasSimuladas(pedido, index);
        ruta.push(coordenadas);
      });
      
      // Volver a la tienda
      ruta.push(COORDENADAS_TIENDA);
      
      setRutaCompleta(ruta);
    } catch (error) {
      console.error('Error calculando ruta:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mostrarRuta && pedidos.length > 0) {
      calcularRuta();
    }
  }, [pedidos, mostrarRuta]);

  const estadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return '#ffc107';
      case 'preparando': return '#17a2b8';
      case 'en_camino': return '#007bff';
      case 'entregado': return '#28a745';
      case 'cancelado': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="mapa-container">
      {loading && (
        <div className="mapa-loading">
          <div className="spinner"></div>
          <span>Calculando ruta óptima...</span>
        </div>
      )}
      
      <div className="mapa-header">
        <h3>
          {modo === 'admin' ? 'Mapa de Entregas - Panel Admin' : 'Seguimiento de Entrega'}
        </h3>
        {modo === 'admin' && (
          <div className="mapa-stats">
            <span className="stat">
              <span className="stat-number">{pedidos.length}</span>
              <span className="stat-label">Entregas</span>
            </span>
            {rutaCompleta.length > 0 && (
              <span className="stat">
                <span className="stat-number">{(rutaCompleta.length * 2.5).toFixed(1)}km</span>
                <span className="stat-label">Distancia aprox.</span>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mapa-leyenda">
        <div className="leyenda-item">
          <div className="leyenda-color" style={{ backgroundColor: '#28a745' }}></div>
          <span>Tienda / Depósito</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-color" style={{ backgroundColor: '#dc3545' }}></div>
          <span>Destinos de Entrega</span>
        </div>
        {modo === 'admin' && (
          <div className="leyenda-item">
            <div className="leyenda-color" style={{ backgroundColor: '#007bff' }}></div>
            <span>Repartidor</span>
          </div>
        )}
      </div>

      <MapContainer
        center={centroPersonalizado || COORDENADAS_TIENDA}
        zoom={zoom}
        style={{ height: altura, width: '100%' }}
        className="mapa-leaflet"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador de la tienda */}
        <Marker position={COORDENADAS_TIENDA} icon={iconoTienda}>
          <Popup>
            <div className="popup-content">
              <h4>🥬 Verdulería Online</h4>
              <p><strong>📍 Tucumán 766</strong></p>
              <small>Centro de distribución y punto de partida</small>
              <br />
              <small>📞 +54 11 1234-5678</small>
            </div>
          </Popup>
        </Marker>

        {/* Marcadores de pedidos */}
        {pedidos.map((pedido, index) => {
          const coordenadas = generarCoordenadasSimuladas(pedido, index);
          return (
            <Marker key={pedido.id || index} position={coordenadas} icon={iconoCliente}>
              <Popup>
                <div className="popup-content">
                  <h4>📦 Pedido #{pedido.numero || pedido.id || index + 1}</h4>
                  <p><strong>Cliente:</strong> {pedido.usuario?.nombre || 'Cliente'}</p>
                  <p><strong>Dirección:</strong> {pedido.direccion || 'Dirección de entrega'}</p>
                  <p><strong>Estado:</strong> 
                    <span 
                      className="estado-badge" 
                      style={{ backgroundColor: estadoColor(pedido.estado) }}
                    >
                      {pedido.estado || 'pendiente'}
                    </span>
                  </p>
                  {pedido.total && (
                    <p><strong>Total:</strong> ${pedido.total.toLocaleString()}</p>
                  )}
                  {modo === 'admin' && (
                    <small>Coordenadas: {coordenadas[0].toFixed(4)}, {coordenadas[1].toFixed(4)}</small>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Ruta de entrega */}
        {mostrarRuta && rutaCompleta.length > 0 && (
          <Polyline
            positions={rutaCompleta}
            color="#007bff"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {/* Ajustar vista automáticamente */}
        <AjustarVista pedidos={pedidos} />
      </MapContainer>
    </div>
  );
};

export default MapaRecorrido;
