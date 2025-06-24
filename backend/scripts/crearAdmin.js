import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function crearAdmin() {
  const nombre = 'admin';
  const email = 'admin@admin.com';
  const passwordPlano = 'Verduleria2024!'; // Cambia por una contraseña segura
  const role = 'admin';

  const passwordHasheada = await bcrypt.hash(passwordPlano, 10);

  await pool.query(
    'INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)',
    [nombre, email, passwordHasheada, role]
  );

  console.log('Usuario admin creado');
  process.exit();
}

crearAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});