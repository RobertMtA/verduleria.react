import React, { useState } from 'react';
import './FormularioNuevoUsuario.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormularioNuevoUsuario = ({ onClose, onUserAdded, user, usuarios = [] }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'usuario'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [filtro, setFiltro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.nombre) {
      isValid = false;
      formErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email) {
      isValid = false;
      formErrors.email = "El email es requerido";
    }

    if (!formData.password) {
      isValid = false;
      formErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      isValid = false;
      formErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      isValid = false;
      formErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Aquí deberías hacer el fetch al backend para agregar el usuario
        const res = await fetch('http://localhost/api/usuarios_admin.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          onUserAdded(); // Solo aquí cierras el modal o actualizas la lista
        } else {
          setErrors({ submit: data.error || 'Error al agregar usuario' });
        }
      } catch (err) {
        setErrors({ submit: 'Error de red' });
      }
      setIsSubmitting(false);
    }
  };

  const filteredUsuarios = usuarios.filter(u => u.nombre && u.nombre.includes(filtro));

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Agregar nuevo usuario</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="user-form">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              autoComplete="name"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
              required
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              autoComplete="off"
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar usuario"}
            </button>
          </div>
        </form>
        
        <div className="usuarios-lista">
          <h3>Usuarios existentes</h3>
          <input
            type="text"
            id="filtro"
            name="filtro"
            placeholder="Filtrar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
          <ul>
            {filteredUsuarios.map((u, index) => (
              <li key={index}>{u.nombre} - {u.email} ({u.rol})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormularioNuevoUsuario;