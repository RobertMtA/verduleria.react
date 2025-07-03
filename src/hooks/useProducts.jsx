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
      
      if (data.success && data.productos) {
        // Asegurar que los productos tengan formato numérico correcto
        const productosNumericos = data.productos.map((p) => ({
          ...p,
          id: p.id || p._id, // Asegurar que siempre haya un ID
          precio: Number(p.precio),
          stock: Number(p.stock),
        }));

        setProducts(productosNumericos);
        setPagination(prev => ({
          ...prev,
          total: data.total || data.productos.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil((data.total || data.productos.length) / limit)
        }));
      } else {
        throw new Error('Formato de respuesta inválido');
      }
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
  };
};

export default useProducts;
    pagination,
    fetchProducts,
    reloadProducts: fetchProducts, // Alias para mejor compatibilidad
    refetch: fetchProducts // Alias para mejor semántica
  };
};

export default useProducts;