import pool from '../config/db.js';

const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  },

  // Obtener un usuario por ID
  getUserById: (req, res) => {
    const { id } = req.params;
    res.json({ id, nombre: "Usuario de ejemplo", email: "ejemplo@mail.com" });
  },

  // Crear un usuario
  createUser: (req, res) => {
    const { nombre, email, password } = req.body;
    res.status(201).json({ id: Date.now(), nombre, email });
  },

  // Actualizar un usuario
  updateUser: (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    res.json({ id, nombre, email });
  },

  // Eliminar un usuario
  deleteUser: (req, res) => {
    const { id } = req.params;
    res.json({ message: `Usuario ${id} eliminado` });
  }
};

export const login = async (req, res) => {
  // ...código...
};

export default userController;