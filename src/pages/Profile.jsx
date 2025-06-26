import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';
import { useAuth } from '../context/AuthContext';

const PedidoItem = ({ pedido }) => {
  if (!pedido) return null;

  const fechaFormateada = new Date(pedido.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <li className="pedido-item">
      <div className="pedido-header">
        <strong>Pedido #{pedido.id || 'N/A'}</strong>
        <span className={`status-badge ${(pedido.estado || '').toLowerCase().replace(/\s+/g, '-')}`}>
          {pedido.estado || 'Desconocido'}
        </span>
      </div>
      <div className="pedido-details">
        <span>Fecha: {fechaFormateada}</span>
        <span>Total: ${pedido.total?.toLocaleString('es-AR') || '0,00'}</span>
        <span>Forma de pago: {pedido.forma_pago || pedido.metodo_pago || 'No especificada'}</span>
      </div>
      {pedido.productos && (
        <div className="pedido-productos">
          <h4>Productos:</h4>
          <ul>
            {pedido.productos.map((producto, idx) => (
              <li key={`prod-${pedido.id}-${idx}`}>
                {producto.nombre || 'Producto'} - 
                Cantidad: {producto.cantidad || 0} - 
                Precio: ${Number(producto.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0,00'} - 
                Subtotal: ${(Number(producto.cantidad || 0) * Number(producto.precio || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/perfil.php?user_id=${userId}`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || `Respuesta no válida del servidor (${response.status})`);
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.error || 'Datos de perfil no recibidos');
      }

      if (!data.data || typeof data.data !== 'object') {
        throw new Error('Estructura de datos incorrecta');
      }

      setProfileData({
        userInfo: {
          nombre: data.data.nombre || '',
          email: data.data.email || '',
          telefono: data.data.telefono || '',
          direccion: data.data.direccion || '',
          role: data.data.role || 'user'
        },
        orders: Array.isArray(data.pedidos) ? data.pedidos : []
      });
    } catch (err) {
      setError(err.message);

      if (err.message.includes('403')) {
        navigate('/unauthorized');
      } else if (err.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, userId, navigate]);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [fetchProfile, navigate, userId]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/perfil.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ...updatedData
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || `Respuesta no válida del servidor (${response.status})`);
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>Error al cargar el perfil: {error}</p>
        <button onClick={fetchProfile}>Reintentar</button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-empty">
        <p>No se encontraron datos del perfil</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>
      
      {successMessage && (
        <div className="profile-success">
          {successMessage}
        </div>
      )}

      <div className="profile-tabs">
        <button
          type="button"
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
          disabled={loading}
        >
          Información Personal
        </button>
        <button
          type="button"
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
          disabled={loading}
        >
          Mis Pedidos ({profileData.orders.length})
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' ? (
          isEditing ? (
            <ProfileEditForm 
              initialData={profileData.userInfo}
              onSave={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          ) : (
            <ProfileView 
              data={profileData.userInfo}
              onEdit={() => setIsEditing(true)}
            />
          )
        ) : (
          <OrdersList orders={profileData.orders} loading={loading} />
        )}
      </div>
    </div>
  );
};

const ProfileView = ({ data, onEdit }) => (
  <div className="profile-view">
    <div className="profile-field">
      <span className="label">Nombre:</span>
      <span className="value">{data.nombre || 'No especificado'}</span>
    </div>
    <div className="profile-field">
      <span className="label">Email:</span>
      <span className="value">{data.email || 'No especificado'}</span>
    </div>
    <div className="profile-field">
      <span className="label">Teléfono:</span>
      <span className="value">{data.telefono || 'No especificado'}</span>
    </div>
    <div className="profile-field">
      <span className="label">Dirección:</span>
      <span className="value">{data.direccion || 'No especificada'}</span>
    </div>
    <button className="edit-button" onClick={onEdit}>
      Editar Perfil
    </button>
  </div>
);

const ProfileEditForm = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    const validations = {
      nombre: { required: true, pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/, message: 'Nombre inválido' },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
      telefono: { required: true, pattern: /^[0-9\s+-]{8,15}$/, message: 'Teléfono inválido' },
      direccion: { required: true, minLength: 5, message: 'Mínimo 5 caracteres' }
    };

    Object.entries(validations).forEach(([field, { required, pattern, minLength, message }]) => {
      const value = formData[field]?.trim() || '';
      if (required && !value) {
        newErrors[field] = 'Campo requerido';
      } else if (pattern && !pattern.test(value)) {
        newErrors[field] = message;
      } else if (minLength && value.length < minLength) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form className="profile-edit-form" onSubmit={handleSubmit}>
      <div className={`form-group ${errors.nombre ? 'error' : ''}`}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
      </div>
      
      <div className={`form-group ${errors.email ? 'error' : ''}`}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className={`form-group ${errors.telefono ? 'error' : ''}`}>
        <label>Teléfono:</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
        {errors.telefono && <span className="error-message">{errors.telefono}</span>}
      </div>
      
      <div className={`form-group ${errors.direccion ? 'error' : ''}`}>
        <label>Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
        />
        {errors.direccion && <span className="error-message">{errors.direccion}</span>}
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

const OrdersList = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="no-orders">
        <p>No tienes pedidos aún.</p>
        <Link to="/productos" className="btn-primary">
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <ul className="orders-list">
      {orders.map(order => (
        <PedidoItem key={`order-${order.id}`} pedido={order} />
      ))}
    </ul>
  );
};

export default Profile;