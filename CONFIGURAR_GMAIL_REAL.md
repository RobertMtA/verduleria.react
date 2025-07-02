# 📧 CONFIGURACIÓN GMAIL PARA EMAILS REALES

## 🎯 OBJETIVO
Configurar Gmail para que los emails lleguen realmente a los usuarios finales.

## 🔐 PASO 1: CREAR APP PASSWORD EN GMAIL

### 1.1 Acceder a tu cuenta de Gmail
1. Ve a: https://myaccount.google.com/
2. Inicia sesión con tu cuenta de Gmail principal

### 1.2 Activar verificación en 2 pasos (si no está activa)
1. Clic en "Seguridad" (lado izquierdo)
2. Busca "Verificación en 2 pasos"
3. Si no está activa, actívala siguiendo los pasos

### 1.3 Crear contraseña de aplicación
1. En "Seguridad" busca "Contraseñas de aplicaciones"
2. Clic en "Contraseñas de aplicaciones"
3. Selecciona:
   - **App**: "Correo"
   - **Dispositivo**: "Otro (nombre personalizado)"
   - **Nombre**: "Verduleria Online"
4. Clic en "Generar"
5. **IMPORTANTE**: Copia la contraseña de 16 caracteres (ejemplo: "abcd efgh ijkl mnop")

## 🔧 PASO 2: ACTUALIZAR CONFIGURACIÓN

### 2.1 Tu email y contraseña
- **EMAIL_USER**: Tu email real (ejemplo: tuusuario@gmail.com)
- **EMAIL_PASS**: La contraseña de 16 caracteres generada

### 2.2 Archivo .env actualizado
```env
# Configuración de Email REAL para Gmail
EMAIL_USER=TU_EMAIL@gmail.com
EMAIL_PASS=TU_APP_PASSWORD_DE_16_CARACTERES

# URL del Frontend 
FRONTEND_URL=http://localhost:5174

# Configuración de la aplicación
NODE_ENV=development

# Puerto del servidor
PORT=4001
```

## ⚠️ NOTAS IMPORTANTES

1. **Usa tu email real**: El que quieres que aparezca como remitente
2. **App Password**: NO uses tu contraseña normal de Gmail
3. **Sin espacios**: Quita los espacios de la App Password si los tiene
4. **Elimina SMTP_HOST y SMTP_PORT**: Solo para Ethereal

## 🧪 VERIFICACIÓN

Después de configurar, el sistema:
- ✅ Enviará emails desde tu Gmail real
- ✅ Los usuarios recibirán emails en sus bandejas reales
- ✅ Mantendrá el mismo diseño profesional
- ✅ Funcionará con todos los flujos (pedidos, reset password)

---
**🔄 Después de actualizar .env, reinicia el servidor backend**
