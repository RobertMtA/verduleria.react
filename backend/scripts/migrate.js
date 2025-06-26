// migrate.js
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";

// Configura tus datos
const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "verduleria",
};

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const mongoDb = "verduleria";

// Lista de tablas a migrar
const tablas = [
  "productos",
  "usuarios",
  "pedidos",
  "pedidos_items",
  "reportes",
  "suscriptores",
  "password_resets"
];

async function migrate() {
  // Conexión MySQL
  const mysqlConn = await mysql.createConnection(mysqlConfig);

  // Conexión MongoDB
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db(mongoDb);

  for (const tabla of tablas) {
    const [rows] = await mysqlConn.execute(`SELECT * FROM ${tabla}`);
    const collection = db.collection(tabla);

    // Limpia la colección antes de importar (opcional)
    await collection.deleteMany({});
    if (rows.length > 0) {
      await collection.insertMany(rows);
    }
    console.log(`Migración completada: ${rows.length} registros importados en ${tabla}.`);
  }

  await mysqlConn.end();
  await mongoClient.close();
  console.log("¡Migración de todas las tablas completada!");
}

migrate().catch(console.error);