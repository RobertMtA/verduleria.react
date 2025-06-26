import { MongoClient } from "mongodb";

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

let client;
let db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

export default connectDB;