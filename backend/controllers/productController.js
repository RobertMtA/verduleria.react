import { MongoClient, ObjectId } from "mongodb";

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

// Función para obtener la colección y el cliente
async function getCollection() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return { collection: client.db(dbName).collection("productos"), client };
}

const productController = {
  // Obtener todos los productos
  getAllProducts: async (req, res) => {
    try {
      const { collection, client } = await getCollection();
      const productos = await collection.find().toArray();
      await client.close();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos" });
    }
  },

  // Obtener un producto por ID
  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const { collection, client } = await getCollection();
      const producto = await collection.findOne({ _id: new ObjectId(id) });
      await client.close();
      if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto" });
    }
  }
};

export default productController;