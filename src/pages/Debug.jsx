import React from 'react';

const Debug = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "No definida";
  const mode = import.meta.env.MODE || "No definido";
  const prod = import.meta.env.PROD;
  const dev = import.meta.env.DEV;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Información de Debug</h1>
      <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
        <h3>Variables de entorno:</h3>
        <p><strong>VITE_API_URL:</strong> {apiUrl}</p>
        <p><strong>MODE:</strong> {mode}</p>
        <p><strong>PROD:</strong> {prod ? 'true' : 'false'}</p>
        <p><strong>DEV:</strong> {dev ? 'true' : 'false'}</p>
      </div>
      
      <div style={{ backgroundColor: '#e7f3ff', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
        <h3>Test de conexión:</h3>
        <button 
          onClick={async () => {
            try {
              const response = await fetch(`${apiUrl}/productos`);
              const data = await response.json();
              console.log('Respuesta del API:', data);
              alert(`Conexión exitosa! Se obtuvieron ${data.length} productos`);
            } catch (error) {
              console.error('Error de conexión:', error);
              alert(`Error de conexión: ${error.message}`);
            }
          }}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Probar conexión al API
        </button>
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px' }}>
        <h3>URL completa que se está usando:</h3>
        <p><code>{apiUrl}/productos</code></p>
      </div>
    </div>
  );
};

export default Debug;
