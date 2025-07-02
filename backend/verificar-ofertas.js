import fetch from 'node-fetch';

const probarOfertas = async () => {
  try {
    console.log('🔍 VERIFICANDO OFERTAS EN EL BACKEND');
    console.log('=' .repeat(50));
    
    // Probar endpoint de ofertas
    console.log('\n📊 Probando endpoint de ofertas...');
    const response = await fetch('http://localhost:4001/api/ofertas?activas_solo=true');
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('\n📦 Respuesta completa:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success && data.ofertas) {
      console.log('\n✅ OFERTAS ENCONTRADAS:');
      console.log('Cantidad total:', data.ofertas.length);
      
      data.ofertas.forEach((oferta, index) => {
        console.log(`\n${index + 1}. ${oferta.nombre}`);
        console.log('   Precio original: $' + oferta.precio_original);
        console.log('   Precio oferta: $' + oferta.precio_oferta);
        console.log('   Descuento: ' + oferta.descuento_porcentaje + '%');
        console.log('   Activa:', oferta.activa ? 'SÍ' : 'NO');
        console.log('   Imagen:', oferta.imagen || 'Sin imagen');
      });
      
      console.log('\n🎯 RESULTADO:');
      console.log('✅ El endpoint funciona correctamente');
      console.log('✅ Las ofertas deberían aparecer en "Nuestros Destacados"');
      
    } else {
      console.log('\n❌ PROBLEMAS ENCONTRADOS:');
      if (!data.success) {
        console.log('- La respuesta indica error:', data.message || 'Sin mensaje');
      }
      if (!data.ofertas) {
        console.log('- No hay ofertas en la respuesta');
      }
      
      console.log('\n💡 SOLUCIÓN:');
      console.log('Verifica que existan ofertas activas en la base de datos');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 SOLUCIÓN: El servidor backend no está corriendo');
      console.log('🔄 Ejecuta: npm start en la carpeta backend');
    }
  }
};

console.log('🚀 Verificando ofertas...\n');
probarOfertas();
