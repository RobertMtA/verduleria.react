import { MongoClient, ObjectId } from "mongodb";

const mongoUri = "mongodb+srv://Verduleria:Prueba1234@cluster0.lzugghn.mongodb.net/verduleria?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "verduleria";

// Función para obtener la colección y el cliente
async function getCollection() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return { collection: client.db(dbName).collection("pedidos"), client };
}

const orderController = {
  // Obtener todos los pedidos
  getAllOrders: async (req, res) => {
    try {
      const { collection, client } = await getCollection();
      const pedidos = await collection.find().toArray();
      await client.close();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedidos" });
    }
  },

  // Obtener un pedido por ID
  getOrderById: async (req, res) => {
    const { id } = req.params;
    try {
      const { collection, client } = await getCollection();
      const pedido = await collection.findOne({ _id: new ObjectId(id) });
      await client.close();
      if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedido" });
    }
  },

  // Crear un pedido
  createOrder: async (req, res) => {
    const { usuario, productos, total } = req.body;
    if (!usuario || !productos || !total) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    try {
      const { collection, client } = await getCollection();
      const result = await collection.insertOne({
        usuario,
        productos,
        total,
        estado: "pendiente",
        fecha: new Date()
      });
      await client.close();
      res.status(201).json({ id: result.insertedId, usuario, productos, total, estado: "pendiente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear pedido" });
    }
  },

  // Actualizar el estado de un pedido
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      const { collection, client } = await getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { estado } }
      );
      await client.close();
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.json({ id, estado });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar pedido" });
    }
  },

  // Eliminar un pedido
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const { collection, client } = await getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      await client.close();
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.json({ message: `Pedido ${id} eliminado` });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar pedido" });
    }
  }
};

export default orderController;