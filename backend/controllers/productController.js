const productController = {
  getAllProducts: (req, res) => {
    res.json([{ id: 1, nombre: "Manzana", precio: 100 }]);
  },
  getProductById: (req, res) => {
    const { id } = req.params;
    res.json({ id, nombre: "Manzana", precio: 100 });
  }
};

export default productController;