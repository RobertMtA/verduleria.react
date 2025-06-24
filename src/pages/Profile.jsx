import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <--- Asegúrate de tener esto
import './Profile.css';

// Componente para mostrar los pedidos
const PedidoItem = ({ pedido }) => (
  <li className="pedido-item">
    <div className="pedido-header">
      <strong>Pedido #{pedido.id}</strong>
      <span className={`status-badge ${pedido.estado.toLowerCase().replace(' ', '-')}`}>
        {pedido.estado}
      </span>
    </div>
    <div className="pedido-details">
      <span>Fecha: {new Date(pedido.fecha).toLocaleDateString()}</span>
      <span>Total: ${pedido.total?.toFixed(2) || '0.00'}</span>
      <span>Forma de pago: {pedido.forma_pago || 'No especificada'}</span>
    </div>
    {pedido.productos && (
      <div className="pedido-productos">
        <h4>Productos:</h4>
        <ul>
          {pedido.productos.map((producto, idx) => (
            <li key={idx}>
              {producto.nombre} - Cantidad: {producto.cantidad}
            </li>
          ))}
        </ul>
      </div>
    )}
  </li>
);

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate(); // <--- Asegúrate de tener esto
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');

  // Usa import.meta.env para Vite o una URL fija
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

  // Cargar datos del usuario
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/perfil.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar perfil');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(data.data);
        setPedidos(data.pedidos || []); // Carga los pedidos junto al perfil
        setUser(prev => ({
          ...prev,
          ...data.data
        }));
      } else {
        throw new Error(data.error || 'Error al cargar perfil');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, fetch: error.message }));
    }
  }, [API_URL, setUser]);

  // Efectos para cargar datos
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Si quieres recargar pedidos solo al cambiar de tab, descomenta esto:
  // useEffect(() => {
  //   if (activeTab === 'pedidos') {
  //     fetchProfile();
  //   }
  // }, [activeTab, fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'Nombre debe tener al menos 3 caracteres';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es requerido';
    } else if (!/^[0-9+\-\s]+$/.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono no válido';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'Dirección es requerida';
    } else if (formData.direccion.length < 10) {
      newErrors.direccion = 'Dirección demasiado corta';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: null }));

    try {
      const response = await fetch(`${API_URL}/perfil.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }
      
      setSuccessMessage('Perfil actualizado correctamente');
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Mi Cuenta</h1>
      
      <div className="profile-tabs">
        <button 
          className={activeTab === 'perfil' ? 'active' : ''}
          onClick={() => setActiveTab('perfil')}
        >
          Información Personal
        </button>
        <button 
          className={activeTab === 'pedidos' ? 'active' : ''}
          onClick={() => setActiveTab('pedidos')}
        >
          Mis Pedidos
        </button>
      </div>
      
      {/* Mensajes de estado */}
      {errors.fetch && (
        <div className="alert alert-danger">{errors.fetch}</div>
      )}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errors.submit && (
        <div className="alert alert-danger">{errors.submit}</div>
      )}

      {activeTab === 'perfil' ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
              placeholder="Ej: Juan Pérez"
              autoComplete="name"
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Ej: ejemplo@correo.com"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={errors.telefono ? 'error' : ''}
              placeholder="Ej: +34 600 123 456"
              autoComplete="tel"
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={errors.direccion ? 'error' : ''}
              placeholder="Ej: Calle Principal 123, Ciudad, CP 28001"
              rows="3"
              autoComplete="street-address"
            />
            {errors.direccion && <span className="error-message">{errors.direccion}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className={`save-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : 'Guardar cambios'}
          </button>
        </form>
      ) : (
        <div className="pedidos-section">
          <h2>Historial de Pedidos</h2>
          {errors.pedidos && (
            <div className="alert alert-warning">{errors.pedidos}</div>
          )}
          {loadingPedidos ? (
            <div className="loading-pedidos">
              <span className="spinner"></span>
              <p>Cargando tus pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="no-pedidos">
              <p>No tienes pedidos aún.</p>
              <button
                className="btn-primary"
                type="button"
                onClick={() => navigate('/productos')}
              >
                Ver productos
              </button>
            </div>
          ) : (
            <ul className="pedidos-list">
              {pedidos.map((pedido) => (
                <PedidoItem key={pedido.id} pedido={pedido} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;