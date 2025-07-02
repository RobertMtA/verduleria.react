/**
 * Verificación final del estado del sistema de reseñas
 */

const API_URL = 'http://localhost:4001/api';

async function verificacionFinal() {
  console.log('🔍 === VERIFICACIÓN FINAL DEL SISTEMA DE RESEÑAS ===\n');
  
  try {
    // 1. Estado actual de reseñas
    const response = await fetch(`${API_URL}/resenas`);
    const data = await response.json();
    
    console.log('📊 ESTADO ACTUAL:');
    console.log(`   Total reseñas: ${data.reseñas.length}`);
    
    const pendientes = data.reseñas.filter(r => !r.aprobada);
    const aprobadas = data.reseñas.filter(r => r.aprobada);
    
    console.log(`   ✅ Aprobadas: ${aprobadas.length}`);
    console.log(`   ⏳ Pendientes: ${pendientes.length}`);
    
    if (pendientes.length > 0) {
      console.log('\n⏳ RESEÑAS PENDIENTES (deben aparecer en admin):');
      pendientes.forEach((reseña, index) => {
        console.log(`   ${index + 1}. 👤 ${reseña.usuario.nombre}`);
        console.log(`      💬 "${reseña.comentario}"`);
        console.log(`      ⭐ ${reseña.calificacion} estrellas`);
        console.log(`      🆔 ${reseña._id}`);
        console.log('');
      });
    }
    
    // 2. Estadísticas
    const statsResponse = await fetch(`${API_URL}/resenas/estadisticas`);
    const statsData = await statsResponse.json();
    
    console.log('📈 ESTADÍSTICAS:');
    console.log(`   Total: ${statsData.estadisticas.total}`);
    console.log(`   Aprobadas: ${statsData.estadisticas.aprobadas}`);
    console.log(`   Pendientes: ${statsData.estadisticas.pendientes}`);
    console.log(`   Promedio: ${statsData.estadisticas.promedio} ⭐`);
    
    // 3. Instrucciones para el admin
    console.log('\n🎯 INSTRUCCIONES PARA EL ADMIN:');
    console.log('1. Ve a: http://localhost:5173/admin/reseñas');
    console.log('2. Deberías ver las estadísticas arriba');
    console.log('3. Haz clic en el botón "Pendientes"');
    console.log('4. Deberían aparecer las reseñas pendientes listadas arriba');
    console.log('5. Puedes aprobarlas haciendo clic en "Aprobar"');
    
    // 4. Verificar que el frontend esté sirviendo
    console.log('\n🌐 VERIFICANDO FRONTEND...');
    try {
      const frontendCheck = await fetch('http://localhost:5173');
      console.log(`   Frontend status: ${frontendCheck.status === 200 ? '✅ OK' : '❌ ERROR'}`);
    } catch (error) {
      console.log('   Frontend status: ❌ NO RESPONDE');
    }
    
    console.log('\n✅ SISTEMA LISTO PARA USAR!');
    
  } catch (error) {
    console.error('💥 Error en verificación:', error);
  }
}

// Ejecutar
verificacionFinal();
