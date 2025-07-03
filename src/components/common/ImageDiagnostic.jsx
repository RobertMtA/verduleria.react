import React, { useState, useEffect } from 'react';

const ImageDiagnostic = () => {
  const [imageTests, setImageTests] = useState([]);
  
  const testUrls = [
    'https://verduleria-backend-m19n.onrender.com/images/img-banana1.jpg',
    'https://raw.githubusercontent.com/RobertMtA/verduleria-backend/main/public/images/img-banana1.jpg',
    '/images/img-banana1.jpg',
    'https://verduleria-backend-m19n.onrender.com/api/productos'
  ];

  useEffect(() => {
    const testImages = async () => {
      const results = [];
      
      for (const url of testUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          results.push({
            url,
            status: response.status,
            ok: response.ok,
            type: response.headers.get('content-type') || 'unknown'
          });
        } catch (error) {
          results.push({
            url,
            status: 'ERROR',
            ok: false,
            error: error.message
          });
        }
      }
      
      setImageTests(results);
    };

    testImages();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(255, 255, 255, 0.95)', 
      border: '1px solid #ddd', 
      borderRadius: '6px',
      padding: '10px',
      maxWidth: '300px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      opacity: 0.8
    }}>
      <h4 style={{margin: '0 0 8px 0', color: '#666', fontSize: '13px'}}>🔍 Estado del Sistema</h4>
      {imageTests.map((test, index) => (
        <div key={index} style={{ 
          margin: '4px 0', 
          padding: '6px', 
          borderRadius: '3px',
          background: test.ok ? '#f0f8f0' : '#fdf0f0',
          border: `1px solid ${test.ok ? '#d4edda' : '#f8d7da'}`,
          fontSize: '11px'
        }}>
          <div><strong>
            {test.url.includes('github') ? '🐙' : 
             test.url.includes('api/productos') ? '🔧' : 
             test.url.includes('onrender') ? '🌐' : '📁'}
          </strong> <span style={{color: test.ok ? 'green' : 'red'}}>
              {test.status} {test.ok ? '✅' : '❌'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageDiagnostic;
