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

      const response = await fetch(
        `http://localhost/api/productos.php?page=${page}&limit=${limit}`
      );

      // Si la respuesta es 304, no hay cuerpo, así que no intentes leer JSON
      if (response.status === 304) {
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta no es JSON");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Error al cargar productos");
      }

      const productosNumericos = Array.isArray(data.data)
        ? data.data.map((p) => ({
            ...p,
            precio: Number(p.precio),
            stock: Number(p.stock),
          }))
        : [];

      setProducts(productosNumericos);
      setPagination(data.pagination || { total: 0, page, limit, totalPages: 1 });
    } catch (err) {
      setProducts([]); // <-- Siempre deja products como array
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
    loading,
    error,
    pagination, // <-- ¡devuelve pagination!
    fetchProducts,
  };
};

export default useProducts;