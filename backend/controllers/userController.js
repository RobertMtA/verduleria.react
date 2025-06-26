import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

// Función para obtener la colección y el cliente
async function getCollection() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return { collection: client.db(dbName).collection("usuarios"), client };
}

const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const { collection, client } = await getCollection();
      const users = await collection.find().toArray();
      await client.close();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const { collection, client } = await getCollection();
      const user = await collection.findOne({ _id: new ObjectId(id) });
      await client.close();
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  },

  // Crear un usuario
  createUser: async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
      const { collection, client } = await getCollection();
      const passwordHasheada = await bcrypt.hash(password, 10);
      const result = await collection.insertOne({ nombre, email, password: passwordHasheada });
      await client.close();
      res.status(201).json({ id: result.insertedId, nombre, email });
    } catch (error) {
      res.status(500).json({ message: "Error al crear usuario" });
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    try {
      const { collection, client } = await getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { nombre, email } }
      );
      await client.close();
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ id, nombre, email });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const { collection, client } = await getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      await client.close();
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: `Usuario ${id} eliminado` });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  }
};

export const login = async (req, res) => {
  // ...código...
};

export default userController;