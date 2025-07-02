import React, { useState, useEffect } from 'react';
import './AdminOfertas.css';

const AdminOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOferta, setEditingOferta] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const [formData, setFormData] = useState({
    producto_id: '',
    nombre: '',
    descripcion: '',
    precio_original: '',
    precio_oferta: '',
    imagen: '',
    fecha_inicio: '',
    fecha_fin: '',
    categoria: 'general',
    stock_limitado: ''
  });

  useEffect(() => {
    cargarOfertas();
    cargarProductos();
  }, []);

  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ofertas/admin`);
      const data = await response.json();

      if (data.success) {
        setOfertas(data.ofertas);
      } else {
        setError('Error cargando ofertas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      const data = await response.json();

      // El endpoint de productos devuelve directamente un array
      if (Array.isArray(data)) {
        setProductos(data);
      } else if (data.success && data.productos) {
        setProductos(data.productos);
      } else {
        console.error('Error cargando productos');
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si se selecciona un producto, autocompletar campos
    if (name === 'producto_id' && value) {
      const productoSeleccionado = productos.find(p => p.id === value);
      if (productoSeleccionado) {
        setFormData(prev => ({
          ...prev,
          producto_id: value,
          nombre: `${productoSeleccionado.nombre} - Oferta Especial`,
          descripcion: productoSeleccionado.descripcion || `Oferta especial en ${productoSeleccionado.nombre}`,
          precio_original: productoSeleccionado.precio || '',
          imagen: productoSeleccionado.imagen || productoSeleccionado.image || '',
          categoria: productoSeleccionado.categoria || 'general'
        }));
        return;
      }
    }
    
    // Si se borra el producto_id, limpiar campos relacionados
    if (name === 'producto_id' && !value) {
      setFormData(prev => ({
        ...prev,
        producto_id: '',
        nombre: '',
        descripcion: '',
        precio_original: '',
        imagen: '',
        categoria: 'general'
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      producto_id: '',
      nombre: '',
      descripcion: '',
      precio_original: '',
      precio_oferta: '',
      imagen: '',
      fecha_inicio: '',
      fecha_fin: '',
      categoria: 'general',
      stock_limitado: ''
    });
    setEditingOferta(null);
  };

  const abrirModal = (oferta = null) => {
    if (oferta) {
      setEditingOferta(oferta);
      setFormData({
        producto_id: oferta.producto_id || '',
        nombre: oferta.nombre,
        descripcion: oferta.descripcion,
        precio_original: oferta.precio_original,
        precio_oferta: oferta.precio_oferta,
        imagen: oferta.imagen || '',
        fecha_inicio: oferta.fecha_inicio.split('T')[0],
        fecha_fin: oferta.fecha_fin.split('T')[0],
        categoria: oferta.categoria || 'general',
        stock_limitado: oferta.stock_limitado || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
    setMensaje('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    resetForm();
    setMensaje('');
  };

  const guardarOferta = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingOferta 
        ? `${API_URL}/ofertas/${editingOferta._id}`
        : `${API_URL}/ofertas`;
      
      const method = editingOferta ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMensaje(`✅ Oferta ${editingOferta ? 'actualizada' : 'creada'} exitosamente`);
        cargarOfertas();
        setTimeout(() => {
          cerrarModal();
        }, 1500);
      } else {
        setMensaje(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error de conexión');
    }
  };

  const toggleOferta = async (id) => {
    try {
      const response = await fetch(`${API_URL}/ofertas/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        cargarOfertas();
        // Mostrar mensaje de éxito brevemente
        setMensaje(`✅ ${data.message}`);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje(`❌ Error: ${data.error || 'Error cambiando estado de la oferta'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje(`❌ Error de conexión: ${error.message}`);
    }
  };

  const eliminarOferta = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar la oferta "${nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ofertas/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        cargarOfertas();
      } else {
        alert('Error eliminando oferta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const getEstadoBadge = (oferta) => {
    if (!oferta.activa) return <span className="badge inactiva">Inactiva</span>;
    if (oferta.vigente) return <span className="badge vigente">Vigente</span>;
    if (oferta.expirada) return <span className="badge expirada">Expirada</span>;
    if (oferta.futura) return <span className="badge futura">Futura</span>;
    return <span className="badge">Desconocido</span>;
  };

  if (loading) {
    return (
      <div className="admin-ofertas">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-ofertas">
      <div className="ofertas-header">
        <h2>🏷️ Gestión de Ofertas</h2>
        <button className="btn-nuevo" onClick={() => abrirModal()}>
          ➕ Nueva Oferta
        </button>
      </div>

      {mensaje && (
        <div className={`mensaje-global ${mensaje.includes('✅') ? 'success' : 'error'}`}>
          {mensaje}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={cargarOfertas}>Reintentar</button>
        </div>
      )}

      <div className="ofertas-tabla">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precios</th>
              <th>Descuento</th>
              <th>Vigencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.map(oferta => (
              <tr key={oferta._id}>
                <td>
                  <div className="imagen-container">
                    {oferta.imagen ? (
                      <img 
                        src={oferta.imagen.startsWith('/') ? oferta.imagen : `/${oferta.imagen}`}
                        alt={oferta.nombre}
                        className="oferta-imagen"
                      />
                    ) : (
                      <div className="sin-imagen">Sin imagen</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="oferta-info">
                    <strong>{oferta.nombre}</strong>
                    <p>{oferta.descripcion}</p>
                  </div>
                </td>
                <td>
                  <div className="precios">
                    <span className="precio-original">${oferta.precio_original.toLocaleString()}</span>
                    <span className="precio-oferta">${oferta.precio_oferta.toLocaleString()}</span>
                  </div>
                </td>
                <td>
                  <span className="descuento">{oferta.descuento_porcentaje}% OFF</span>
                </td>
                <td>
                  <div className="fechas">
                    <small>Desde: {new Date(oferta.fecha_inicio).toLocaleDateString()}</small>
                    <small>Hasta: {new Date(oferta.fecha_fin).toLocaleDateString()}</small>
                  </div>
                </td>
                <td>
                  {getEstadoBadge(oferta)}
                </td>
                <td>
                  <div className="acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => abrirModal(oferta)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className={`btn-toggle ${oferta.activa ? 'activa' : 'inactiva'}`}
                      onClick={() => toggleOferta(oferta._id)}
                      title={oferta.activa ? 'Desactivar' : 'Activar'}
                    >
                      {oferta.activa ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => eliminarOferta(oferta._id, oferta.nombre)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ofertas.length === 0 && !loading && (
          <div className="sin-ofertas">
            <p>No hay ofertas creadas</p>
            <button onClick={() => abrirModal()}>Crear primera oferta</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingOferta ? 'Editar Oferta' : 'Nueva Oferta'}</h3>
              <button className="btn-cerrar" onClick={cerrarModal}>✖️</button>
            </div>

            <form onSubmit={guardarOferta} className="oferta-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Seleccionar Producto *</label>
                  <select
                    name="producto_id"
                    value={formData.producto_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Selecciona un producto --</option>
                    {productos.map(producto => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} - ${Number(producto.precio).toLocaleString()} ({producto.categoria})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.producto_id && (
                <div className="producto-preview">
                  <div className="preview-info">
                    <div className="preview-text">
                      <strong>Producto seleccionado:</strong> {formData.nombre}
                      <small>Precio original: ${Number(formData.precio_original).toLocaleString()}</small>
                    </div>
                    {(formData.imagen || formData.image) && (
                      <img 
                        src={formData.imagen || formData.image} 
                        alt={formData.nombre}
                        className="producto-imagen-preview"
                        onError={(e) => {
                          e.target.src = '/default-product.svg';
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de la Oferta *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Tomate Cherry en Oferta"
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="verduras">Verduras</option>
                    <option value="frutas">Frutas</option>
                    <option value="organicos">Orgánicos</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe la oferta..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio Original *</label>
                  <input
                    type="number"
                    name="precio_original"
                    value={formData.precio_original}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Precio Oferta *</label>
                  <input
                    type="number"
                    name="precio_oferta"
                    value={formData.precio_oferta}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Stock Limitado</label>
                  <input
                    type="number"
                    name="stock_limitado"
                    value={formData.stock_limitado}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Imagen (URL)</label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="images/producto.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Inicio *</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin *</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {mensaje && (
                <div className={`mensaje ${mensaje.includes('✅') ? 'success' : 'error'}`}>
                  {mensaje}
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={cerrarModal} className="btn-cancelar">
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingOferta ? 'Actualizar' : 'Crear'} Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOfertas;
