/**
 * Script para debuggear el problema del panel admin de reseñas
 */

const API_URL = 'http://localhost:4001/api';

async function debugAdmin() {
  console.log('🔍 DEBUGGEANDO PANEL ADMIN DE RESEÑAS');
  
  try {
    // 1. Verificar todas las reseñas
    console.log('\n📥 1. OBTENIENDO TODAS LAS RESEÑAS:');
    const response = await fetch(`${API_URL}/resenas`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Data structure:', data);
    
    if (data.success && Array.isArray(data.reseñas)) {
      console.log(`✅ Encontradas ${data.reseñas.length} reseñas:`);
      
      data.reseñas.forEach((reseña, index) => {
        console.log(`   ${index + 1}. ${reseña.usuario.nombre} - ${reseña.aprobada ? '✅ APROBADA' : '⏳ PENDIENTE'}`);
        console.log(`      Comentario: "${reseña.comentario}"`);
        console.log(`      ID: ${reseña._id}`);
      });
      
      // Filtrar por estados
      const pendientes = data.reseñas.filter(r => !r.aprobada);
      const aprobadas = data.reseñas.filter(r => r.aprobada);
      
      console.log(`\n📊 RESUMEN:`);
      console.log(`   Pendientes: ${pendientes.length}`);
      console.log(`   Aprobadas: ${aprobadas.length}`);
      
      if (pendientes.length > 0) {
        console.log('\n⏳ RESEÑAS PENDIENTES (estas deberían aparecer en el admin):');
        pendientes.forEach(reseña => {
          console.log(`   🔸 ${reseña.usuario.nombre}: "${reseña.comentario}"`);
          console.log(`     ID: ${reseña._id}`);
        });
      }
      
    } else {
      console.log('❌ Estructura de datos incorrecta:', data);
    }
    
    // 2. Verificar estadísticas
    console.log('\n📊 2. VERIFICANDO ESTADÍSTICAS:');
    const statsResponse = await fetch(`${API_URL}/resenas/estadisticas`);
    const statsData = await statsResponse.json();
    
    console.log('Stats data:', statsData);
    
    // 3. Simular lo que hace el frontend
    console.log('\n🖥️ 3. SIMULANDO FRONTEND:');
    console.log('El frontend debería mostrar:');
    console.log(`   - Total: ${data.reseñas.length}`);
    console.log(`   - Pendientes: ${data.reseñas.filter(r => !r.aprobada).length}`);
    console.log(`   - Aprobadas: ${data.reseñas.filter(r => r.aprobada).length}`);
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Ejecutar
debugAdmin();
