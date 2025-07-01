import { useState, useEffect } from "react";

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

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4001/api";
      // Si tu backend implementa paginación, puedes agregar ?page=...&limit=...
      const response = await fetch(`${apiUrl}/productos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Si tu backend devuelve un array simple:
      const productosNumericos = Array.isArray(data)
        ? data.map((p) => ({
            ...p,
            id: p.id || p._id, // Asegurar que siempre haya un ID
            precio: Number(p.precio),
            stock: Number(p.stock),
          }))
        : [];

      setProducts(productosNumericos);
      setPagination(data.pagination || { 
        total: 0, 
        page, 
        limit, 
        totalPages: 1 
      });
    } catch (err) {
      setError(err.message || "Error de conexión");
      console.error("Error fetching products:", err);
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