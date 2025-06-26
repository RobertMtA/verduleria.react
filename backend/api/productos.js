import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const router = express.Router();

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

// Función para obtener la colección y el cliente
async function getCollection() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return { collection: client.db(dbName).collection("productos"), client };
}

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const { collection, client } = await getCollection();
    const productos = await collection.find().toArray();
    await client.close();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos", detalle: error.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { collection, client } = await getCollection();
    const producto = await collection.findOne({ _id: new ObjectId(req.params.id) });
    await client.close();
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto", detalle: error.message });
  }
});

// Crear producto
router.post("/", async (req, res) => {
  let { nombre, descripcion, precio, stock, categoria, activo, image } = req.body;
  if (!nombre || !descripcion || precio == null || stock == null) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  precio = Number(precio);
  stock = Number(stock);
  activo = activo !== false; // Por defecto true si no se especifica
  categoria = categoria || "Otros"; // Por defecto "Otros" si no se especifica
  
  try {
    const { collection, client } = await getCollection();
    const result = await collection.insertOne({ 
      nombre, 
      descripcion, 
      precio, 
      stock, 
      categoria,
      activo,
      image 
    });
    await client.close();
    res.json({ 
      success: true,
      message: "Producto creado correctamente", 
      id: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error al crear producto", 
      detalle: error.message 
    });
  }
});

// Editar producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { nombre, descripcion, precio, stock, categoria, activo, image } = req.body;
  if (!nombre || !descripcion || precio == null || stock == null) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  precio = Number(precio);
  stock = Number(stock);
  activo = activo !== false; // Por defecto true si no se especifica
  categoria = categoria || "Otros"; // Por defecto "Otros" si no se especifica
  
  try {
    const { collection, client } = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 
        nombre, 
        descripcion, 
        precio, 
        stock, 
        categoria,
        activo,
        image 
      }}
    );
    await client.close();
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Producto no encontrado" 
      });
    }
    res.json({ 
      success: true,
      message: "Producto actualizado correctamente" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error al actualizar producto", 
      detalle: error.message 
    });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { collection, client } = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    await client.close();
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Producto no encontrado" 
      });
    }
    res.json({ 
      success: true,
      message: "Producto eliminado correctamente" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar producto", 
      detalle: error.message 
    });
  }
});

// Restar stock al comprar
router.post("/restar-stock", async (req, res) => {
  const { id, cantidad } = req.body;
  if (!id || !cantidad) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  try {
    const { collection, client } = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id), stock: { $gte: cantidad } },
      { $inc: { stock: -cantidad } }
    );
    await client.close();
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Stock insuficiente o producto no encontrado" });
    }
    res.json({ mensaje: "Stock actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar stock", detalle: error.message });
  }
});

export default router;