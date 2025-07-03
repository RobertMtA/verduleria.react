#!/bin/bash

# Script para corregir todas las URLs de localhost:4001 a la URL de producción
echo "Corrigiendo URLs de localhost:4001 a producción..."

# Buscar y reemplazar en todos los archivos .jsx y .js en src/
find src/ -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i 's|http://localhost:4001|https://verduleria-backend-m19n.onrender.com|g' {} +

echo "✅ URLs corregidas en todos los archivos"
