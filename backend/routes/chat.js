// routes/chat.js
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();

// URI de conexión a MongoDB (usar la misma que el servidor principal)
const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

// Configurar TTL para chat_messages (24 horas)
const configurarTTL = async () => {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Crear índice TTL: los mensajes se eliminan automáticamente después de 24 horas
    await chatCollection.createIndex(
      { "timestamp": 1 }, 
      { expireAfterSeconds: 24 * 60 * 60 } // 24 horas en segundos
    );
    
    console.log('✅ Índice TTL configurado para chat_messages (24 horas)');
  } catch (error) {
    console.error('❌ Error configurando TTL:', error);
  } finally {
    await client.close();
  }
};

// Función de limpieza manual adicional (por si acaso)
const limpiarMensajesExpirados = async () => {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Eliminar mensajes más antiguos de 24 horas
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const resultado = await chatCollection.deleteMany({
      timestamp: { $lt: hace24Horas }
    });
    
    if (resultado.deletedCount > 0) {
      console.log(`🧹 Limpieza manual: ${resultado.deletedCount} mensajes eliminados`);
    }
  } catch (error) {
    console.error('❌ Error en limpieza manual:', error);
  } finally {
    await client.close();
  }
};

// Configurar TTL al iniciar el módulo
configurarTTL();

// Ejecutar limpieza manual cada 6 horas
setInterval(() => {
  console.log('🔄 Ejecutando limpieza manual de mensajes...');
  limpiarMensajesExpirados();
}, 6 * 60 * 60 * 1000); // 6 horas en milisegundos

// GET /api/chat/:pedidoId - Obtener mensajes de un pedido
router.get('/:pedidoId', async (req, res) => {
  try {
    const { pedidoId } = req.params;
    
    if (!pedidoId || !ObjectId.isValid(pedidoId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de pedido inválido'
      });
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Obtener mensajes del pedido, ordenados por fecha
    const messages = await chatCollection
      .find({ pedidoId: pedidoId })
      .sort({ timestamp: 1 })
      .toArray();
    
    await client.close();
    
    res.json({
      success: true,
      messages: messages
    });

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/chat/:pedidoId - Enviar mensaje
router.post('/:pedidoId', async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { mensaje, remitente, tipo, usuarioEmail } = req.body;
    
    if (!pedidoId || !ObjectId.isValid(pedidoId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de pedido inválido'
      });
    }

    if (!mensaje || !remitente) {
      return res.status(400).json({
        success: false,
        error: 'Mensaje y remitente son requeridos'
      });
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Crear el mensaje
    const nuevoMensaje = {
      pedidoId: pedidoId,
      mensaje: mensaje,
      remitente: remitente, // 'user' o 'admin'
      tipo: tipo || 'message', // 'message', 'status_update', 'system'
      usuarioEmail: usuarioEmail,
      timestamp: new Date(),
      leido: false
    };
    
    const resultado = await chatCollection.insertOne(nuevoMensaje);
    
    await client.close();
    
    res.json({
      success: true,
      mensaje: {
        _id: resultado.insertedId,
        ...nuevoMensaje
      }
    });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// PUT /api/chat/:pedidoId/marcar-leido - Marcar mensajes como leídos
router.put('/:pedidoId/marcar-leido', async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { remitente } = req.body; // 'user' o 'admin'
    
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Marcar como leídos los mensajes del remitente opuesto
    const filtroRemitente = remitente === 'admin' ? 'user' : 'admin';
    
    await chatCollection.updateMany(
      { 
        pedidoId: pedidoId,
        remitente: filtroRemitente,
        leido: false
      },
      { 
        $set: { leido: true }
      }
    );
    
    await client.close();
    
    res.json({
      success: true,
      message: 'Mensajes marcados como leídos'
    });

  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/chat/admin/resumen - Obtener resumen de chats para admin
router.get('/admin/resumen', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    const pedidosCollection = db.collection('pedidos');
    
    // Obtener pedidos con mensajes no leídos
    const pedidosConMensajes = await chatCollection.aggregate([
      {
        $match: {
          remitente: 'user',
          leido: false
        }
      },
      {
        $group: {
          _id: '$pedidoId',
          ultimoMensaje: { $last: '$mensaje' },
          ultimaFecha: { $last: '$timestamp' },
          mensajesNoLeidos: { $sum: 1 },
          usuarioEmail: { $last: '$usuarioEmail' }
        }
      },
      {
        $sort: { ultimaFecha: -1 }
      }
    ]).toArray();
    
    // Obtener información completa de los pedidos
    const resumen = [];
    for (const chat of pedidosConMensajes) {
      const pedido = await pedidosCollection.findOne({ 
        _id: new ObjectId(chat._id) 
      });
      
      if (pedido) {
        resumen.push({
          pedidoId: chat._id,
          numeroPedido: chat._id.slice(-8),
          usuario: pedido.usuario,
          ultimoMensaje: chat.ultimoMensaje,
          ultimaFecha: chat.ultimaFecha,
          mensajesNoLeidos: chat.mensajesNoLeidos,
          estado: pedido.estado,
          total: pedido.total
        });
      }
    }
    
    await client.close();
    
    res.json({
      success: true,
      chats: resumen
    });

  } catch (error) {
    console.error('Error obteniendo resumen de chats:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/chat/admin/estadisticas - Obtener estadísticas de la base de datos
router.get('/admin/estadisticas', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    const pedidosCollection = db.collection('pedidos');
    
    // Contar mensajes totales
    const totalMensajes = await chatCollection.countDocuments();
    
    // Contar mensajes por las últimas 24 horas
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const mensajesRecientes = await chatCollection.countDocuments({
      timestamp: { $gte: hace24Horas }
    });
    
    // Contar mensajes antiguos (que deberían ser eliminados)
    const mensajesAntiguos = await chatCollection.countDocuments({
      timestamp: { $lt: hace24Horas }
    });
    
    // Obtener tamaño estimado de la colección
    const stats = await db.command({ collStats: 'chat_messages' });
    
    // Contar pedidos totales
    const totalPedidos = await pedidosCollection.countDocuments();
    
    await client.close();
    
    res.json({
      success: true,
      estadisticas: {
        mensajes: {
          total: totalMensajes,
          recientes: mensajesRecientes,
          antiguos: mensajesAntiguos
        },
        pedidos: {
          total: totalPedidos
        },
        baseDatos: {
          tamaño: stats.size,
          tamañoEnMB: Math.round(stats.size / (1024 * 1024) * 100) / 100,
          documentos: stats.count
        },
        configuracion: {
          ttlHoras: 24,
          limpiezaAutomatica: true
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/chat/admin/limpiar - Ejecutar limpieza manual
router.post('/admin/limpiar', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('verduleria');
    const chatCollection = db.collection('chat_messages');
    
    // Eliminar mensajes más antiguos de 24 horas
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const resultado = await chatCollection.deleteMany({
      timestamp: { $lt: hace24Horas }
    });
    
    await client.close();
    
    console.log(`🧹 Limpieza manual ejecutada: ${resultado.deletedCount} mensajes eliminados`);
    
    res.json({
      success: true,
      mensaje: `Limpieza completada. ${resultado.deletedCount} mensajes eliminados.`,
      eliminados: resultado.deletedCount
    });

  } catch (error) {
    console.error('Error en limpieza manual:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
