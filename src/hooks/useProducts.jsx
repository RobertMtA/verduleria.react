import { useState, useEffect } from "react";
import corsProxyService from "../services/corsProxyService.js";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100, // Cambiar a 100 para cargar todos los productos
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (page = 1, limit = 100) => {
    try {
      setLoading(true);
      setError(null);

      const data = await corsProxyService.getProductos();
      
      let productos = [];
      
      // Manejar diferentes formatos de respuesta
      if (data && data.success && data.productos && Array.isArray(data.productos)) {
        productos = data.productos;
      } else if (Array.isArray(data)) {
        productos = data;
      } else if (data && data.productos && Array.isArray(data.productos)) {
        productos = data.productos;
      } else if (data && data.data && Array.isArray(data.data)) {
        productos = data.data;
      } else {
        productos = [];
      }
      
      // Asegurar que los productos tengan formato numérico correcto
      const productosNumericos = productos.map((p) => ({
        ...p,
        precio: Number(p.precio),
        stock: Number(p.stock),
        _id: p._id,
        id: p.id || p._id
      }));

      setProducts(productosNumericos);
      setPagination(prev => ({
        ...prev,
        total: data.total || productos.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil((data.total || productos.length) / limit)
      }));
      
    } catch (err) {
      setError(err.message || "Error de conexión");
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
    pagination,
    fetchProducts,
    reloadProducts: fetchProducts, // Alias para mejor compatibilidad
    refetch: fetchProducts // Alias para mejor semántica
  };
};

export default useProducts;
