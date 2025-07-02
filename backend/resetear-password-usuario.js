import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Definir esquema de usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: String,
  direccion: String,
  role: { type: String, default: 'user' },
  fecha_registro: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

const resetearPassword = async () => {
  try {
    console.log('🔧 RESTABLECIENDO CONTRASEÑA DE USUARIO PRINCIPAL');
    console.log('=' .repeat(60));
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://robertogaona1985:Rv8108966522@cluster0.wdaym.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Conectado a MongoDB');
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email: 'robertogaona1985@gmail.com' });
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('👤 Usuario encontrado:', usuario.nombre);
    console.log('📧 Email:', usuario.email);
    
    // Nueva contraseña conocida
    const nuevaPassword = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaPassword, saltRounds);
    
    // Actualizar contraseña y limpiar tokens de reset
    usuario.password = hashedPassword;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();
    
    console.log('✅ Contraseña restablecida exitosamente');
    console.log('🔑 Nueva contraseña:', nuevaPassword);
    console.log('🧹 Tokens de reset limpiados');
    
    // Probar login inmediatamente
    console.log('\n🧪 PROBANDO LOGIN CON NUEVA CONTRASEÑA...');
    
    const passwordValida = await bcrypt.compare(nuevaPassword, usuario.password);
    console.log('✅ Verificación de contraseña:', passwordValida ? 'VÁLIDA' : 'INVÁLIDA');
    
    console.log('\n🎯 CREDENCIALES PARA LOGIN:');
    console.log('📧 Email: robertogaona1985@gmail.com');
    console.log('🔑 Password: password123');
    
    console.log('\n🌐 PRUEBA EN EL FRONTEND:');
    console.log('🔗 Ve a: http://localhost:5174/login');
    console.log('🔐 Usa las credenciales de arriba');
    
    mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

resetearPassword();
