import { MongoClient } from 'mongodb';

const verificarUsuario = async () => {
  const client = new MongoClient('mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0');
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('verduleria');
    const usuario = await db.collection('usuarios').findOne({ email: 'robertogaona1985@gmail.com' });
    
    if (usuario) {
      console.log('✅ Usuario encontrado:');
      console.log('Nombre:', usuario.nombre);
      console.log('Email:', usuario.email);
      console.log('Role:', usuario.role);
      console.log('Fecha registro:', usuario.fecha_registro);
    } else {
      console.log('❌ Usuario no encontrado con email: robertogaona1985@gmail.com');
      
      // Buscar usuarios similares
      const usuarios = await db.collection('usuarios').find({}).toArray();
      console.log('📋 Usuarios existentes:');
      usuarios.forEach(u => {
        console.log(`- ${u.nombre} (${u.email})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
};

verificarUsuario();
