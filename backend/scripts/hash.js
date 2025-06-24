import bcrypt from 'bcrypt';

bcrypt.hash('Verduleria2024!', 10)
  .then(hash => {
    // Assuming you're using a database library that returns a promise
    return db.query(`
      UPDATE usuarios
      SET password = '$2b$10$vXVP4xCJHbI1nk0pE9S9PuyyzDsSSUf4oIaeTntHRmkYd8l/8lcc.'
      WHERE email = 'admin@admin.com';
    `);
  })
  .then(result => {
    console.log('Password updated successfully');
  })
  .catch(console.error);