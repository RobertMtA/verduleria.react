# 🚀 Configuración Keep-Alive para Render

## ¿Por qué se suspende la aplicación?

Las cuentas **gratuitas de Render** suspenden las aplicaciones después de **15 minutos de inactividad** para ahorrar recursos. Esto es normal y se resuelve fácilmente.

## ✅ Soluciones Disponibles

### 1. **Usar cron-job.org (Recomendado - GRATIS)**

#### Paso a paso:

1. **Ve a tu dashboard de Render** y copia la URL de tu aplicación backend
   - Tu URL: `https://verduleria-backend-m19n.onrender.com`

2. **Registrate en [cron-job.org](https://cron-job.org)** (gratis)

3. **Crea un nuevo cronjob** con estos datos:
   - **URL**: `https://verduleria-backend-m19n.onrender.com/api/health`
   - **Título**: "Verdulería Keep-Alive"
   - **Intervalo**: Cada 14 minutos
   - **Método**: GET
   - **Estado**: Activo

4. **Guarda el cronjob** - ¡Listo! Tu app se mantendrá activa 24/7

### 2. **Usar UptimeRobot (Alternativa gratuita)**

1. Ve a [uptimerobot.com](https://uptimerobot.com)
2. Crea cuenta gratuita
3. Añade monitor:
   - **URL**: `https://verduleria-backend-m19n.onrender.com/api/health`
   - **Tipo**: HTTP(s)
   - **Intervalo**: 5 minutos
   - **Nombre**: "Verdulería Keep-Alive"

### 3. **Upgrade a plan pago de Render (Recomendado para producción)**

- **Plan Starter ($7/mes)**: Sin suspensión por inactividad
- Mejor rendimiento y disponibilidad
- Ideal para aplicaciones en producción

## 🔧 Endpoint de Health Check

Ya agregamos el endpoint `/api/health` a tu backend que responde:

```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

## 📝 Para hacer el deploy de los cambios:

1. **Commit y push** los cambios a GitHub:
```bash
git add .
git commit -m "Add health check endpoint for keep-alive"
git push origin main
```

2. **En Render**, ve a tu servicio y haz click en **"Manual Deploy"** > **"Deploy latest commit"**

## ⚡ Verificar que funciona:

1. Ve a: `https://verduleria-backend-m19n.onrender.com/api/health`
2. Deberías ver una respuesta JSON con estado "OK"
3. Si ves la respuesta, el keep-alive funcionará correctamente

## 🎯 Recomendación Final:

- **Para desarrollo**: Usa cron-job.org (gratis)
- **Para producción**: Upgrade a plan Starter de Render ($7/mes)

¡Con esto tu aplicación se mantendrá activa las 24 horas!
