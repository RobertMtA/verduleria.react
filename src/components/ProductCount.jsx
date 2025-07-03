import React from 'react';
import useProducts from '../hooks/useProducts';

const ProductCount = () => {
  const { products, loading, error } = useProducts();

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      zIndex: 10000,
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      minWidth: '200px'
    }}>
      <h4 style={{margin: '0 0 10px 0', color: '#007bff'}}>🔢 Contador de Productos</h4>
      <div><strong>Total productos:</strong> {products.length}</div>
      <div><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</div>
      <div><strong>Error:</strong> {error || 'Ninguno'}</div>
      
      {products.length > 0 && (
        <div style={{marginTop: '10px', fontSize: '12px'}}>
          <div><strong>Activos:</strong> {products.filter(p => p.activo).length}</div>
          <div><strong>Inactivos:</strong> {products.filter(p => !p.activo).length}</div>
          <div style={{marginTop: '8px'}}>
            <strong>Primeros 5:</strong>
            <ul style={{margin: '4px 0', paddingLeft: '16px'}}>
              {products.slice(0, 5).map(p => (
                <li key={p.id} style={{fontSize: '11px'}}>
                  {p.nombre} - ${p.precio}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCount;
