const reseñasEjemplo = [
  {
    _id: '675b123456789012345678a1',
    usuario: { nombre: 'María González' },
    calificacion: 5,
    comentario: 'Excelente servicio y productos frescos. Muy recomendable!',
    fecha: new Date().toISOString(),
    aprobada: true,
    producto: 'general'
  },
  {
    _id: '675b123456789012345678a2',
    usuario: { nombre: 'Juan Pérez' },
    calificacion: 4,
    comentario: 'Buenos productos, entrega rápida. Solo mejoraría el empaque.',
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    aprobada: true,
    producto: 'Tomates'
  },
  {
    _id: '675b123456789012345678a3',
    usuario: { nombre: 'Ana López' },
    calificacion: 5,
    comentario: 'Las verduras llegaron súper frescas y el precio es muy justo.',
    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    aprobada: true,
    producto: 'Lechugas'
  },
  {
    _id: '675b123456789012345678a4',
    usuario: { nombre: 'Carlos Ruiz' },
    calificacion: 3,
    comentario: 'El pedido llegó bien pero un poco tarde.',
    fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    aprobada: false,
    producto: 'general'
  }
];

console.log('✅ Reseñas de ejemplo creadas:');
console.log('Total:', reseñasEjemplo.length);
console.log('Aprobadas:', reseñasEjemplo.filter(r => r.aprobada).length);
console.log('Pendientes:', reseñasEjemplo.filter(r => !r.aprobada).length);

console.log('\n📋 Para agregar al localStorage del navegador:');
console.log('\n1. Abre las DevTools del navegador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Ejecuta este comando:');
console.log('\nlocalStorage.setItem("reseñas_local", JSON.stringify(' + JSON.stringify(reseñasEjemplo) + '));');
console.log('\n4. Recarga la página para ver las reseñas');
