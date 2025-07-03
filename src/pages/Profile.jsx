import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import SeguimientoEntrega from './SeguimientoEntrega';
import corsProxyService from '../services/corsProxyService.js';

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const PedidoItem = ({ pedido, onEstadoActualizado }) => {
  if (!pedido) return null;

  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [error, setError] = useState('');

  const actualizarEstado = async (nuevoEstado) => {
    setActualizandoEstado(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pedidos/${pedido._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del pedido');
      }

      const resultado = await response.json();
      
      if (resultado.success) {
        // Notificar al componente padre para refrescar la lista
        if (onEstadoActualizado) {
          onEstadoActualizado();
        }
      } else {
        setError(resultado.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      setError('Error al actualizar el estado del pedido');
    } finally {
      setActualizandoEstado(false);
    }
  };

  const puedeActualizarEstado = (estado) => {
    // El usuario puede realizar ciertas acciones según el estado actual
    switch (estado?.toLowerCase()) {
      case 'en_proceso':
        return ['entregado']; // Puede confirmar que recibió el pedido
      case 'pendiente':
        return ['cancelado']; // Puede cancelar si aún está pendiente
      default:
        return []; // No puede cambiar estados finales
    }
  };

  const getTextoAccion = (nuevoEstado) => {
    switch (nuevoEstado) {
      case 'entregado':
        return 'Confirmar Recepción';
      case 'cancelado':
        return 'Cancelar Pedido';
      default:
        return 'Actualizar';
    }
  };

  const getIconoAccion = (nuevoEstado) => {
    switch (nuevoEstado) {
      case 'entregado':
        return 'fas fa-check-circle';
      case 'cancelado':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-edit';
    }
  };

  const getColorAccion = (nuevoEstado) => {
    switch (nuevoEstado) {
      case 'entregado':
        return '#4caf50';
      case 'cancelado':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  // Función para descargar comprobante PDF
  const descargarComprobante = async (pedidoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/comprobante`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar el comprobante');
      }

      // Obtener el blob del PDF
      const blob = await response.blob();
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprobante-pedido-${pedidoId.slice(-8)}.pdf`;
      
      // Ejecutar descarga
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Comprobante descargado exitosamente');
      
    } catch (error) {
      console.error('❌ Error descargando comprobante:', error);
      setError('Error al descargar el comprobante. Inténtalo nuevamente.');
    }
  };

  // DEBUG: Mostrar información completa del pedido
  // console.log(`📦 PEDIDO COMPLETO:`, {
  //   id: pedido._id,
  //   usuario: pedido.usuario,
  //   productos: pedido.productos?.length || 0,
  //   total: pedido.total,
  //   estado: pedido.estado,
  //   fecha: pedido.fecha_pedido
  // });

  const fechaFormateada = new Date(pedido.fecha_pedido || pedido.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return '#ff9800';
      case 'en_proceso': return '#2196f3';
      case 'en_camino': return '#9c27b0';
      case 'entregado': return '#4caf50';
      case 'cancelado': return '#f44336';
      default: return '#757575';
    }
  };

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

  return (
    <div className="pedido-card">
      <div className="pedido-card-header">
        <div className="pedido-info">
          <h3 className="pedido-numero">
            <i className="fas fa-receipt"></i>
            Pedido #{(pedido._id || pedido.id || 'N/A').slice(-8)}
          </h3>
          <p className="pedido-fecha">
            <i className="far fa-calendar-alt"></i>
            {fechaFormateada}
          </p>
          {/* Mostrar información del usuario que hizo el pedido */}
          {pedido.usuario && (
            <p className="pedido-usuario">
              <i className="fas fa-user"></i>
              Cliente: <strong>{pedido.usuario.nombre || 'No especificado'}</strong>
              {pedido.usuario.email && (
                <span className="usuario-email"> ({pedido.usuario.email})</span>
              )}
            </p>
          )}
        </div>
        <div className="pedido-estado">
          <span 
            className="estado-badge" 
            style={{ backgroundColor: getEstadoColor(pedido.estado) }}
          >
            {getEstadoTexto(pedido.estado)}
          </span>
        </div>
      </div>

      <div className="pedido-card-body">
        <div className="pedido-resumen">
          <div className="resumen-grid">
            <div className="resumen-item">
              <div className="resumen-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="resumen-info">
                <span className="resumen-label">Total</span>
                <span className="resumen-valor">${Number(pedido.total).toLocaleString('es-AR')}</span>
              </div>
            </div>
            <div className="resumen-item">
              <div className="resumen-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="resumen-info">
                <span className="resumen-label">Pago</span>
                <span className="resumen-valor">{pedido.metodo_pago || 'No especificado'}</span>
              </div>
            </div>
            <div className="resumen-item">
              <div className="resumen-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="resumen-info">
                <span className="resumen-label">Productos</span>
                <span className="resumen-valor">{pedido.productos?.length || 0} items</span>
              </div>
            </div>
            {/* Información adicional del usuario */}
            {pedido.usuario && (
              <div className="resumen-item">
                <div className="resumen-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="resumen-info">
                  <span className="resumen-label">Dirección</span>
                  <span className="resumen-valor" title={pedido.usuario.direccion}>
                    {pedido.usuario.direccion?.length > 30 
                      ? `${pedido.usuario.direccion.substring(0, 30)}...` 
                      : pedido.usuario.direccion || 'No especificada'
                    }
                  </span>
                </div>
              </div>
            )}
            {pedido.usuario?.telefono && (
              <div className="resumen-item resumen-item-telefono">
                <div className="resumen-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="resumen-info">
                  <span className="resumen-label">Teléfono</span>
                  <span className="resumen-valor telefono-completo">{pedido.usuario.telefono}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="productos-section">
          <h4 className="productos-titulo">
            <i className="fas fa-list"></i>
            Productos del Pedido
          </h4>
          <div className="productos-lista">
            {pedido.productos?.map((producto, idx) => {
              // DEBUG: Mostrar estructura del producto
              // console.log(`🔍 PRODUCTO ${idx + 1} - ${producto.nombre}:`, {
              //   campos_imagen: {
              //     image: producto.image,
              //     imagen: producto.imagen,
              //     foto: producto.foto,
              //     imagePath: producto.imagePath,
              //     img: producto.img
              //   },
              //   todas_propiedades: Object.keys(producto)
              // });
              
              // Función mejorada para obtener la imagen del producto
              const getImageSrc = () => {
                // Campos posibles donde puede estar la imagen
                const imageFields = [
                  producto.image,
                  producto.imagen,
                  producto.foto,
                  producto.imagePath,
                  producto.img,
                  producto.src,
                  producto.imageUrl
                ];

                // Buscar el primer campo de imagen válido
                for (const field of imageFields) {
                  if (field && typeof field === 'string' && field.trim() !== '') {
                    // console.log(`✅ Campo válido encontrado para ${producto.nombre}:`, field);
                    
                    // Si ya incluye el protocolo http, usar tal como está
                    if (field.startsWith('http')) {
                      return field;
                    }
                    
                    // Si ya incluye /images/, usar tal como está
                    if (field.startsWith('/images/')) {
                      return `http://localhost:4001${field}`;
                    }
                    
                    // Si no empieza con /, agregar /images/
                    if (!field.startsWith('/')) {
                      return `http://localhost:4001/images/${field}`;
                    }
                    
                    // Para cualquier otro caso con /
                    return `http://localhost:4001${field}`;
                  }
                }
                
                // Si no se encontró imagen, intentar buscar por nombre del producto
                console.log(`🔍 Intentando buscar imagen por nombre para: ${producto.nombre}`);
                const nombreLimpio = producto.nombre?.toLowerCase().trim();
                
                if (nombreLimpio) {
                  // Mapeo de nombres de productos a archivos de imagen
                  const imageMap = {
                    // Verduras
                    'espinaca': 'img-espinaca1.jpg',
                    'tomate': 'img-tomate1.jpg',
                    'tomates': 'img-tomate1.jpg',
                    'lechuga': 'img-lechuga1.jpg',
                    'papa': 'img-papa1.jpg',
                    'papas': 'img-papa1.jpg',
                    'cebolla': 'img-cebollas1.jpg',
                    'cebollas': 'img-cebollas1.jpg',
                    'zanahoria': 'img-zanahoria1.jpg',
                    'zanahorias': 'img-zanahoria1.jpg',
                    'zapallo': 'img-zapallo-verde1.jpg',
                    'zapallo verde': 'img-zapallo-verde1.jpg',
                    'morron': 'img-morron-rojo1.jpg',
                    'morrón': 'img-morron-rojo1.jpg',
                    'morron rojo': 'img-morron-rojo1.jpg',
                    'morrón rojo': 'img-morron-rojo1.jpg',
                    'pimiento': 'img-morron-rojo1.jpg',
                    'perejil': 'img-perejil1.jpg',
                    
                    // Frutas
                    'banana': 'img-banana1.jpg',
                    'bananas': 'img-banana1.jpg',
                    'manzana': 'img-manzana1.jpg',
                    'manzanas': 'img-manzana1.jpg',
                    'manzanas rojas': 'img-manzana1.jpg',
                    'manzana roja': 'img-manzana1.jpg',
                    'pera': 'img-pera1.jpg',
                    'peras': 'img-pera1.jpg',
                    'naranja': 'img-naranja1.jpg',
                    'naranjas': 'img-naranja1.jpg'
                  };
                  
                  // Buscar coincidencia exacta
                  if (imageMap[nombreLimpio]) {
                    const imageUrl = `http://localhost:4001/images/${imageMap[nombreLimpio]}`;
                    console.log(`🎯 Imagen encontrada por nombre exacto: ${imageUrl}`);
                    return imageUrl;
                  }
                  
                  // Buscar coincidencia parcial (nombre del producto contiene una palabra clave)
                  for (const [key, value] of Object.entries(imageMap)) {
                    if (nombreLimpio.includes(key)) {
                      const imageUrl = `http://localhost:4001/images/${value}`;
                      console.log(`🎯 Imagen encontrada por coincidencia parcial (${nombreLimpio} contiene "${key}"): ${imageUrl}`);
                      return imageUrl;
                    }
                  }
                  
                  // Buscar coincidencia inversa (palabra clave contiene el nombre del producto)
                  for (const [key, value] of Object.entries(imageMap)) {
                    if (key.includes(nombreLimpio) && nombreLimpio.length > 3) {
                      const imageUrl = `http://localhost:4001/images/${value}`;
                      console.log(`🎯 Imagen encontrada por coincidencia inversa ("${key}" contiene ${nombreLimpio}): ${imageUrl}`);
                      return imageUrl;
                    }
                  }
                }
                
                console.log(`❌ No se encontró imagen para ${producto.nombre}, usando default`);
                return '/images/default-product.svg';
              };

              const imageSrc = getImageSrc();
              // console.log(`🖼️ URL FINAL para ${producto.nombre}:`, imageSrc);

              return (
                <div key={`prod-${pedido._id || pedido.id}-${idx}`} className="producto-item">
                  <div className="producto-imagen">
                    <img 
                      src={imageSrc}
                      alt={producto.nombre || 'Producto'}
                      onLoad={(e) => {
                        console.log('✅ Imagen cargada correctamente:', e.target.src);
                        console.log('📐 Dimensiones:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                      }}
                      onError={(e) => {
                        console.error('❌ Error cargando imagen:', e.target.src);
                        console.log('🔄 Intentando con imagen por defecto');
                        
                        // Intentar con default-product.svg si no es la primera vez
                        if (!e.target.src.includes('default-product.svg')) {
                          e.target.src = '/images/default-product.svg';
                        } else {
                          // Si también falla el default, mostrar un placeholder
                          console.log('💔 También falló la imagen por defecto');
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div style="
                              width: 80px; 
                              height: 80px; 
                              background: #f0f0f0; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              border-radius: 8px;
                              color: #999;
                              font-size: 12px;
                              text-align: center;
                            ">
                              Sin<br>Imagen
                            </div>
                          `;
                        }
                      }}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                  <div className="producto-detalles">
                    <h5 className="producto-nombre">{producto.nombre || 'Producto'}</h5>
                    <div className="producto-specs">
                      <div className="spec-item">
                        <span className="spec-label">Cantidad:</span>
                        <span className="spec-value">{producto.cantidad || 0}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Precio:</span>
                        <span className="spec-value precio">${Number(producto.precio).toLocaleString('es-AR')}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Subtotal:</span>
                        <span className="spec-value subtotal">
                          ${Number(producto.subtotal || (producto.cantidad * producto.precio)).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pedido-actions">
        <Link to="/productos" className="btn-recomprar">
          <i className="fas fa-redo"></i>
          Volver a Comprar
        </Link>
        
        {/* Botón para descargar comprobante (solo si no está cancelado) */}
        {pedido.estado !== 'cancelado' && (
          <button 
            className="btn-comprobante"
            onClick={() => descargarComprobante(pedido._id || pedido.id)}
            title="Descargar comprobante de pago"
          >
            <i className="fas fa-download"></i>
            Descargar Comprobante
          </button>
        )}
        
        {/* Botones para actualizar estado del pedido */}
        {puedeActualizarEstado(pedido.estado).length > 0 && (
          <div className="estado-actions">
            {puedeActualizarEstado(pedido.estado).map(nuevoEstado => (
              <button
                key={nuevoEstado}
                className={`btn-estado btn-estado-${nuevoEstado}`}
                onClick={() => actualizarEstado(nuevoEstado)}
                disabled={actualizandoEstado}
                style={{ backgroundColor: getColorAccion(nuevoEstado) }}
                title={`${getTextoAccion(nuevoEstado)} - Cambiar estado a ${getEstadoTexto(nuevoEstado)}`}
              >
                <i className={getIconoAccion(nuevoEstado)}></i>
                {actualizandoEstado ? 'Procesando...' : getTextoAccion(nuevoEstado)}
              </button>
            ))}
          </div>
        )}
        
        {/* Mostrar mensaje de error si hay alguno */}
        {error && (
          <div className="error-estado">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
      </div>

      {/* Sistema de Chat para seguimiento del pedido */}
      <ChatPedido pedidoId={pedido._id || pedido.id} estadoPedido={pedido.estado} />
    </div>
  );
};

// Componente de Chat para seguimiento de pedidos
const ChatPedido = ({ pedidoId, estadoPedido }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  // Verificar si el chat debe estar activo
  // Verificar si el chat debe estar activo
  const isChatActive = () => {
    const estado = estadoPedido?.toLowerCase();
    return estado !== 'entregado' && estado !== 'cancelado';
  };

  // Verificar si el usuario puede enviar mensajes
  const canSendMessages = () => {
    return isChatActive();
  };

  // Cargar mensajes del chat cuando se abre
  const cargarMensajes = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/chat/${pedidoId}`);
      const data = await response.json();
      
      if (data.success) {
        const mensajesFormateados = data.messages.map(msg => ({
          id: msg._id,
          text: msg.mensaje,
          sender: msg.remitente,
          time: msg.timestamp,
          tipo: msg.tipo || 'message'
        }));
        
        setMessages(mensajesFormateados);
        
        // Marcar mensajes como leídos
        await fetch(`${API_URL}/chat/${pedidoId}/marcar-leido`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remitente: 'user' })
        });
      } else {
        // Si hay error, cargar mensajes por defecto
        setMessages(getStatusMessages());
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      // Si hay error, cargar mensajes por defecto
      setMessages(getStatusMessages());
    } finally {
      setLoading(false);
    }
  }, [pedidoId, API_URL]); // Dependencias específicas

  // Mensajes iniciales automáticos basados en el estado (fallback)
  const getStatusMessages = () => {
    const baseMessages = [];
    const now = new Date();
    
    switch (estadoPedido?.toLowerCase()) {
      case 'pendiente':
        baseMessages.push({
          id: 'status-1',
          text: '¡Hola! Tu pedido ha sido recibido y está siendo procesado. Te mantendremos informado sobre el progreso.',
          sender: 'admin',
          time: new Date(now.getTime() - 5 * 60000).toISOString()
        });
        break;
      case 'en_proceso':
        baseMessages.push(
          {
            id: 'status-1',
            text: 'Tu pedido está siendo preparado por nuestro equipo.',
            sender: 'admin',
            time: new Date(now.getTime() - 10 * 60000).toISOString()
          },
          {
            id: 'status-2',
            text: '📦 Actualizando estado: Tu pedido está EN PROCESO',
            sender: 'system',
            time: new Date(now.getTime() - 2 * 60000).toISOString()
          }
        );
        break;
      case 'en_camino':
        baseMessages.push(
          {
            id: 'status-1',
            text: '🚚 ¡Tu pedido está en camino! Nuestro repartidor se dirige hacia tu dirección.',
            sender: 'admin',
            time: new Date(now.getTime() - 15 * 60000).toISOString()
          },
          {
            id: 'status-2',
            text: '📍 Actualizando estado: Tu pedido está EN CAMINO',
            sender: 'system',
            time: new Date(now.getTime() - 2 * 60000).toISOString()
          }
        );
        break;
      case 'entregado':
        baseMessages.push(
          {
            id: 'status-1',
            text: '✅ ¡Excelente! Tu pedido ha sido entregado exitosamente.',
            sender: 'admin',
            time: new Date(now.getTime() - 30 * 60000).toISOString()
          },
          {
            id: 'status-2',
            text: '¿Cómo estuvo todo? ¡Nos encantaría conocer tu experiencia!',
            sender: 'admin',
            time: new Date(now.getTime() - 25 * 60000).toISOString()
          }
        );
        break;
      case 'cancelado':
        baseMessages.push({
          id: 'status-1',
          text: 'Lamentamos informarte que tu pedido ha sido cancelado. Si tienes preguntas, no dudes en escribirnos.',
          sender: 'admin',
          time: new Date(now.getTime() - 15 * 60000).toISOString()
        });
        break;
      default:
        baseMessages.push({
          id: 'status-1',
          text: 'Hola, estamos aquí para ayudarte con cualquier pregunta sobre tu pedido.',
          sender: 'admin',
          time: new Date(now.getTime() - 5 * 60000).toISOString()
        });
    }
    
    return baseMessages;
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      cargarMensajes();
    }
  }, [isOpen, cargarMensajes]); // Usar la función memoizada

  // Polling para verificar nuevos mensajes cada 10 segundos (menos agresivo)
  useEffect(() => {
    let interval;
    if (isOpen && !loading) { // Solo si no está cargando
      interval = setInterval(() => {
        cargarMensajes();
      }, 10000); // Cambiar a 10 segundos
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, loading, cargarMensajes]); // Usar la función memoizada

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Verificar si se pueden enviar mensajes
    if (!canSendMessages()) {
      console.log('Chat deshabilitado para pedidos finalizados');
      return;
    }

    console.log(`💬 Enviando mensaje: "${newMessage}" para pedido: ${pedidoId}`);

    try {
      setLoading(true);
      
      // Agregar mensaje temporalmente a la UI
      const tempMessage = {
        id: 'temp-' + Date.now(),
        text: newMessage,
        sender: 'user',
        time: new Date().toISOString()
      };
      
      console.log(`📝 Mensaje temporal creado:`, tempMessage);
      setMessages(prev => [...prev, tempMessage]);
      const mensajeEnviado = newMessage;
      setNewMessage('');

      // Enviar mensaje al servidor
      const requestBody = {
        mensaje: mensajeEnviado,
        remitente: 'user',
        tipo: 'message',
        usuarioEmail: user?.email
      };
      
      console.log(`📡 Enviando al servidor:`, requestBody);
      
      const response = await fetch(`${API_URL}/chat/${pedidoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log(`📊 Respuesta del servidor:`, response.status);
      const data = await response.json();
      console.log(`📋 Datos de respuesta:`, data);
      
      if (data.success) {
        // Reemplazar mensaje temporal con el real
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? {
                  id: data.mensaje._id,
                  text: data.mensaje.mensaje,
                  sender: data.mensaje.remitente,
                  time: data.mensaje.timestamp
                }
              : msg
          )
        );
        
        console.log('✅ Mensaje enviado correctamente');
      } else {
        console.error('Error enviando mensaje:', data.error);
        // Remover mensaje temporal si hay error
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      }
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      // Remover mensaje temporal si hay error
      setMessages(prev => prev.filter(msg => msg.id.startsWith('temp-')));
    } finally {
      setLoading(false);
    }
  };

  const getAdminResponse = (userText) => {
    const text = userText.toLowerCase();
    
    if (text.includes('estado') || text.includes('como va')) {
      return `Tu pedido #${pedidoId?.slice(-8)} está actualmente en estado: ${getEstadoTexto(estadoPedido)}. Te notificaremos de cualquier cambio.`;
    }
    
    if (text.includes('cuando') || text.includes('tiempo') || text.includes('demora')) {
      return 'Normalmente nuestros pedidos se procesan en 24-48 horas. Te mantendremos informado sobre el progreso.';
    }
    
    if (text.includes('cancelar')) {
      return 'Para cancelar tu pedido, por favor contáctanos al +54 11 1234-5678 o envíanos un email a soporte@verduleria.com';
    }
    
    if (text.includes('gracias') || text.includes('perfecto')) {
      return '¡De nada! Estamos aquí para ayudarte. ¡Esperamos que disfrutes tus productos frescos!';
    }
    
    return 'Gracias por tu mensaje. Un administrador revisará tu consulta y te responderá pronto. ¿Hay algo específico en lo que pueda ayudarte?';
  };

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

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <div className="chat-toggle">
        <button 
          className={`chat-open-btn ${!canSendMessages() ? 'chat-closed' : ''}`}
          onClick={() => setIsOpen(true)}
          style={{
            background: canSendMessages() ? '#4caf50' : '#999',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '10px 0'
          }}
        >
          <i className={canSendMessages() ? "fas fa-comments" : "fas fa-archive"}></i>
          {canSendMessages() ? 'Chat de seguimiento' : 'Ver historial de chat'}
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <i className={canSendMessages() ? "fas fa-headset" : "fas fa-archive"}></i>
        {canSendMessages() 
          ? `Seguimiento del Pedido #${pedidoId?.slice(-8)}`
          : `Historial del Pedido #${pedidoId?.slice(-8)} (${estadoPedido})`
        }
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            marginLeft: 'auto',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`chat-message ${message.sender}`}>
            <div className={`message-bubble ${message.sender}`}>
              {message.sender === 'system' && (
                <div className="order-status-update">
                  <i className="fas fa-info-circle status-icon"></i>
                  {message.text}
                </div>
              )}
              {message.sender !== 'system' && message.text}
              <div className={`message-time ${message.sender}`}>
                {formatTime(message.time)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-typing">
            <i className="fas fa-ellipsis-h"></i> El equipo está escribiendo...
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        {canSendMessages() ? (
          <>
            <input
              type="text"
              className="chat-input"
              placeholder="Escribe tu pregunta sobre el pedido..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <button 
              className="chat-send-btn"
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </>
        ) : (
          <div className="chat-disabled-message">
            <i className="fas fa-info-circle"></i>
            {estadoPedido?.toLowerCase() === 'entregado' 
              ? 'Este pedido ha sido entregado. El chat se ha cerrado.'
              : 'Este pedido ha sido cancelado. El chat se ha cerrado.'}
          </div>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
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

      // console.log('Usuario:', user);
      const userEmail = user?.email;
      
      if (!userEmail) {
        throw new Error('No se encontró el email del usuario');
      }

      // Usar datos mock temporalmente ya que el endpoint /perfil no existe en el backend
      console.log('⚠️ Usando datos temporales para perfil - endpoint /perfil no disponible');
      
      // Simular datos del perfil basados en el usuario autenticado
      const mockProfileData = {
        success: true,
        data: {
          nombre: user.name || user.email?.split('@')[0] || 'Usuario',
          email: user.email,
          telefono: user.telefono || '',
          direccion: user.direccion || '',
          role: user.role || 'user'
        },
        pedidos: [] // Los pedidos se cargan por separado
      };

      setProfileData({
        userInfo: {
          nombre: mockProfileData.data.nombre,
          email: mockProfileData.data.email,
          telefono: mockProfileData.data.telefono,
          direccion: mockProfileData.data.direccion,
          role: mockProfileData.data.role
        },
        orders: Array.isArray(mockProfileData.pedidos) ? mockProfileData.pedidos : []
      });

      console.log('✅ Perfil cargado con datos temporales');

    } catch (err) {
      setError(err.message);

      // Solo redirigir si es un error de autenticación inicial, no durante la actualización
      if (err.message.includes('403') && !loading) {
        navigate('/unauthorized');
      } else if (err.message.includes('401') && !loading) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.email, API_URL, navigate]);

  // Función para recargar los pedidos cuando se actualice un estado
  const handleEstadoActualizado = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!user?.email) {
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [fetchProfile, navigate, user]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(''); // Limpiar mensajes previos

      const userEmail = user?.email;
      if (!userEmail) {
        throw new Error('No se encontró el email del usuario');
      }

      console.log('⚠️ Actualización de perfil temporal - endpoint no disponible');
      console.log('Datos a actualizar:', updatedData);

      // Simular actualización exitosa y actualizar estado local
      setTimeout(() => {
        setSuccessMessage('✅ Perfil actualizado correctamente (modo temporal)');
        setIsEditing(false);
        
        // Actualizar el estado local con los nuevos datos
        setProfileData(prevData => {
          console.log('Datos anteriores:', prevData.userInfo);
          const newData = {
            ...prevData,
            userInfo: {
              ...prevData.userInfo,
              nombre: updatedData.nombre || '',
              telefono: updatedData.telefono || '',
              direccion: updatedData.direccion || ''
            }
          };
          console.log('Nuevos datos:', newData.userInfo);
          return newData;
        });

        // Limpiar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        
        setLoading(false);
      }, 500); // Simular latencia de red

    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(`❌ ${err.message}`);
      setLoading(false);
      
      // NO redirigir en caso de error de actualización de perfil
      // Solo mostrar el error al usuario
      
      // Limpiar el mensaje de error después de 10 segundos
      setTimeout(() => {
        setError('');
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  // Detectar la URL y activar el tab correspondiente
  useEffect(() => {
    const path = location.pathname;
    const state = location.state;
    
    if (state?.tab) {
      setActiveTab(state.tab);
    } else if (path.includes('/seguimiento')) {
      setActiveTab('seguimiento');
    } else if (path.includes('/pedidos')) {
      setActiveTab('orders');
    } else {
      setActiveTab('profile');
    }
  }, [location.pathname, location.state]);

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
      <div className="profile-container">
        <h1>Mi Perfil</h1>
        <div className="profile-error">
          <p>Error al cargar el perfil: {error}</p>
          <button onClick={fetchProfile}>🔄 Reintentar</button>
        </div>
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
      
      {/* Mensajes de éxito y error */}
      {successMessage && (
        <div className="profile-success">
          {successMessage}
        </div>
      )}
      
      {error && !loading && (
        <div className="profile-warning">
          {error}
          <button 
            type="button" 
            className="close-message-btn" 
            onClick={() => setError('')}
            title="Cerrar mensaje"
          >
            ✕
          </button>
        </div>
      )}

      <div className="profile-tabs">
        <button
          type="button"
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => {
            setActiveTab('profile');
            navigate('/perfil');
          }}
          disabled={loading}
        >
          Información Personal
        </button>
        <button
          type="button"
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => {
            setActiveTab('orders');
            navigate('/perfil/pedidos');
          }}
          disabled={loading}
        >
          Mis Pedidos ({profileData.orders.length})
        </button>
        <button
          type="button"
          className={activeTab === 'seguimiento' ? 'active' : ''}
          onClick={() => {
            setActiveTab('seguimiento');
            navigate('/perfil/seguimiento');
          }}
          disabled={loading}
        >
          🚚 Seguimiento
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
        ) : activeTab === 'orders' ? (
          <OrdersList 
            orders={profileData.orders} 
            loading={loading} 
            onEstadoActualizado={handleEstadoActualizado}
          />
        ) : activeTab === 'seguimiento' ? (
          <div className="seguimiento-container">
            <SeguimientoEntrega />
          </div>
        ) : null}
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
      nombre: { required: true, pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/, message: 'Nombre inválido (2-50 caracteres, solo letras)' },
      telefono: { required: true, pattern: /^[0-9\s+-]{8,15}$/, message: 'Teléfono inválido (8-15 dígitos)' },
      direccion: { required: true, minLength: 5, message: 'Dirección inválida (mínimo 5 caracteres)' }
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
      
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          disabled
          style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
        />
        <small style={{ color: '#666', fontSize: '0.8rem' }}>
          El email no se puede cambiar
        </small>
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

const OrdersList = ({ orders, loading, onEstadoActualizado }) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

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
        <div className="no-orders-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <h3>No tienes pedidos aún</h3>
        <p>¡Comienza a comprar los productos más frescos!</p>
        <Link to="/productos" className="btn-primary">
          <i className="fas fa-leaf"></i>
          Ver Productos
        </Link>
      </div>
    );
  }

  // Ordenar pedidos por fecha (más reciente primero)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.fecha_pedido || b.fecha) - new Date(a.fecha_pedido || a.fecha)
  );

  const currentOrder = sortedOrders[currentOrderIndex];

  return (
    <div className="orders-section">
      <div className="orders-header">
        <h2>Mis Pedidos</h2>
        <div className="orders-navigation">
          {sortedOrders.length > 1 && (
            <div className="order-selector">
              <button 
                className="nav-btn prev-btn"
                onClick={() => setCurrentOrderIndex(prev => 
                  prev > 0 ? prev - 1 : sortedOrders.length - 1
                )}
                disabled={sortedOrders.length <= 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <span className="order-counter">
                {currentOrderIndex + 1} de {sortedOrders.length}
              </span>
              
              <button 
                className="nav-btn next-btn"
                onClick={() => setCurrentOrderIndex(prev => 
                  prev < sortedOrders.length - 1 ? prev + 1 : 0
                )}
                disabled={sortedOrders.length <= 1}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
          
          <Link to="/productos" className="btn-comprar">
            <i className="fas fa-plus"></i>
            Nueva Compra
          </Link>
        </div>
      </div>
      
      <div className="single-order-container">
        <PedidoItem 
          key={`order-${currentOrder._id || currentOrder.id}`} 
          pedido={currentOrder} 
          onEstadoActualizado={onEstadoActualizado}
        />
      </div>
      
      {sortedOrders.length > 1 && (
        <div className="orders-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <i className="fas fa-receipt"></i>
              <span>Total de pedidos: {sortedOrders.length}</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-clock"></i>
              <span>
                {currentOrderIndex === 0 ? 'Pedido más reciente' : 
                 `Pedido del ${new Date(currentOrder.fecha_pedido || currentOrder.fecha).toLocaleDateString('es-ES')}`}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="orders-footer">
        <Link to="/productos" className="btn-secondary">
          <i className="fas fa-arrow-left"></i>
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
};

export default Profile;