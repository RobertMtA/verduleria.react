import React, { useState, useEffect } from 'react';
import './AdminChat.css';

const AdminChat = () => {
  const [chatsActivos, setChatsActivos] = useState([]);
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://verduleria-backend-m19n.onrender.com/api';

  // Función para formatear el estado para mostrar
  const getEstadoTexto = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'en_camino': return 'En Camino';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  // Cargar resumen de chats activos
  const cargarChatsActivos = async () => {
    try {
      console.log('🔍 Admin: Cargando chats activos...');
      const response = await fetch(`${API_URL}/chat/admin/resumen`);
      console.log('📡 Admin: Respuesta del servidor:', response.status);
      
      const data = await response.json();
      console.log('📊 Admin: Datos recibidos:', data);
      
      if (data.success) {
        console.log('✅ Admin: Chats cargados:', data.chats);
        setChatsActivos(data.chats);
      } else {
        console.log('❌ Admin: Error en la respuesta:', data.error);
      }
    } catch (error) {
      console.error('❌ Admin: Error cargando chats activos:', error);
    }
  };

  // Cargar mensajes de un chat específico
  const cargarMensajes = async (pedidoId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/${pedidoId}`);
      const data = await response.json();
      
      if (data.success) {
        const mensajesFormateados = data.messages.map(msg => ({
          id: msg._id,
          texto: msg.mensaje,
          remitente: msg.remitente,
          fecha: msg.timestamp,
          tipo: msg.tipo || 'message'
        }));
        
        setMensajes(mensajesFormateados);
        
        // Marcar mensajes como leídos
        await fetch(`${API_URL}/chat/${pedidoId}/marcar-leido`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remitente: 'admin' })
        });
        
        // Actualizar contador de no leídos
        setChatsActivos(prev => 
          prev.map(chat => 
            chat.pedidoId === pedidoId 
              ? { ...chat, mensajesNoLeidos: 0 }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensaje como admin
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !chatSeleccionado) return;

    try {
      const response = await fetch(`${API_URL}/chat/${chatSeleccionado.pedidoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: nuevoMensaje,
          remitente: 'admin',
          tipo: 'message',
          usuarioEmail: 'admin@verduleria.com'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const nuevoMensajeObj = {
          id: data.mensaje._id,
          texto: data.mensaje.mensaje,
          remitente: data.mensaje.remitente,
          fecha: data.mensaje.timestamp,
          tipo: data.mensaje.tipo
        };
        
        setMensajes(prev => [...prev, nuevoMensajeObj]);
        setNuevoMensaje('');
        
        console.log('✅ Mensaje enviado como admin');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  // Enviar actualización de estado
  const enviarActualizacionEstado = async (nuevoEstado) => {
    if (!chatSeleccionado) return;

    try {
      // Primero actualizar el estado en la base de datos
      const updateResponse = await fetch(`${API_URL}/pedidos/${chatSeleccionado.pedidoId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado })
      });

      if (!updateResponse.ok) {
        throw new Error('Error actualizando el estado del pedido');
      }

      const updateResult = await updateResponse.json();
      console.log('✅ Estado actualizado:', updateResult);

      // Luego enviar mensaje al chat para notificar
      const mensajeEstado = `📦 Estado actualizado: El pedido ahora está ${getEstadoTexto(nuevoEstado)}`;
      
      const chatResponse = await fetch(`${API_URL}/chat/${chatSeleccionado.pedidoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: mensajeEstado,
          remitente: 'system',
          tipo: 'status_update',
          usuarioEmail: 'system@verduleria.com'
        })
      });

      if (chatResponse.ok) {
        // Actualizar el estado local del chat
        setChatSeleccionado(prev => ({
          ...prev,
          estado: nuevoEstado
        }));

        // Recargar mensajes para mostrar la actualización
        cargarMensajes(chatSeleccionado.pedidoId);
        
        // Recargar chats activos para reflejar el cambio
        cargarChatsActivos();
      }
    } catch (error) {
      console.error('Error enviando actualización de estado:', error);
      alert('Error al actualizar el estado del pedido. Inténtalo nuevamente.');
    }
  };

  useEffect(() => {
    cargarChatsActivos();
    
    // Polling cada 10 segundos para actualizar chats activos
    const interval = setInterval(cargarChatsActivos, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatSeleccionado) {
      cargarMensajes(chatSeleccionado.pedidoId);
      
      // Polling cada 5 segundos para nuevos mensajes
      const interval = setInterval(() => {
        cargarMensajes(chatSeleccionado.pedidoId);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [chatSeleccionado]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>
            <i className="fas fa-comments"></i>
            Chats Activos
          </h3>
          <span className="chat-count">{chatsActivos.length}</span>
        </div>
        
        <div className="chats-list">
          {chatsActivos.length === 0 ? (
            <div className="no-chats">
              <i className="fas fa-comment-slash"></i>
              <p>No hay chats activos</p>
            </div>
          ) : (
            chatsActivos.map(chat => (
              <div 
                key={chat.pedidoId}
                className={`chat-item ${chatSeleccionado?.pedidoId === chat.pedidoId ? 'selected' : ''}`}
                onClick={() => setChatSeleccionado(chat)}
              >
                <div className="chat-item-header">
                  <div className="pedido-info">
                    <span className="pedido-numero">#{chat.numeroPedido}</span>
                    {chat.mensajesNoLeidos > 0 && (
                      <span className="unread-badge">{chat.mensajesNoLeidos}</span>
                    )}
                  </div>
                  <span className="chat-time">{formatearHora(chat.ultimaFecha)}</span>
                </div>
                
                <div className="usuario-info">
                  <strong>{chat.usuario?.nombre || 'Usuario'}</strong>
                  <span className="usuario-email">{chat.usuario?.email}</span>
                </div>
                
                <div className="ultimo-mensaje">
                  {chat.ultimoMensaje}
                </div>
                
                <div className="chat-item-footer">
                  <span className={`estado-badge ${chat.estado}`}>
                    {getEstadoTexto(chat.estado)}
                  </span>
                  <span className="total">${chat.total?.toLocaleString('es-AR')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {!chatSeleccionado ? (
          <div className="no-chat-selected">
            <i className="fas fa-comment-dots"></i>
            <h3>Selecciona un chat</h3>
            <p>Elige una conversación de la lista para comenzar a responder</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="pedido-details">
                <h3>
                  <i className="fas fa-receipt"></i>
                  Pedido #{chatSeleccionado.numeroPedido}
                </h3>
                <div className="cliente-info">
                  <span className="cliente-nombre">{chatSeleccionado.usuario?.nombre}</span>
                  <span className="cliente-email">({chatSeleccionado.usuario?.email})</span>
                </div>
                <div className="estado-actual">
                  <span>Estado actual: </span>
                  <span className={`estado-badge ${chatSeleccionado.estado}`}>
                    {getEstadoTexto(chatSeleccionado.estado)}
                  </span>
                </div>
              </div>
              
              <div className="action-buttons">
                <select 
                  onChange={(e) => enviarActualizacionEstado(e.target.value)}
                  defaultValue=""
                  className="estado-select"
                >
                  <option value="">Actualizar Estado</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="en_camino">En Camino</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="chat-messages" id="chat-messages">
              {loading ? (
                <div className="loading-messages">
                  <i className="fas fa-spinner fa-spin"></i>
                  Cargando mensajes...
                </div>
              ) : (
                mensajes.map(mensaje => (
                  <div key={mensaje.id} className={`mensaje ${mensaje.remitente}`}>
                    <div className={`mensaje-bubble ${mensaje.remitente}`}>
                      {mensaje.tipo === 'status_update' ? (
                        <div className="status-update">
                          <i className="fas fa-info-circle"></i>
                          {mensaje.texto}
                        </div>
                      ) : (
                        mensaje.texto
                      )}
                      <div className="mensaje-time">
                        {formatearHora(mensaje.fecha)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="chat-input-area">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Escribe una respuesta..."
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                  className="message-input"
                />
                <button 
                  onClick={enviarMensaje}
                  disabled={!nuevoMensaje.trim()}
                  className="send-button"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
