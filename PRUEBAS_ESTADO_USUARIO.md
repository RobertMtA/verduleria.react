# Pruebas de Actualización de Estado por Usuario

## Funcionalidad Implementada

Se ha agregado la capacidad para que los usuarios puedan actualizar el estado de sus pedidos desde:

1. **Perfil de Usuario** (`/perfil`)
2. **Seguimiento de Entrega** (`/perfil/seguimiento`)

## Estados y Acciones Disponibles

### Estado "pendiente"
- ✅ **Acción disponible**: Cancelar Pedido
- 🎯 **Botón**: "Cancelar Pedido" (rojo)
- 📝 **Resultado**: Cambia estado a "cancelado"

### Estado "en_proceso" o "en_camino"
- ✅ **Acción disponible**: Confirmar Recepción
- 🎯 **Botón**: "Confirmar Recepción" (verde)
- 📝 **Resultado**: Cambia estado a "entregado"

### Estados finales ("entregado", "cancelado")
- ❌ **Sin acciones disponibles**
- 📝 **Resultado**: Solo muestra estado, sin botones

## Pasos para Probar

### 1. Preparar Datos de Prueba
```bash
cd backend
node scripts/crearPedidosEjemplo.js
```

### 2. Iniciar Aplicación
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (si no está ejecutándose)
cd backend
npm start
```

### 3. Probar Funcionalidad

#### A. Desde Perfil de Usuario
1. Ir a `/login`
2. Loguearse con:
   - **Email**: `maria@email.com` (tiene pedido "en_proceso")
   - **Password**: `password123`
3. Ir a `/perfil`
4. Hacer clic en pestaña "Pedidos"
5. Verificar que aparece botón "Confirmar Recepción" 
6. Hacer clic en el botón
7. Verificar que el estado cambia a "Entregado"

#### B. Desde Seguimiento de Entrega
1. Loguearse con: `juan@email.com` (tiene pedido "pendiente")
2. Ir a `/perfil/seguimiento`
3. Verificar que aparece botón "Cancelar Pedido"
4. Hacer clic en el botón
5. Verificar que el estado cambia a "Cancelado"

### 4. Verificación en Admin
1. Ir a `/admin/login`
2. Loguearse como admin
3. Ir a "Chat Soporte" 
4. Verificar que los estados actualizados por usuarios se reflejan
5. Verificar mensajes automáticos de cambio de estado

## Usuarios de Prueba

| Email | Password | Estado Pedido | Acción Esperada |
|-------|----------|---------------|-----------------|
| `juan@email.com` | `password123` | pendiente | Cancelar Pedido |
| `maria@email.com` | `password123` | en_proceso | Confirmar Recepción |
| `carlos@email.com` | `password123` | entregado | Sin acciones |
| `ana@email.com` | `password123` | pendiente | Cancelar Pedido |

## Integración con Chat

- ✅ Los cambios de estado generan mensajes automáticos en el chat
- ✅ Los administradores ven las actualizaciones en tiempo real
- ✅ Se mantiene historial de cambios de estado

## Estilos y UX

- 🎨 **Botones verdes**: Para acciones positivas (confirmar entrega)
- 🎨 **Botones rojos**: Para acciones de cancelación
- 🎨 **Iconos descriptivos**: Check para confirmar, X para cancelar
- 🎨 **Estados de carga**: "Procesando..." durante la actualización
- 🎨 **Mensajes de error**: Si falla la actualización

## Archivos Modificados

### Frontend
- `src/pages/Profile.jsx` - Botones en perfil usuario
- `src/pages/SeguimientoEntrega.jsx` - Botones en seguimiento
- `src/pages/Profile.css` - Estilos para botones perfil
- `src/pages/SeguimientoEntrega.css` - Estilos para botones seguimiento

### Backend
- Usa endpoint existente: `PUT /api/pedidos/:id`
- Verificación de permisos por token
- Estados válidos: `['pendiente', 'en_proceso', 'entregado', 'cancelado']`

## Flujo de Datos

1. **Usuario hace clic** en botón de acción
2. **Frontend envía** PUT request a `/api/pedidos/:id`
3. **Backend actualiza** estado en MongoDB
4. **Frontend recarga** datos del pedido
5. **Chat system** genera mensaje automático
6. **Admin recibe** notificación en tiempo real

## Validaciones

- ✅ Solo usuarios autenticados pueden actualizar
- ✅ Solo pueden actualizar sus propios pedidos
- ✅ Transiciones de estado válidas únicamente
- ✅ Manejo de errores con mensajes claros
- ✅ Estados de carga durante procesamiento
