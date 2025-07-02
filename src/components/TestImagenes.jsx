import React from 'react';

const TestImagenes = () => {
  const imagenes = [
    '/images/img-tomate1.jpg',
    '/images/img-lechuga1.jpg',
    '/images/img-zanahoria1.jpg',
    '/default-product.svg'
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test de Imágenes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {imagenes.map((img, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h4>{img}</h4>
            <img 
              src={img}
              alt={`Test ${idx}`}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              onLoad={() => console.log('✅ Cargada:', img)}
              onError={(e) => {
                console.error('❌ Error:', img);
                e.target.style.border = '2px solid red';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestImagenes;
