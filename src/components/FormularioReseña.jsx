import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import corsProxyService from '../services/corsProxyService';
import './FormularioReseña.css';

const FormularioReseña = ({ onReseñaEnviada = null, className = "" }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    calificacion: 5,
    comentario: '',
    producto: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setMessage({
        type: 'error',
        text: 'Debes iniciar sesión para dejar una reseña'
      });
      return;
    }

    if (!formData.comentario.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor escribe un comentario'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        usuario: user.email || user.correo || 'usuario@verduleria.com',
        nombreUsuario: user.nombre || user.name || user.email || 'Usuario',
        mensaje: formData.comentario,
        calificacion: parseInt(formData.calificacion),
        producto: formData.producto || 'Producto general'
      };
      
      console.log('📤 Enviando reseña:', dataToSend);
      
      const data = await corsProxyService.enviarResenaLocal(dataToSend);
      
      console.log('📥 Respuesta del envío:', data);

      if (data.success) {
        console.log('✅ Reseña enviada exitosamente');
        setMessage({
          type: 'success',
          text: data.message || '¡Reseña enviada! Será revisada por nuestro equipo antes de publicarse.'
        });
        
        // Limpiar formulario
        setFormData({
          calificacion: 5,
          comentario: '',
          producto: ''
        });

        // Callback opcional para notificar al componente padre
        if (onReseñaEnviada) {
          onReseñaEnviada();
        }
      } else {
        console.log('❌ Error en el envío:', data);
        setMessage({
          type: 'error',
          text: data.message || 'Error al enviar la reseña'
        });
      }
    } catch (error) {
      console.error('❌ Error enviando reseña:', error);
      setMessage({
        type: 'error',
        text: 'Error de conexión. Inténtalo de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className={`star-btn ${star <= formData.calificacion ? 'active' : ''}`}
        onClick={() => setFormData(prev => ({ ...prev, calificacion: star }))}
        aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
      >
        ⭐
      </button>
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className={`formulario-reseña no-auth ${className}`}>
        <div className="auth-required">
          <h3>🌟 Deja tu Reseña</h3>
          <p>Para dejar una reseña, necesitas <a href="/login">iniciar sesión</a> o <a href="/register">registrarte</a>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`formulario-reseña ${className}`}>
      <form onSubmit={handleSubmit} className="reseña-form">
        <h3>🌟 Deja tu Reseña</h3>
        
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="calificacion">Calificación:</label>
          <div className="stars-rating">
            {renderStars()}
            <span className="rating-text">
              {formData.calificacion} de 5 estrellas
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="producto">Producto (opcional):</label>
          <input
            type="text"
            id="producto"
            name="producto"
            value={formData.producto}
            onChange={handleChange}
            placeholder="¿Qué producto te gustó más?"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comentario">Tu opinión: *</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            placeholder="Cuéntanos tu experiencia con nuestros productos y servicio..."
            required
            rows="4"
            className="form-textarea"
            maxLength="500"
          />
          <small className="char-count">
            {formData.comentario.length}/500 caracteres
          </small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary submit-btn"
          disabled={isSubmitting || !formData.comentario.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Enviando...
            </>
          ) : (
            'Enviar Reseña'
          )}
        </button>
        
        <p className="disclaimer">
          Las reseñas son revisadas por nuestro equipo antes de ser publicadas.
        </p>
      </form>
    </div>
  );
};

export default FormularioReseña;
