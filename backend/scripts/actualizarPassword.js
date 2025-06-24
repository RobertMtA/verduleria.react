import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

// Configura tu conexión
const dbConfig = {
  host: "127.0.0.1", // ¡NO "localhost"!
  user: "root",
  password: "Verduleria2024!",
  database: "verduleria",
};

async function actualizarPassword() {
  try {
    const hash = await bcrypt.hash('Verduleria2024!', 10);
    const connection = await mysql.createConnection(dbConfig);

    // Usa parámetros para evitar inyección SQL
    const [result] = await connection.execute(
      `UPDATE usuarios SET password = ? WHERE email = ?`,
      [hash, 'admin@admin.com']
    );

    await connection.end();
    console.log('Password updated successfully');
  } catch (error) {
    console.error(error);
  }
}

actualizarPassword();