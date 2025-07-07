Write-Host "Iniciando limpieza del proyecto..." -ForegroundColor Green

# Crear directorio de backup
$backupDir = "backup_archivos_eliminados"
New-Item -ItemType Directory -Path $backupDir -Force
Write-Host "Directorio de backup creado: $backupDir" -ForegroundColor Yellow

# Funcion para mover archivos a backup
function Remove-ProjectFile {
    param($fileName)
    if (Test-Path $fileName) {
        Move-Item $fileName $backupDir -Force
        Write-Host "Movido a backup: $fileName" -ForegroundColor Green
    }
}

# Scripts de prueba
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

# HTML de prueba
$testHtml = @(
    "test-login.html",
    "test-products.html",
    "test-resenas-debug.html",
    "test-reviews.html"
)

foreach ($html in $testHtml) {
    Remove-ProjectFile $html
}

# JSON de prueba
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

Write-Host "Limpieza completada!" -ForegroundColor Green
