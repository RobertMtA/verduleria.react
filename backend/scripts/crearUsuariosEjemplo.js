import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Conexión a MongoDB
const mongoUri = 'mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0';

const { Schema, model } = mongoose;

// Modelo de Usuario
const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  telefono: { type: String, default: '' },
  direccion: { type: String, default: '' },
  fecha_registro: { type: Date, default: Date.now }
});

const Usuario = model('Usuario', UsuarioSchema);

async function crearUsuariosEjemplo() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB Atlas');

    // Crear usuarios de ejemplo (sin eliminar los existentes)
    const usuariosEjemplo = [
      {
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        password: 'usuario123',
        role: 'user',
        telefono: '+54 11 1234-5678',
        direccion: 'Av. Corrientes 1234, CABA'
      },
      {
        nombre: 'María García',
        email: 'maria@email.com', 
        password: 'usuario123',
        role: 'user',
        telefono: '+54 11 9876-5432',
        direccion: 'Calle Falsa 123, Buenos Aires'
      },
      {
        nombre: 'Carlos López',
        email: 'carlos@email.com',
        password: 'usuario123', 
        role: 'user',
        telefono: '+54 11 5555-1234',
        direccion: 'San Martín 456, La Plata'
      },
      {
        nombre: 'Ana Martínez',
        email: 'ana@email.com',
        password: 'usuario123',
        role: 'user',
        telefono: '+54 11 7777-8888',
        direccion: 'Rivadavia 789, Rosario'
      },
      {
        nombre: 'Roberto Silva',
        email: 'roberto@email.com',
        password: 'moderador123',
        role: 'moderador',
        telefono: '+54 11 3333-4444', 
        direccion: 'Belgrano 321, Córdoba'
      }
    ];

    let usuariosCreados = 0;
    
    for (const datosUsuario of usuariosEjemplo) {
      try {
        // Verificar si el usuario ya existe
        const existente = await Usuario.findOne({ email: datosUsuario.email });
        
        if (!existente) {
          // Hashear la contraseña
          const passwordHash = await bcrypt.hash(datosUsuario.password, 10);
          
          const nuevoUsuario = new Usuario({
            ...datosUsuario,
            password: passwordHash
          });
          
          await nuevoUsuario.save();
          console.log(`✅ Usuario creado: ${datosUsuario.nombre} (${datosUsuario.email})`);
          usuariosCreados++;
        } else {
          console.log(`⚠️  Usuario ya existe: ${datosUsuario.email}`);
        }
      } catch (error) {
        console.log(`❌ Error creando usuario ${datosUsuario.email}:`, error.message);
      }
    }

    console.log(`\n📊 Resumen: ${usuariosCreados} nuevos usuarios creados`);

    // Mostrar todos los usuarios actuales
    const todosLosUsuarios = await Usuario.find().select('-password');
    console.log('\n👥 Usuarios en la base de datos:');
    todosLosUsuarios.forEach(usuario => {
      console.log(`- ${usuario.nombre} (${usuario.email}) - ${usuario.role}`);
    });

  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
crearUsuariosEjemplo();
