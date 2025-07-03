import React from 'react';
import './TestModal.css';

const TestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const testProduct = {
    _id: "test123",
    nombre: "Producto de Prueba",
    precio: 100,
    stock: 50,
    categoria: "Frutas",
    descripcion: "Descripción de prueba",
    activo: true
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('nombre'),
      precio: parseFloat(formData.get('precio')),
      stock: parseInt(formData.get('stock')),
      categoria: formData.get('categoria'),
      descripcion: formData.get('descripcion'),
      activo: formData.has('activo')
    };

    console.log('Datos a enviar:', data);

    try {
      const response = await fetch('https://verduleria-backend-m19n.onrender.com/api/productos/test123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      
      if (result.success) {
        alert('¡Producto actualizado exitosamente!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión: ' + error.message);
    }
  };

  return (
    <div className="test-modal-overlay">
      <div className="test-modal">
        <h2>Test de Edición de Producto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input name="nombre" type="text" defaultValue={testProduct.nombre} required />
          </div>
          <div>
            <label>Precio:</label>
            <input name="precio" type="number" step="0.01" defaultValue={testProduct.precio} required />
          </div>
          <div>
            <label>Stock:</label>
            <input name="stock" type="number" defaultValue={testProduct.stock} required />
          </div>
          <div>
            <label>Categoría:</label>
            <select name="categoria" defaultValue={testProduct.categoria} required>
              <option value="">Seleccionar...</option>
              <option value="Frutas">Frutas</option>
              <option value="Verduras">Verduras</option>
              <option value="Lácteos">Lácteos</option>
              <option value="Carnes">Carnes</option>
              <option value="Panadería">Panadería</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div>
            <label>Descripción:</label>
            <textarea name="descripcion" defaultValue={testProduct.descripcion} required />
          </div>
          <div>
            <label>
              <input name="activo" type="checkbox" defaultChecked={testProduct.activo} />
              Activo
            </label>
          </div>
          <div>
            <button type="submit">Guardar Test</button>
            <button type="button" onClick={onClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestModal;
