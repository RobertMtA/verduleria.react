import React from 'react';

const DebugProfile = () => {
  const testProducts = [
    { nombre: 'Tomate', image: '/images/img-tomate1.jpg' },
    { nombre: 'Lechuga', image: '/images/img-lechuga1.jpg' },
    { nombre: 'Banana', image: '' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Debug - Imágenes de Productos</h2>
      {testProducts.map((producto, idx) => (
        <div key={idx} style={{ 
          margin: '20px 0', 
          padding: '15px', 
          border: '1px solid #ccc',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <img 
              src={producto.image || '/default-product.svg'}
              alt={producto.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onLoad={() => console.log('✅ Cargada:', producto.image)}
              onError={(e) => {
                console.error('❌ Error:', producto.image);
                e.target.src = '/default-product.svg';
              }}
            />
          </div>
          <div>
            <h4>{producto.nombre}</h4>
            <p>Imagen: {producto.image || 'Sin imagen'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DebugProfile;
