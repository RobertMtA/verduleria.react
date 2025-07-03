import { useState, useEffect } from "react";
import corsProxyService from "../services/corsProxyService.js";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Cargando productos con corsProxyService...');
      
      // Usar el servicio proxy temporal
      const data = await corsProxyService.getProductos();
      
      console.log('✅ Productos recibidos:', data);
      
      let productos = [];
      
      // Manejar diferentes formatos de respuesta
      if (data && data.success && data.productos && Array.isArray(data.productos)) {
        // Formato: {success: true, productos: [...]}
        productos = data.productos;
      } else if (Array.isArray(data)) {
        // Formato: array directo [...]
        productos = data;
      } else if (data && data.productos && Array.isArray(data.productos)) {
        // Formato: {productos: [...]} sin success
        productos = data.productos;
      } else if (data && data.data && Array.isArray(data.data)) {
        // Formato: {data: [...]}
        productos = data.data;
      } else {
        console.warn('⚠️ Formato de respuesta no esperado, usando array vacío:', data);
        productos = []; // No lanzar error, simplemente usar array vacío
      }
      
      // Asegurar que los productos tengan formato numérico correcto
      const productosNumericos = productos.map((p) => ({
        ...p,
        id: p.id || p._id, // Asegurar que siempre haya un ID
        precio: Number(p.precio),
        stock: Number(p.stock),
      }));

      setProducts(productosNumericos);
      setPagination(prev => ({
        ...prev,
        total: data.total || productos.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil((data.total || productos.length) / limit)
      }));
      
      console.log(`✅ ${productosNumericos.length} productos cargados exitosamente`);
      
    } catch (err) {
      setError(err.message || "Error de conexión");
      console.error("❌ Error fetching products:", err);
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
