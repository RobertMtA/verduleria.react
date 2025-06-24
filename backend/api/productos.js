import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const dbConfig = {
  host: "127.0.0.1",
  user: "verduleria",
  password: "Verduleria2024!",
  database: "verduleria",
};

router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM productos");
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos", detalle: error.message });
  }
});

// Ruta GET para obtener un producto por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM productos WHERE id = ?", [id]);
    await connection.end();
    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto", detalle: error.message });
  }
});

// Ruta POST para crear producto
router.post("/", async (req, res) => {
  let { nombre, descripcion, precio, stock, image } = req.body;
  // Validación básica
  if (!nombre || !descripcion || precio == null || stock == null) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  // Asegura que sean números
  precio = Number(precio);
  stock = Number(stock);
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "INSERT INTO productos (nombre, descripcion, precio, stock, image) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, stock, image]
    );
    await connection.end();
    res.json({ mensaje: "Producto creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto", detalle: error.message });
  }
});

// Ruta PUT para editar producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { nombre, descripcion, precio, stock, image } = req.body;
  if (!nombre || !descripcion || precio == null || stock == null) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  precio = Number(precio);
  stock = Number(stock);
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, image=? WHERE id=?",
      [nombre, descripcion, precio, stock, image, id]
    );
    await connection.end();
    res.json({ mensaje: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto", detalle: error.message });
  }
});

// Ruta DELETE para eliminar producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM productos WHERE id = ?", [id]);
    await connection.end();
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto", detalle: error.message });
  }
});

// Ruta POST para restar stock al comprar
router.post("/restar-stock", async (req, res) => {
  console.log("Datos recibidos para restar stock:", req.body); // <-- agrega esto
  const { id, cantidad } = req.body;
  if (!id || !cantidad) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
      [cantidad, id, cantidad]
    );
    await connection.end();
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Stock insuficiente o producto no encontrado" });
    }
    res.json({ mensaje: "Stock actualizado correctamente" });
  } catch (error) {
    console.error("Error al restar stock:", error); // <-- agrega esto
    res.status(500).json({ error: "Error al actualizar stock", detalle: error.message });
  }
});

export default router;