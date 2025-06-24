import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const dbConfig = {
  host: "127.0.0.1", // o "localhost"
  user: "verduleria", // o el usuario correcto
  password: "Verduleria2024!", // pon aquí la contraseña correcta
  database: "verduleria",
};

router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT 
        MONTHNAME(fecha) AS mes, 
        SUM(ventas) AS ventas, 
        COUNT(*) AS pedidos
      FROM reportes
      GROUP BY MONTH(fecha)
      ORDER BY MONTH(fecha)
    `);

    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Error en /api/reportes:", error); // <-- aquí va el log
    res.status(500).json({ error: "Error al obtener los reportes", detalle: error.message });
  }
});

export default router;