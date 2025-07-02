import mongoose from 'mongoose';

// Conexión a MongoDB
const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Modelo de Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  telefono: { type: String, default: '' },
  direccion: { type: String, default: '' },
  fecha_registro: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

async function crearUsuarioPrueba() {
  try {
    console.log('Verificando o creando usuario de prueba...');
    
    let usuario = await Usuario.findOne({ email: 'test@test.com' });
    
    if (!usuario) {
      usuario = new Usuario({
        nombre: 'Usuario de Prueba',
        email: 'test@test.com',
        password: '$2b$10$hashedpassword', // password hasheado
        telefono: '1234567890',
        direccion: 'Calle Falsa 123, Ciudad',
        role: 'user'
      });
      
      await usuario.save();
      console.log('✅ Usuario creado exitosamente:', usuario._id);
    } else {
      console.log('✅ Usuario ya existe:', usuario._id);
    }
    
    console.log('Email del usuario:', usuario.email);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
}

crearUsuarioPrueba();
