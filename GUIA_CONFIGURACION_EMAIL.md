# 📧 CONFIGURACIÓN DE EMAIL Y COMPROBANTES PDF

## 🔧 CONFIGURACIÓN PASO A PASO

### 1️⃣ **Configurar Gmail para Envío de Emails**

#### **Opción A: Configuración Básica (Recomendada)**
1. **Ir a tu cuenta Gmail** → [myaccount.google.com](https://myaccount.google.com)
2. **Activar autenticación de 2 factores**:
   - Ve a "Seguridad" → "Autenticación en dos pasos"
   - Sigue las instrucciones para configurarla

3. **Generar App Password**:
   - Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecciona "Aplicación" → "Otra (nombre personalizado)"
   - Escribe: "Verduleria App"
   - **COPIA LA CONTRASEÑA DE 16 CARACTERES**

#### **Opción B: Usar otro proveedor de email**
Si prefieres usar otro servicio, puedes modificar la configuración en `backend/services/emailService.js`.

### 2️⃣ **Actualizar Archivo .env**

```bash
# Configuración de Email para desarrollo
EMAIL_USER=TU_EMAIL@gmail.com
EMAIL_PASS=TU_APP_PASSWORD_AQUI

# URL del Frontend 
FRONTEND_URL=http://localhost:5174

# Configuración de la aplicación
NODE_ENV=development

# Puerto del servidor
PORT=4001
```

⚠️ **IMPORTANTE**: 
- Reemplaza `TU_EMAIL@gmail.com` con tu email real
- Reemplaza `TU_APP_PASSWORD_AQUI` con la App Password de 16 caracteres

### 3️⃣ **Probar el Sistema**

#### **Paso 1: Actualizar email de prueba**
Edita el archivo `backend/test-email.js` y cambia el email destinatario:

```javascript
// Línea ~13 - Cambiar este email por uno real tuyo
email: "tu-email-de-prueba@gmail.com"
```

#### **Paso 2: Ejecutar las pruebas**

```bash
# Terminal 1: Iniciar el backend
cd backend
npm start

# Terminal 2: Probar envío de email
cd backend
node test-email.js
```

### 4️⃣ **Probar desde el Frontend**

1. **Iniciar el frontend**:
```bash
# Terminal 3
npm run dev
```

2. **Crear un pedido de prueba**:
   - Ve a http://localhost:5174
   - Inicia sesión o registra una cuenta
   - Agrega productos al carrito
   - Completa el pedido

3. **Verificar funcionalidades**:
   - ✅ Email de confirmación enviado automáticamente
   - ✅ Descargar comprobante PDF desde el perfil
   - ✅ Ver seguimiento del pedido

## 📋 **ENDPOINTS DISPONIBLES**

### **Email y Comprobantes**
- `POST /api/pedidos` - Crear pedido (envía email automático)
- `GET /api/pedidos/:id/comprobante` - Descargar comprobante PDF
- `POST /api/pedidos/:id/enviar-email` - Enviar email manual (testing)

### **Ejemplos de Uso**
```bash
# Descargar comprobante PDF
curl http://localhost:4001/api/pedidos/PEDIDO_ID/comprobante --output comprobante.pdf

# Enviar email manual
curl -X POST http://localhost:4001/api/pedidos/PEDIDO_ID/enviar-email
```

## 🎨 **CARACTERÍSTICAS DEL SISTEMA**

### **Email de Confirmación**
- ✅ Diseño profesional y responsive
- ✅ Información completa del pedido
- ✅ Estado del pedido con colores
- ✅ Botones de acción (seguimiento, más compras)
- ✅ Información de contacto y horarios
- ✅ Tiempo estimado de entrega

### **Comprobante PDF**
- ✅ Diseño profesional con watermark
- ✅ Información fiscal completa
- ✅ Tabla detallada de productos
- ✅ Resumen de pago
- ✅ Datos del cliente y empresa
- ✅ Códigos QR (placeholder)
- ✅ Información legal

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Authentication failed"**
- ✅ Verifica que el email esté correcto
- ✅ Verifica que la App Password esté correcta (16 caracteres)
- ✅ Asegúrate de que 2FA esté habilitado

### **Error: "Connection timeout"**
- ✅ Verifica tu conexión a internet
- ✅ Intenta con un proveedor de email diferente

### **Email no llega**
- ✅ Revisa la carpeta de SPAM
- ✅ Verifica que el email destinatario sea correcto
- ✅ Espera unos minutos (puede haber demora)

### **PDF no se genera**
- ✅ Verifica que las dependencias estén instaladas: `npm install`
- ✅ Reinicia el servidor backend

## 📱 **TESTING EN PRODUCCIÓN**

Para usar en producción:

1. **Configurar variables de entorno en el servidor**
2. **Usar un servicio de email profesional** (SendGrid, SES, etc.)
3. **Configurar dominio propio** para FRONTEND_URL
4. **Implementar límites de rate limiting**
5. **Agregar logs de auditoría**

## 🔄 **PRÓXIMAS MEJORAS OPCIONALES**

- [ ] Adjuntar PDF automáticamente en el email
- [ ] QR codes funcionales con seguimiento
- [ ] Plantillas personalizables por tipo de pedido
- [ ] Notificaciones SMS
- [ ] Tracking de apertura de emails
- [ ] Internacionalización de plantillas

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa los logs del servidor: `npm start`
2. Ejecuta la prueba de email: `node test-email.js`
3. Verifica la configuración en `.env`
4. Consulta la documentación de Gmail App Passwords

---

¡Sistema listo para usar! 🎉
