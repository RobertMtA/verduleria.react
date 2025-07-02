import { generarComprobantePDF } from './services/pdfService.js';
import { MongoClient, ObjectId } from 'mongodb';

const probarPDF = async () => {
  const client = new MongoClient('mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0');
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('verduleria');
    const pedido = await db.collection('pedidos').findOne({ _id: new ObjectId('686478b3f0e42df09f022ffa') });
    
    if (!pedido) {
      console.log('❌ Pedido no encontrado');
      return;
    }
    
    console.log('📦 Pedido encontrado:', pedido.usuario.nombre);
    console.log('🔄 Generando PDF...');
    
    const resultado = await generarComprobantePDF(pedido);
    
    if (resultado.success) {
      console.log('✅ PDF generado exitosamente');
      console.log('📁 Tamaño:', resultado.buffer.length, 'bytes');
      
      // Guardar archivo de prueba
      import('fs').then(fs => {
        fs.writeFileSync('test-pdf-directo.pdf', resultado.buffer);
        console.log('💾 PDF guardado como test-pdf-directo.pdf');
      });
    } else {
      console.log('❌ Error generando PDF:', resultado.error);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.close();
  }
};

probarPDF();
