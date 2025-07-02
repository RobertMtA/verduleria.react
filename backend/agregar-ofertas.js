import { MongoClient } from 'mongodb';

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

const agregarOfertas = async () => {
  try {
    console.log('🎯 AGREGANDO SISTEMA DE OFERTAS A PRODUCTOS');
    console.log('=' .repeat(60));
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const productosCollection = db.collection('productos');
    
    // Obtener productos actuales
    const productos = await productosCollection.find().toArray();
    console.log(`📦 Productos encontrados: ${productos.length}`);
    
    // Definir ofertas especiales
    const ofertas = [
      {
        nombre: 'Banana',
        oferta: {
          enOferta: true,
          precioOriginal: 6000,
          precioOferta: 4500,
          descuento: 25,
          descripcionOferta: '¡25% OFF! Bananas frescas en oferta especial',
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
          destacado: true
        }
      },
      {
        nombre: 'Lechuga',
        oferta: {
          enOferta: true,
          precioOriginal: 2500,
          precioOferta: 1875,
          descuento: 25,
          descripcionOferta: '¡Oferta especial! Lechuga fresca',
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días
          destacado: true
        }
      },
      {
        nombre: 'Naranja',
        oferta: {
          enOferta: true,
          precioOriginal: 2500,
          precioOferta: 2000,
          descuento: 20,
          descripcionOferta: '¡20% OFF! Naranjas jugosas en promoción',
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días
          destacado: true
        }
      },
      {
        nombre: 'Manzana',
        oferta: {
          enOferta: true,
          precioOriginal: 2500,
          precioOferta: 2125,
          descuento: 15,
          descripcionOferta: '¡15% OFF! Manzanas rojas y frescas',
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 días
          destacado: true
        }
      }
    ];
    
    console.log('\n🏷️ Aplicando ofertas...');
    
    for (const ofertaData of ofertas) {
      const producto = productos.find(p => p.nombre === ofertaData.nombre);
      
      if (producto) {
        // Actualizar producto con oferta
        const result = await productosCollection.updateOne(
          { _id: producto._id },
          { 
            $set: { 
              ...ofertaData.oferta,
              precio: ofertaData.oferta.precioOferta // Actualizar precio actual
            }
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ ${ofertaData.nombre}: Oferta aplicada (${ofertaData.oferta.descuento}% OFF)`);
        } else {
          console.log(`⚠️  ${ofertaData.nombre}: No se pudo aplicar oferta`);
        }
      } else {
        console.log(`❌ ${ofertaData.nombre}: Producto no encontrado`);
      }
    }
    
    // Asegurar que otros productos no estén marcados como destacados
    await productosCollection.updateMany(
      { nombre: { $nin: ofertas.map(o => o.nombre) } },
      { 
        $set: { 
          destacado: false,
          enOferta: false
        }
      }
    );
    
    console.log('✅ Otros productos actualizados (no destacados)');
    
    // Verificar productos en oferta
    const productosEnOferta = await productosCollection.find({ enOferta: true }).toArray();
    
    console.log('\n🎉 OFERTAS APLICADAS EXITOSAMENTE');
    console.log('=' .repeat(60));
    console.log(`📊 Productos en oferta: ${productosEnOferta.length}`);
    
    productosEnOferta.forEach(producto => {
      console.log(`🏷️  ${producto.nombre}:`);
      console.log(`   💰 Precio original: $${producto.precioOriginal?.toLocaleString('es-AR')}`);
      console.log(`   🔥 Precio oferta: $${producto.precioOferta?.toLocaleString('es-AR')}`);
      console.log(`   📉 Descuento: ${producto.descuento}%`);
      console.log(`   ⭐ Destacado: ${producto.destacado ? 'Sí' : 'No'}`);
      console.log('');
    });
    
    console.log('🌐 Ahora los productos destacados mostrarán ofertas reales');
    console.log('🔄 Reinicia el frontend para ver los cambios');
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

agregarOfertas();
