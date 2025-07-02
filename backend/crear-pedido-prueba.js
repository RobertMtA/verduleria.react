import { MongoClient } from 'mongodb';

const crearPedidoPrueba = async () => {
  const client = new MongoClient('mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0');
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('verduleria');
    
    const pedidoPrueba = {
      usuario: {
        nombre: "Rodrigo Alberti",
        email: "albertrodrigo400@gmail.com",
        telefono: "+54 11 3587-3304",
        direccion: "Tucumán 766, Capital Federal"
      },
      productos: [
        {
          nombre: "Espinaca",
          precio: 2000,
          cantidad: 3,
          subtotal: 6000,
          image: "/images/img-espinaca1.jpg"
        }
      ],
      total: 6000,
      estado: "pendiente",
      metodo_pago: "mercadopago",
      fecha_pedido: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const resultado = await db.collection('pedidos').insertOne(pedidoPrueba);
    console.log('✅ Pedido creado exitosamente');
    console.log('📦 ID del pedido:', resultado.insertedId);
    console.log('🔗 ID corto:', resultado.insertedId.toString().slice(-8).toUpperCase());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
};

crearPedidoPrueba();
