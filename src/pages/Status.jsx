import React, { useState, useEffect } from 'react';
import corsProxyService from '../services/corsProxyService.js';

const Status = () => {
  const [status, setStatus] = useState({
    frontend: 'Verificando...',
    backend: 'Verificando...',
    proxy: 'Verificando...',
    productos: 'Verificando...',
    ofertas: 'Verificando...',
    perfil: 'Verificando...',
    login: 'Verificando...',
    resenas: 'Verificando...'
  });

  useEffect(() => {
    verificarEstado();
  }, []);

  const verificarEstado = async () => {
    console.log('🔍 Verificando estado del sistema...');
    
    // Estado del frontend
    setStatus(prev => ({ ...prev, frontend: 'Frontend cargado - v2.4.0 (soporte reseñas + proxy)' }));
    
    // Verificar backend directo
    try {
      const response = await fetch('https://verduleria-backend-m19n.onrender.com/api/productos');
      if (response.ok) {
        setStatus(prev => ({ ...prev, backend: 'Backend responde OK (sin CORS)' }));
      } else {
        setStatus(prev => ({ ...prev, backend: `Backend error: ${response.status}` }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, backend: `Backend error: ${error.message}` }));
    }
    
    // Verificar proxy service
    try {
      const productos = await corsProxyService.getProductos();
      if (productos && productos.productos && productos.productos.length > 0) {
        setStatus(prev => ({ 
          ...prev, 
          proxy: 'Proxy funciona OK',
          productos: `${productos.productos.length} productos via proxy (${productos.source})`
        }));
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        proxy: `Proxy error: ${error.message}`,
        productos: 'Error cargando productos'
      }));
    }
    
    // Verificar ofertas
    try {
      const ofertas = await corsProxyService.getOfertas(true);
      if (ofertas && ofertas.ofertas && ofertas.ofertas.length > 0) {
        setStatus(prev => ({ 
          ...prev, 
          ofertas: `${ofertas.ofertas.length} ofertas (${ofertas.source})`
        }));
      } else {
        setStatus(prev => ({ 
          ...prev, 
          ofertas: 'Sin ofertas disponibles'
        }));
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        ofertas: `Error: ${error.message}`
      }));
    }
    
    // Verificar endpoint de perfil
    try {
      const response = await fetch('https://verduleria-backend-m19n.onrender.com/api/perfil/test@example.com');
      if (response.ok) {
        setStatus(prev => ({ ...prev, perfil: 'Endpoint perfil disponible' }));
      } else {
        setStatus(prev => ({ ...prev, perfil: `Endpoint perfil no disponible (${response.status}) - usando modo temporal` }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, perfil: 'Endpoint perfil no disponible - usando modo temporal' }));
    }
    
    // Verificar endpoint de login
    try {
      const response = await fetch('https://verduleria-backend-m19n.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: '123456' })
      });
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ ...prev, login: 'Endpoint login disponible' }));
      } else {
        setStatus(prev => ({ ...prev, login: `Login responde (${response.status}) - funcional` }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, login: `Login error: ${error.message}` }));
    }
    
    // Verificar reseñas
    try {
      const resenas = await corsProxyService.getResenas();
      if (resenas && resenas.reseñas && resenas.reseñas.length > 0) {
        setStatus(prev => ({ 
          ...prev, 
          resenas: `${resenas.reseñas.length} reseñas (${resenas.source})`
        }));
      } else {
        setStatus(prev => ({ ...prev, resenas: 'Sin reseñas disponibles' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, resenas: `Error: ${error.message}` }));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Estado del Sistema</h1>
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h2>Diagnóstico Técnico</h2>
        <div style={{ lineHeight: '1.8' }}>
          <div><strong>Frontend:</strong> {status.frontend}</div>
          <div><strong>Backend:</strong> {status.backend}</div>
          <div><strong>Proxy Service:</strong> {status.proxy}</div>
          <div><strong>Productos:</strong> {status.productos}</div>
          <div><strong>Ofertas:</strong> {status.ofertas}</div>
          <div><strong>Perfil de Usuario:</strong> {status.perfil}</div>
          <div><strong>Login/Autenticación:</strong> {status.login}</div>
          <div><strong>Reseñas:</strong> {status.resenas}</div>
        </div>
        
        <h3 style={{ marginTop: '20px' }}>Información de Versión</h3>
        <div style={{ lineHeight: '1.8' }}>
          <div>Fecha: {new Date().toLocaleString()}</div>
          <div>API URL: {import.meta.env.VITE_API_URL}</div>
          <div>Modo: {import.meta.env.MODE}</div>
        </div>
        
        <button 
          onClick={verificarEstado}
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Verificar Estado
        </button>
      </div>
    </div>
  );
};

export default Status;
