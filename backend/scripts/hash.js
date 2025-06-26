import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

async function updatePassword(email, plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
  const client = new MongoClient(mongoUri);
  await client.connect();
  const collection = client.db(dbName).collection("usuarios");
  const result = await collection.updateOne(
    { email },
    { $set: { password: hash } }
  );
  await client.close();
  if (result.modifiedCount > 0) {
    console.log("Password updated successfully");
  } else {
    console.log("No user found or password not updated");
  }
}

updatePassword("admin@admin.com", "Verduleria2024!").catch(console.error);