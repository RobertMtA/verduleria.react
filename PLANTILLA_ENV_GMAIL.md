# 📧 PLANTILLA PARA ACTUALIZAR .ENV CON GMAIL REAL

## 🔧 REEMPLAZA EN EL ARCHIVO: backend/.env

Cambia TODO el contenido del archivo .env por esto:

```env
# Configuración de Email REAL para Gmail
EMAIL_USER=TU_EMAIL_AQUI@gmail.com
EMAIL_PASS=TU_APP_PASSWORD_DE_16_CARACTERES

# URL del Frontend 
FRONTEND_URL=http://localhost:5174

# Configuración de la aplicación
NODE_ENV=production

# Puerto del servidor
PORT=4001
```

## 📝 INSTRUCCIONES:

1. **EMAIL_USER**: Reemplaza "TU_EMAIL_AQUI@gmail.com" con tu email real
2. **EMAIL_PASS**: Reemplaza "TU_APP_PASSWORD_DE_16_CARACTERES" con la contraseña que copiaste de Google
3. **ELIMINA**: Las líneas SMTP_HOST y SMTP_PORT (solo eran para Ethereal)
4. **NODE_ENV**: Cambiado a "production" para emails reales

## ⚠️ EJEMPLO:
```env
EMAIL_USER=roberto.verduleria@gmail.com
EMAIL_PASS=abcdewqwefghijklmnop
```

## 🔄 DESPUÉS DE EDITAR:
1. Guarda el archivo .env
2. Reinicia el servidor backend
3. Prueba enviando un email

---
**¡Cuando tengas la App Password, dime y te ayudo a configurar el .env!**
