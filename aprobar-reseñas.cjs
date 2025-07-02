/**
 * Script para aprobar reseñas y que aparezcan en la Home
 */

const API_URL = 'http://localhost:4001/api';

async function aprobarReseñas() {
  console.log('🎯 Aprobando reseñas para que aparezcan en la Home...');
  
  try {
    // 1. Obtener todas las reseñas
    console.log('📥 Obteniendo reseñas...');
    const response = await fetch(`${API_URL}/resenas`);
    const data = await response.json();
    
    if (!data.success) {
      console.log('❌ Error obteniendo reseñas:', data.error);
      return;
    }
    
    console.log(`📊 Encontradas ${data.reseñas.length} reseñas`);
    
    // 2. Aprobar todas las reseñas pendientes
    for (const reseña of data.reseñas) {
      if (!reseña.aprobada) {
        console.log(`✅ Aprobando reseña de ${reseña.usuario.nombre}...`);
        
        const aprobarResponse = await fetch(`${API_URL}/resenas/${reseña._id}/aprobar`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ aprobada: true })
        });
        
        const aprobarData = await aprobarResponse.json();
        if (aprobarData.success) {
          console.log(`   ✅ Aprobada: "${reseña.comentario.substring(0, 50)}..."`);
        } else {
          console.log(`   ❌ Error: ${aprobarData.error}`);
        }
      } else {
        console.log(`✅ Ya aprobada: ${reseña.usuario.nombre}`);
      }
    }
    
    // 3. Verificar reseñas aprobadas
    console.log('\n📊 Verificando reseñas aprobadas...');
    const aprobadasResponse = await fetch(`${API_URL}/resenas?aprobadas=true`);
    const aprobadasData = await aprobadasResponse.json();
    
    console.log(`🌟 ${aprobadasData.reseñas.length} reseñas aprobadas y visibles en la Home`);
    
    // 4. Mostrar estadísticas
    const statsResponse = await fetch(`${API_URL}/resenas/estadisticas`);
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      console.log('\n📈 ESTADÍSTICAS:');
      console.log(`   Total: ${statsData.estadisticas.total}`);
      console.log(`   Aprobadas: ${statsData.estadisticas.aprobadas}`);
      console.log(`   Pendientes: ${statsData.estadisticas.pendientes}`);
      console.log(`   Promedio: ${statsData.estadisticas.promedio.toFixed(1)} ⭐`);
    }
    
    console.log('\n🎉 ¡Listo! Ahora puedes ver las reseñas en:');
    console.log('   🏠 Home: http://localhost:5173');
    console.log('   🔧 Admin: http://localhost:5173/admin/reseñas');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Ejecutar
aprobarReseñas();
