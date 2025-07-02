# 🥬 Verdulería Online - Sistema de Emails y Comprobantes PDF

## 🎉 **FUNCIONALIDADES COMPLETADAS**

### ✅ **Sistema de Emails Automáticos**
- 📧 Envío automático al crear pedido
- 🎨 Plantilla HTML profesional y responsive
- 📱 Compatible con todos los dispositivos
- 🔗 Links directos al seguimiento y tienda
- 📎 Opción de adjuntar comprobante PDF

### ✅ **Comprobantes PDF Profesionales**
- 📄 Generación automática de comprobantes
- 🎨 Diseño profesional con watermark
- 📊 Información fiscal completa
- 💳 Detalles de pago y productos
- 📍 Datos del cliente y empresa
- 📥 Descarga desde el perfil de usuario

### ✅ **Integración Frontend/Backend**
- 🔄 Sincronización en tiempo real
- 👤 Panel de usuario con descarga de comprobantes
- 🔍 Seguimiento de pedidos actualizado
- 👨‍💼 Panel admin mejorado
- 📱 Interfaz responsive y moderna

---

## 🚀 **CONFIGURACIÓN RÁPIDA**

### **1. Configurar Email Gmail**

1. **Habilitar 2FA** en tu cuenta Gmail:
   - Ve a [myaccount.google.com](https://myaccount.google.com) → Seguridad
   - Activar "Autenticación en dos pasos"

2. **Generar App Password**:
   - Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Crear contraseña para "Verduleria App"
   - **Copiar la contraseña de 16 caracteres**

3. **Actualizar `.env`**:
```bash
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-16-caracteres
FRONTEND_URL=http://localhost:5174
```

### **2. Instalar y Probar**

```bash
# Instalar dependencias del backend
cd backend
npm install

# Iniciar el servidor
npm start

# En otra terminal - Probar el sistema
node test-email.js
```

### **3. Probar Frontend**

```bash
# Instalar dependencias del frontend
npm install

# Iniciar desarrollo
npm run dev

# Ir a http://localhost:5174
# Crear un pedido para probar el email automático
```

---

## 📋 **ENDPOINTS DISPONIBLES**

### **📧 Emails**
```bash
# Enviar email simple
POST /api/pedidos/:id/enviar-email

# Enviar email con PDF adjunto
POST /api/pedidos/:id/enviar-email-con-pdf

# Body (opcional):
{
  "adjuntarPDF": true
}
```

### **📄 Comprobantes PDF**
```bash
# Descargar comprobante
GET /api/pedidos/:id/comprobante
```

### **🛒 Pedidos (con email automático)**
```bash
# Crear pedido (envía email automáticamente)
POST /api/pedidos
```

---

## 🧪 **TESTING**

### **Archivo de Prueba**
Ejecutar `backend/test-email.js` para probar:
- ✅ Configuración de email
- ✅ Envío de email de confirmación
- ✅ Generación de PDF
- ✅ Email con PDF adjunto

```bash
cd backend
node test-email.js
```

### **Pedido de Prueba Frontend**
1. Ir a http://localhost:5174
2. Registrarse/Iniciar sesión
3. Agregar productos al carrito
4. Completar pedido
5. Verificar:
   - Email recibido
   - PDF descargable desde perfil
   - Seguimiento funcionando

---

## 📁 **ESTRUCTURA DE ARCHIVOS**

### **Backend**
```
backend/
├── services/
│   ├── emailService.js      # 📧 Servicio de email
│   └── pdfService.js        # 📄 Servicio de PDF
├── .env                     # 🔑 Variables de entorno
├── test-email.js            # 🧪 Script de pruebas
└── server.js                # 🚀 Servidor principal
```

### **Frontend**
```
src/
├── pages/
│   ├── Profile.jsx          # 👤 Perfil con descargas
│   └── SeguimientoEntrega.jsx # 🔍 Seguimiento
└── styles/                  # 🎨 Estilos CSS
```

---

## 🔧 **CONFIGURACIÓN AVANZADA**

### **Variables de Entorno**
```bash
# Email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
FRONTEND_URL=http://localhost:5174

# MongoDB
MONGO_URI=mongodb+srv://...

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-...

# Server
PORT=4001
NODE_ENV=development
```

### **Personalización de Plantillas**

#### **Email** (`services/emailService.js`):
- Colores y estilos
- Información de la empresa
- Links y botones
- Contenido del mensaje

#### **PDF** (`services/pdfService.js`):
- Layout y diseño
- Información fiscal
- Watermark
- Datos de la empresa

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Email no se envía**
```bash
# Verificar configuración
echo $EMAIL_USER
echo $EMAIL_PASS

# Probar conexión
node test-email.js
```

**Posibles soluciones:**
- ✅ Verificar App Password (16 caracteres)
- ✅ Confirmar 2FA habilitado
- ✅ Revisar carpeta SPAM
- ✅ Probar con otro email

### **PDF no se genera**
```bash
# Reinstalar dependencias
npm install html-pdf-node

# Verificar permisos
mkdir comprobantes
```

### **Frontend no se conecta**
```bash
# Verificar CORS en server.js
# Verificar FRONTEND_URL en .env
# Reiniciar ambos servidores
```

---

## 🚀 **DEPLOYMENT PRODUCCIÓN**

### **Variables de Entorno Producción**
```bash
EMAIL_USER=info@tudominio.com
EMAIL_PASS=tu-password-produccion
FRONTEND_URL=https://tudominio.com
NODE_ENV=production
```

### **Servicios Recomendados**
- **Email**: SendGrid, AWS SES, Mailgun
- **Hosting**: Vercel, Netlify, AWS
- **Base de datos**: MongoDB Atlas
- **CDN**: Cloudflare, AWS CloudFront

---

## 📊 **MÉTRICAS Y MONITOREO**

El sistema incluye logs detallados:
```bash
✅ Email enviado exitosamente: message-id
📎 PDF adjuntado al email
📄 PDF generado: 150.2 KB
🔍 Usuario descargó comprobante: pedido-12345
```

---

## 🆘 **SOPORTE**

### **Logs útiles**
```bash
# Ver logs del servidor
npm start

# Ejecutar pruebas
node test-email.js

# Verificar archivos generados
ls comprobantes/
```

### **Contacto**
- 📧 Documentación: `GUIA_CONFIGURACION_EMAIL.md`
- 🔧 Testing: `backend/test-email.js`
- 📋 Endpoints: Ver sección API arriba

---

## 🎉 **¡LISTO PARA USAR!**

El sistema está completamente funcional y listo para producción. 

**Características principales:**
- ✅ Emails automáticos profesionales
- ✅ Comprobantes PDF descargables  
- ✅ Interfaz de usuario completa
- ✅ Panel administrativo
- ✅ Testing automatizado
- ✅ Documentación completa

**¡Disfruta de tu verdulería online! 🥬🛒✨**
