import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verifica si el email ya existe
    const [existing] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta el usuario
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'Usuario registrado', user: { nombre, email, role: 'user' } });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca el usuario por email
    const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Compara la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Genera un token (opcional)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'secreto', // Cambia esto por una variable de entorno en producción
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en login', error });
  }
};

const authController = {
  register,
  login
};

export default authController;