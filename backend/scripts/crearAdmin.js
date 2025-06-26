import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const mongoUri =
  "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

async function crearAdmin() {
  const nombre = "admin";
  const email = "admin@admin.com";
  const passwordPlano = "Verduleria2024!"; // Cambia por una contraseña segura
  const role = "admin";

  const passwordHasheada = await bcrypt.hash(passwordPlano, 10);

  const client = new MongoClient(mongoUri);
  await client.connect();
  const collection = client.db(dbName).collection("usuarios");

  await collection.insertOne({
    nombre,
    email,
    password: passwordHasheada,
    role,
  });

  await client.close();
  console.log("Usuario admin creado");
  process.exit();
}

crearAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});