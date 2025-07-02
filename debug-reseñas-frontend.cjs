/**
 * Debug para verificar el problema de reseñas desde el frontend
 */

// Simular el objeto user que viene del AuthContext
const userMock = {
  id: "507f1f77bcf86cd799439011",
  email: "robertogaona1985@gmail.com", 
  nombre: "Roberto Gaona",
  telefono: "123456789",
  direccion: "Dirección de prueba",
  role: "user"
};

// Simular formData
const formDataMock = {
  calificacion: 5,
  comentario: "Muy buenos productos y frescos, excelente atención!",
  producto: "Verduras frescas"
};

console.log('🧪 DEBUGGING FRONTEND RESEÑAS');
console.log('👤 Usuario mock:', userMock);
console.log('📝 FormData mock:', formDataMock);

// Simular el mapeo que hace el frontend
const dataToSend = {
  ...formDataMock,
  usuario: {
    nombre: userMock.nombre || userMock.name || userMock.email || 'Usuario',
    email: userMock.email || userMock.correo || 'usuario@verduleria.com'
  }
};

console.log('📤 Datos que se enviarían:', dataToSend);

// Verificar validaciones del backend
console.log('\n🔍 VALIDACIONES:');
console.log('✅ Usuario:', dataToSend.usuario ? 'OK' : 'FALTA');
console.log('✅ Nombre:', dataToSend.usuario?.nombre ? 'OK' : 'FALTA');
console.log('✅ Email:', dataToSend.usuario?.email ? 'OK' : 'FALTA');
console.log('✅ Calificación:', dataToSend.calificacion >= 1 && dataToSend.calificacion <= 5 ? 'OK' : 'FALTA');
console.log('✅ Comentario:', dataToSend.comentario && dataToSend.comentario.length >= 10 ? `OK (${dataToSend.comentario.length} chars)` : 'FALTA');

console.log('\n📋 DIAGNÓSTICO:');
if (dataToSend.usuario?.nombre && dataToSend.usuario?.email && 
    dataToSend.calificacion >= 1 && dataToSend.calificacion <= 5 &&
    dataToSend.comentario && dataToSend.comentario.length >= 10) {
  console.log('✅ Todos los datos son válidos - El problema debe ser otro');
} else {
  console.log('❌ Hay datos inválidos');
}

// Test con fetch real
async function testFetch() {
  console.log('\n🌐 PROBANDO FETCH REAL...');
  try {
    const response = await fetch('http://localhost:4001/api/resenas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });
    
    console.log('📡 Status:', response.status);
    const data = await response.json();
    console.log('📦 Respuesta:', data);
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Ejecutar test
testFetch();
