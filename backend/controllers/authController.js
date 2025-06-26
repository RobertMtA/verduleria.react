import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

// Función para obtener la colección y el cliente
async function getCollection() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return { collection: client.db(dbName).collection("usuarios"), client };
}

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const { collection, client } = await getCollection();

    // Verifica si el email ya existe
    const existing = await collection.findOne({ email });
    if (existing) {
      await client.close();
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta el usuario
    await collection.insertOne({
      nombre,
      email,
      password: hashedPassword,
      role: "user"
    });

    await client.close();
    res.status(201).json({ message: "Usuario registrado", user: { nombre, email, role: "user" } });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { collection, client } = await getCollection();

    // Busca el usuario por email
    const user = await collection.findOne({ email });
    if (!user) {
      await client.close();
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Compara la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await client.close();
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Genera un token (opcional)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      "secreto", // Cambia esto por una variable de entorno en producción
      { expiresIn: "1h" }
    );

    await client.close();
    res.json({
      message: "Login exitoso",
      user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error });
  }
};

const authController = {
  register,
  login
};

export default authController;