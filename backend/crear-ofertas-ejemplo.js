import fetch from 'node-fetch';

const crearOfertasEjemplo = async () => {
  try {
    console.log('🏷️ CREANDO OFERTAS DE EJEMPLO');
    console.log('=' .repeat(50));
    
    // Primero obtener algunos productos existentes
    const productosResponse = await fetch('http://localhost:4001/api/productos');
    const productos = await productosResponse.json();
    
    if (!productos || productos.length === 0) {
      console.log('❌ No hay productos disponibles para crear ofertas');
      return;
    }
    
    console.log(`✅ Encontrados ${productos.length} productos`);
    
    // Crear ofertas para algunos productos
    const ofertasEjemplo = [
      {
        nombre: 'Banana Premium',
        descripcion: 'Bananas frescas importadas - Oferta especial del fin de semana',
        precio_original: 6000,
        precio_oferta: 4200,
        descuento_porcentaje: 30,
        imagen: '/images/img-banana1.jpg',
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        stock_limitado: 50,
        activa: true
      },
      {
        nombre: 'Manzana Roja Especial',
        descripcion: 'Manzanas rojas seleccionadas - Perfectas para toda la familia',
        precio_original: 2500,
        precio_oferta: 1750,
        descuento_porcentaje: 30,
        imagen: '/images/img-manzana1.jpg',
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días
        stock_limitado: 30,
        activa: true
      },
      {
        nombre: 'Naranja Jugosa',
        descripcion: 'Naranjas dulces y jugosas - Ideales para jugos naturales',
        precio_original: 2500,
        precio_oferta: 1875,
        descuento_porcentaje: 25,
        imagen: '/images/img-naranja1.jpg',
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días
        stock_limitado: 40,
        activa: true
      },
      {
        nombre: 'Papa de la Casa',
        descripcion: 'Papas frescas del día - Perfectas para cualquier preparación',
        precio_original: 2700,
        precio_oferta: 1890,
        descuento_porcentaje: 30,
        imagen: '/images/img-papa1.jpg',
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 días
        stock_limitado: 60,
        activa: true
      }
    ];
    
    console.log('\n📝 CREANDO OFERTAS...');
    
    for (let i = 0; i < ofertasEjemplo.length; i++) {
      const oferta = ofertasEjemplo[i];
      
      try {
        const response = await fetch('http://localhost:4001/api/ofertas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(oferta)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          console.log(`✅ Oferta creada: ${oferta.nombre} (${oferta.descuento_porcentaje}% OFF)`);
        } else {
          console.log(`⚠️  Oferta ya existe o error: ${oferta.nombre}`);
        }
        
      } catch (error) {
        console.log(`❌ Error creando oferta ${oferta.nombre}:`, error.message);
      }
    }
    
    // Verificar ofertas creadas
    console.log('\n🔍 VERIFICANDO OFERTAS ACTIVAS...');
    
    try {
      const ofertasResponse = await fetch('http://localhost:4001/api/ofertas?activas_solo=true');
      const ofertasData = await ofertasResponse.json();
      
      if (ofertasData.success && ofertasData.ofertas) {
        console.log(`✅ Total de ofertas activas: ${ofertasData.ofertas.length}`);
        
        ofertasData.ofertas.forEach((oferta, index) => {
          console.log(`${index + 1}. ${oferta.nombre} - ${oferta.descuento_porcentaje}% OFF`);
          console.log(`   Precio: $${oferta.precio_original} → $${oferta.precio_oferta}`);
          console.log(`   Válida hasta: ${new Date(oferta.fecha_fin).toLocaleDateString('es-AR')}`);
        });
        
        console.log('\n🎉 ¡OFERTAS LISTAS!');
        console.log('🌐 Ve a http://localhost:5174/ para ver las ofertas en "Nuestros Destacados"');
        console.log('🏷️ También puedes ver todas las ofertas en: http://localhost:5174/ofertas');
        
      } else {
        console.log('❌ No se pudieron verificar las ofertas');
      }
      
    } catch (error) {
      console.log('❌ Error verificando ofertas:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
};

console.log('🚀 Iniciando creación de ofertas de ejemplo...\n');
crearOfertasEjemplo();
