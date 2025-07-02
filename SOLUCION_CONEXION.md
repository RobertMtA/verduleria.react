# 🔧 Solución al Problema de Conexión Frontend-Backend

## 📋 Problema Identificado

El backend está funcionando perfectamente en Render, pero el frontend desplegado en Netlify no puede conectarse debido a problemas de configuración de variables de entorno.

## ✅ Soluciones Paso a Paso

### Opción 1: Configurar Variables en Netlify (Recomendado)

1. **Acceder al Panel de Netlify:**
   - Ir a https://app.netlify.com/
   - Seleccionar tu sitio de verdulería

2. **Configurar Variables de Entorno:**
   - Ir a `Site settings` → `Environment variables`
   - Hacer clic en `Add variable`
   - Agregar:
     ```
     Key: VITE_API_URL
     Value: https://verduleria-backend-m19n.onrender.com/api
     ```

3. **Redesplegar el Sitio:**
   - Ir a `Deploys`
   - Hacer clic en `Trigger deploy` → `Deploy site`

### Opción 2: Usar Vercel (Alternativa)

1. **Conectar Repositorio a Vercel:**
   - Ir a https://vercel.com/
   - Importar proyecto desde GitHub: `RobertMtA/verduleria.react`

2. **Configurar Variables de Entorno:**
   - En el proceso de deploy, agregar:
     ```
     VITE_API_URL = https://verduleria-backend-m19n.onrender.com/api
     ```

3. **Completar Deploy:**
   - Vercel detectará automáticamente que es un proyecto Vite
   - El deploy se completará automáticamente

### Opción 3: Verificación Manual

Si ninguna de las opciones anteriores funciona, puedes verificar usando la página de debug:

1. **Acceder a la página de debug:**
   - URL: `tu-dominio.netlify.app/debug-api`
   - O: `tu-dominio.vercel.app/debug-api`

2. **Verificar variables:**
   - La página mostrará si `VITE_API_URL` está configurada correctamente
   - Hacer clic en "Probar conexión al API" para verificar la conectividad

## 🔍 Diagnóstico Adicional

### Si el problema persiste:

1. **Verificar CORS:**
   - El backend ya tiene CORS configurado para permitir todos los orígenes
   - No debería ser un problema

2. **Verificar HTTPS:**
   - Ambos servicios (frontend y backend) usan HTTPS
   - No hay problemas de mixed content

3. **Verificar la URL del API:**
   - Backend: https://verduleria-backend-m19n.onrender.com/api
   - Endpoint de prueba: https://verduleria-backend-m19n.onrender.com/api/productos

## 📱 Prueba Rápida

Puedes probar la conectividad del backend directamente en tu navegador:
```
https://verduleria-backend-m19n.onrender.com/api/productos
```

Deberías ver una lista de productos en formato JSON.

## 🎯 Resultado Esperado

Una vez configurada correctamente la variable `VITE_API_URL`, el frontend debería:

1. ✅ Cargar la lista de productos
2. ✅ Permitir registro e inicio de sesión
3. ✅ Procesar pedidos correctamente
4. ✅ Mostrar el seguimiento de entregas
5. ✅ Enviar notificaciones por email
6. ✅ Funcionar el panel de administración

## 📞 Siguiente Paso

Una vez que el frontend esté funcionando, **no olvides**:

1. **Actualizar FRONTEND_URL en el backend:**
   - Ir a Render → Verduleria Backend → Environment
   - Actualizar `FRONTEND_URL` con la URL real del frontend desplegado
   - Ejemplo: `https://verduleria-online.netlify.app`

2. **Probar el flujo completo:**
   - Registro → Login → Agregar productos → Checkout → Seguimiento

¡El sistema está listo para producción! 🚀
