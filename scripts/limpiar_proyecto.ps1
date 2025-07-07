# 🧹 Script de Limpieza - Verdulería Online
# Ejecutar con PowerShell

Write-Host "🧹 Iniciando limpieza del proyecto..." -ForegroundColor Green

# Crear directorio de backup
$backupDir = "backup_archivos_eliminados_$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -ItemType Directory -Path $backupDir -Force
Write-Host "📁 Directorio de backup creado: $backupDir" -ForegroundColor Yellow

# Función para mover archivos a backup y eliminar
function Remove-ProjectFile {
    param($fileName)
    if (Test-Path $fileName) {
        Move-Item $fileName $backupDir -Force
        Write-Host "✅ Movido a backup: $fileName" -ForegroundColor Green
    }
}

# Eliminar scripts de prueba
Write-Host "🗑️ Eliminando scripts de prueba..." -ForegroundColor Cyan
$testScripts = @(
    "add-reviews.js",
    "aprobar-reseñas.cjs",
    "crear-reseña-test.cjs",
    "debug-admin-reseñas.cjs",
    "debug-reseñas-frontend.cjs",
    "test-crear-reseña.cjs",
    "test-email-estilos-mejorados.js",
    "test-seguimiento-entregas.js",
    "test-sistema-reseñas.cjs",
    "verificacion-final-reseñas.cjs",
    "verificar-fechas-pedidos.js",
    "verification-script.js",
    "fix-urls.sh"
)

foreach ($script in $testScripts) {
    Remove-ProjectFile $script
}

# Eliminar archivos HTML de prueba
Write-Host "🗑️ Eliminando archivos HTML de prueba..." -ForegroundColor Cyan
$testHtml = @(
    "test-login.html",
    "test-products.html",
    "test-resenas-debug.html",
    "test-reviews.html"
)

foreach ($html in $testHtml) {
    Remove-ProjectFile $html
}

# Eliminar archivos JSON de prueba
Write-Host "🗑️ Eliminando archivos JSON de prueba..." -ForegroundColor Cyan
$testJson = @(
    "test_admin_login.json",
    "test_final.json",
    "test_final_login.json",
    "test_login.json",
    "test_login_error.json",
    "test_login_frontend.json",
    "test_pedido.json",
    "test_registro.json",
    "test_registro_completo.json"
)

foreach ($json in $testJson) {
    Remove-ProjectFile $json
}

# Eliminar documentación temporal
Write-Host "🗑️ Eliminando documentación temporal..." -ForegroundColor Cyan
$tempDocs = @(
    "BANNER_DEMO_AGREGADO.md",
    "CHAT_LIMPIEZA_AUTOMATICA.md",
    "CHAT_SISTEMA_ACTUALIZADO.md",
    "CHAT_SISTEMA_LISTO.md",
    "CHAT_SISTEMA_SOLUCIONADO.md",
    "CONCEPTOS_REACT.md",
    "CONFIGURAR_GMAIL_REAL.md",
    "CORRECCION_MENU_MOVIL.md",
    "CORRECION_FORMULARIO_RESENAS.md",
    "CORS_SOLUCIONADO.md",
    "DEPLOY_COMPLETO.md",
    "DIRECCIONES_ACTUALIZADAS_RESUELTO.md",
    "DIRECCION_CLIENTE_AGREGADA.md",
    "DOCUMENTACION_EMAIL_PDF.md",
    "DOCUMENTACION_PROYECTO.md",
    "ELIMINAR_PEDIDOS_IMPLEMENTADO.md",
    "ESTADO_DEPLOY.md",
    "ESTADO_EN_CAMINO_IMPLEMENTADO.md",
    "ESTADO_FINAL_PERFIL.md",
    "ESTRATEGIA_SEO_COMPLETA.md",
    "FIX_FECHAS_SEGUIMIENTO.md",
    "FUNCIONALIDADES_SISTEMA.md",
    "GMAIL_REAL_FUNCIONANDO.md",
    "GUIA_COMERCIAL_VERDULERIA.md",
    "GUIA_CONFIGURACION_EMAIL.md",
    "GUIA_PRUEBAS_RESENAS_MOCK.md",
    "INTEGRACION_MERCADOPAGO_COMPLETA.md",
    "KEEP_ALIVE_GUIDE.md",
    "MAPA_ENTREGAS.md",
    "MEJORAS_DEBUG_ADMIN.md",
    "MEJORAS_EMAIL_ESTILOS.md",
    "MEJORAS_RESPONSIVIDAD_MOVIL.md",
    "MEJORAS_UX_SCROLL_HORIZONTAL.md",
    "MEJORA_INTERFAZ_PERFIL.md",
    "MERCADOPAGO_LISTO.md",
    "NOTIFICACIONES_EMAIL_IMPLEMENTADO.md",
    "OFERTAS_DESTACADOS_IMPLEMENTADO.md",
    "PLANTILLA_ENV_GMAIL.md",
    "PROBLEMAS_SOLUCIONADOS.md",
    "PROBLEMA_RESEÑAS_RESUELTO.md",
    "PROCESO_DESARROLLO.md",
    "PROYECTO_COMPLETADO.md",
    "PRUEBAS_ESTADO_USUARIO.md",
    "README_DEPLOY.md",
    "README_EMAIL_PDF.md",
    "RESUMEN_FINAL.md",
    "SEGUIMIENTO_ENTREGAS_COMPLETO.md",
    "SEGURIDAD.md",
    "SISTEMA_LIMPIEZA_COMPLETADO.md",
    "SISTEMA_OFERTAS_COMPLETADO.md",
    "SISTEMA_RESEÑAS_IMPLEMENTADO.md",
    "SOLUCION_CACHE_MOVIL.md",
    "SOLUCION_CONEXION.md",
    "SOLUCION_EMAIL_FUNCIONANDO.md",
    "SOLUCION_RESENAS_CSS_JULIO2025.md"
)

foreach ($doc in $tempDocs) {
    Remove-ProjectFile $doc
}

# Eliminar archivos PHP/Composer
Write-Host "🗑️ Eliminando archivos PHP innecesarios..." -ForegroundColor Cyan
Remove-ProjectFile "composer.json"
Remove-ProjectFile "composer.lock"
if (Test-Path "vendor") {
    Move-Item "vendor" $backupDir -Force
    Write-Host "✅ Movido a backup: vendor/" -ForegroundColor Green
}

# Eliminar variables de entorno innecesarias
Write-Host "🗑️ Eliminando archivos .env innecesarios..." -ForegroundColor Cyan
Remove-ProjectFile ".env"
Remove-ProjectFile ".env.local"

Write-Host "✨ Limpieza completada!" -ForegroundColor Green
Write-Host "📁 Archivos movidos a: $backupDir" -ForegroundColor Yellow
Write-Host "🚀 Proyecto listo para producción" -ForegroundColor Green

# Mostrar estructura final
Write-Host "`n📂 Estructura final del proyecto:" -ForegroundColor Cyan
Get-ChildItem -Name | Sort-Object
