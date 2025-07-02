# Sistema de Limpieza Automática de Chat - MongoDB TTL

## 🎯 Problema Resuelto

El sistema de chat generaba mensajes continuamente que se acumulaban en la base de datos MongoDB, lo que podría causar:
- Crecimiento descontrolado de la base de datos
- Degradación del rendimiento
- Costos excesivos en MongoDB Atlas
- Posible colapso del sistema

## ✅ Solución Implementada

### 1. TTL (Time To Live) Automático en MongoDB

**Configuración:**
- **Duración:** 24 horas
- **Índice:** `timestamp_1` con `expireAfterSeconds: 86400`
- **Verificación:** MongoDB elimina documentos expirados cada ~60 segundos

**Ubicación del código:**
```javascript
// backend/routes/chat.js (líneas 9-28)
const configurarTTL = async () => {
  await chatCollection.createIndex(
    { "timestamp": 1 }, 
    { expireAfterSeconds: 24 * 60 * 60 } // 24 horas
  );
};
```

### 2. Limpieza Manual Adicional

**Funcionalidad:**
- Limpieza automática cada 6 horas (por si falla TTL)
- Endpoint para limpieza manual desde el panel admin
- Función de limpieza ejecutada al iniciar el servidor

**Código de limpieza:**
```javascript
// backend/routes/chat.js (líneas 30-48)
const limpiarMensajesExpirados = async () => {
  const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const resultado = await chatCollection.deleteMany({
    timestamp: { $lt: hace24Horas }
  });
};

// Ejecutar cada 6 horas
setInterval(limpiarMensajesExpirados, 6 * 60 * 60 * 1000);
```

### 3. Panel de Monitoreo (Admin)

**Componente:** `src/components/AdminEstadisticas.jsx`
**Funcionalidades:**
- Estadísticas en tiempo real de mensajes
- Información del tamaño de la base de datos
- Botón de limpieza manual
- Actualización automática cada 30 segundos

**Endpoints de estadísticas:**
- `GET /api/chat/admin/estadisticas` - Obtener estadísticas
- `POST /api/chat/admin/limpiar` - Ejecutar limpieza manual

### 4. Scripts de Mantenimiento

**Scripts disponibles:**
- `backend/scripts/verificarChat.js` - Verificar estado del sistema
- `backend/scripts/configurarLimpiezaChat.js` - Configurar TTL
- `backend/scripts/crearPedidoPrueba.js` - Crear pedidos de prueba
- `backend/scripts/agregarMensajeUsuario.js` - Crear mensajes de prueba

## 🔧 Cómo Funciona

### TTL de MongoDB
1. **Índice TTL:** Cada documento tiene un campo `timestamp`
2. **Verificación:** MongoDB verifica documentos expirados cada 60 segundos
3. **Eliminación:** Los documentos con `timestamp + 24h < ahora` se eliminan automáticamente

### Limpieza Adicional
1. **Backup:** Función de limpieza cada 6 horas por si falla TTL
2. **Manual:** Admin puede ejecutar limpieza cuando quiera
3. **Inicio:** Se ejecuta al iniciar el servidor para limpiar acumulados

## 📊 Monitoreo

### Panel de Administración
- **Ruta:** `/admin/estadisticas`
- **Información mostrada:**
  - Total de mensajes
  - Mensajes recientes (últimas 24h)
  - Mensajes antiguos (>24h)
  - Tamaño de la base de datos
  - Estado del TTL

### Comandos de Verificación
```bash
# Verificar estado del sistema
cd backend && node scripts/verificarChat.js

# Configurar TTL manualmente
cd backend && node scripts/configurarLimpiezaChat.js
```

## 🚀 Beneficios

1. **Prevención de colapso:** La BD nunca crece descontroladamente
2. **Rendimiento:** Base de datos siempre liviana y rápida
3. **Costos:** Control de costos en MongoDB Atlas
4. **Automatización:** No requiere intervención manual
5. **Monitoreo:** Visibilidad completa desde el panel admin
6. **Redundancia:** Múltiples mecanismos de limpieza

## ⚙️ Configuración Actual

- **TTL:** 24 horas (86400 segundos)
- **Limpieza automática:** Cada 6 horas
- **Verificación MongoDB:** Cada 60 segundos
- **Actualización estadísticas:** Cada 30 segundos
- **Estado:** ✅ Activo y funcionando

## 🔍 Verificación del Sistema

El sistema está completamente configurado y funcionando:

```
✅ Índice TTL configurado: 24 horas
✅ Limpieza automática: Cada 6 horas  
✅ Panel de admin: Disponible en /admin/estadisticas
✅ Endpoints funcionando: estadísticas y limpieza manual
✅ Scripts de mantenimiento: Disponibles
✅ Documentación: Completa
```

## 📝 Notas Importantes

1. **TTL de MongoDB:** Es la medida principal, muy confiable
2. **Limpieza adicional:** Es un respaldo por seguridad
3. **24 horas:** Tiempo suficiente para conversaciones activas
4. **Mensajes importantes:** Se pueden guardar en otra colección si es necesario
5. **Escalabilidad:** El sistema maneja cualquier volumen de mensajes

Este sistema garantiza que la base de datos de chat se mantenga siempre limpia y nunca colapse por acumulación de mensajes.
