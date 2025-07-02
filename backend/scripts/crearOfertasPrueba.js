// scripts/crearOfertasPrueba.js
// Script para crear ofertas de prueba

import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

const ofertasPrueba = [
  {
    nombre: 'Tomate Cherry Orgánico',
    descripcion: 'Tomates cherry frescos y jugosos, cultivados de forma orgánica. Perfectos para ensaladas y decoración de platos.',
    precio_original: 4500,
    precio_oferta: 3150,
    descuento_porcentaje: 30,
    imagen: 'images/img-tomate1.jpg',
    activa: true,
    fecha_inicio: new Date('2025-07-01'),
    fecha_fin: new Date('2025-07-15'),
    categoria: 'verduras',
    stock_limitado: 50,
    creado_en: new Date(),
    actualizado_en: new Date()
  },
  {
    nombre: 'Lechuga Hidropónica',
    descripcion: 'Lechuga fresca cultivada en hidropónicos, sin pesticidas. Crujiente y nutritiva.',
    precio_original: 3800,
    precio_oferta: 2660,
    descuento_porcentaje: 30,
    imagen: 'images/img-lechuga1.jpg',
    activa: true,
    fecha_inicio: new Date('2025-07-01'),
    fecha_fin: new Date('2025-07-20'),
    categoria: 'verduras',
    stock_limitado: null,
    creado_en: new Date(),
    actualizado_en: new Date()
  },
  {
    nombre: 'Papa Andina Especial',
    descripcion: 'Papas andinas de calidad premium, ideales para todas tus preparaciones. Textura cremosa y sabor único.',
    precio_original: 3500,
    precio_oferta: 2450,
    descuento_porcentaje: 30,
    imagen: 'images/img-papa1.jpg',
    activa: true,
    fecha_inicio: new Date('2025-07-01'),
    fecha_fin: new Date('2025-07-10'),
    categoria: 'verduras',
    stock_limitado: 100,
    creado_en: new Date(),
    actualizado_en: new Date()
  },
  {
    nombre: 'Manzana Roja Premium',
    descripcion: 'Manzanas rojas de primera calidad, dulces y crujientes. Ricas en vitaminas y antioxidantes.',
    precio_original: 5200,
    precio_oferta: 3640,
    descuento_porcentaje: 30,
    imagen: 'images/img-manzana1.jpg',
    activa: true,
    fecha_inicio: new Date('2025-07-01'),
    fecha_fin: new Date('2025-07-12'),
    categoria: 'frutas',
    stock_limitado: 75,
    creado_en: new Date(),
    actualizado_en: new Date()
  },
  {
    nombre: 'Zanahoria Orgánica',
    descripcion: 'Zanahorias orgánicas frescas, dulces y nutritivas. Perfectas para jugos, ensaladas y guisos.',
    precio_original: 2800,
    precio_oferta: 1960,
    descuento_porcentaje: 30,
    imagen: 'images/img-zanahoria1.jpg',
    activa: true,
    fecha_inicio: new Date('2025-07-01'),
    fecha_fin: new Date('2025-07-25'),
    categoria: 'verduras',
    stock_limitado: null,
    creado_en: new Date(),
    actualizado_en: new Date()
  },
  {
    nombre: 'Oferta Expirada - Test',
    descripcion: 'Esta es una oferta de prueba que ya expiró para probar el sistema.',
    precio_original: 2000,
    precio_oferta: 1000,
    descuento_porcentaje: 50,
    imagen: 'images/img-perejil1.jpg',
    activa: true,
    fecha_inicio: new Date('2025-06-01'),
    fecha_fin: new Date('2025-06-30'),
    categoria: 'general',
    stock_limitado: 10,
    creado_en: new Date(),
    actualizado_en: new Date()
  }
];

const crearOfertas = async () => {
  const client = new MongoClient(uri);
  
  try {
    console.log('🏷️ Creando ofertas de prueba...\n');
    
    await client.connect();
    const db = client.db('verduleria');
    const ofertasCollection = db.collection('ofertas');
    
    // Limpiar ofertas existentes
    const resultadoLimpieza = await ofertasCollection.deleteMany({});
    console.log(`🗑️ Ofertas anteriores eliminadas: ${resultadoLimpieza.deletedCount}`);
    
    // Insertar nuevas ofertas
    const resultado = await ofertasCollection.insertMany(ofertasPrueba);
    console.log(`✅ ${resultado.insertedCount} ofertas creadas exitosamente\n`);
    
    // Mostrar resumen
    console.log('📋 Ofertas creadas:');
    ofertasPrueba.forEach((oferta, index) => {
      const ahora = new Date();
      let estado = '';
      
      if (!oferta.activa) {
        estado = '❌ Inactiva';
      } else if (oferta.fecha_inicio <= ahora && oferta.fecha_fin >= ahora) {
        estado = '✅ Vigente';
      } else if (oferta.fecha_fin < ahora) {
        estado = '⏰ Expirada';
      } else if (oferta.fecha_inicio > ahora) {
        estado = '🔮 Futura';
      }
      
      console.log(`${index + 1}. ${oferta.nombre} - ${oferta.descuento_porcentaje}% OFF - ${estado}`);
      console.log(`   $${oferta.precio_original} → $${oferta.precio_oferta}`);
      console.log(`   Vigencia: ${oferta.fecha_inicio.toLocaleDateString()} - ${oferta.fecha_fin.toLocaleDateString()}`);
      if (oferta.stock_limitado) {
        console.log(`   Stock limitado: ${oferta.stock_limitado} unidades`);
      }
      console.log('');
    });
    
    console.log('🎉 Ofertas de prueba creadas exitosamente!');
    console.log('💡 Puedes verlas en:');
    console.log('   - Panel admin: http://localhost:5173/admin/ofertas');
    console.log('   - Página pública: http://localhost:5173/ofertas');
    
  } catch (error) {
    console.error('❌ Error creando ofertas:', error);
  } finally {
    await client.close();
  }
};

// Ejecutar creación
crearOfertas();
