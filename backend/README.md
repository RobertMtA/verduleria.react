# Verdulería Backend

## Para desplegar en Render:

1. Crear cuenta en render.com
2. Conectar con GitHub
3. Crear nuevo "Web Service"
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
   - Variables de entorno: ninguna (MongoDB URI ya está en el código)

## Variables de entorno (opcional):
- PORT: se detecta automáticamente
- NODE_ENV: production (se configura automáticamente)
# Force redeploy
