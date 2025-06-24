import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NuevoProducto.css";

const NuevoProducto = () => {
  // Configuración inicial
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost/api"; // <-- CORREGIDO para Vite
  const navigate = useNavigate();
  
  // Estados
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: "",
    descripcion: "",
    imagen: ""
  });
  
  const [errores, setErrores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");

  // Categorías disponibles
  const categorias = [
    "Frutas",
    "Verduras",
    "Lácteos",
    "Carnes",
    "Panadería",
    "Bebidas",
    "Otros"
  ];

  // Obtener productos
  const fetchProductos = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/productos.php`);
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProducts(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real para campos numéricos
    if ((name === "precio" || name === "stock") && isNaN(value) && value !== "") {
      return;
    }
    
    setProducto(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando se escribe
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validación del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!producto.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    else if (producto.nombre.length < 3) nuevosErrores.nombre = "Mínimo 3 caracteres";
    
    if (!producto.precio) nuevosErrores.precio = "El precio es obligatorio";
    else if (parseFloat(producto.precio) <= 0) nuevosErrores.precio = "Debe ser mayor a 0";
    
    if (!producto.stock) nuevosErrores.stock = "El stock es obligatorio";
    else if (parseInt(producto.stock) < 0) nuevosErrores.stock = "No puede ser negativo";
    
    if (!producto.categoria) nuevosErrores.categoria = "La categoría es obligatoria";
    
    if (!producto.descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria";
    else if (producto.descripcion.length < 10) nuevosErrores.descripcion = "Mínimo 10 caracteres";
    
    if (producto.imagen && !producto.imagen.startsWith('/images/') && !/^https?:\/\//.test(producto.imagen)) {
      nuevosErrores.imagen = "Debe comenzar con /images/ o ser una URL válida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Seleccionar producto para editar
  const handleEdit = (prod) => {
    setProducto({
      nombre: prod.nombre,
      precio: prod.precio,
      stock: prod.stock,
      categoria: prod.categoria,
      descripcion: prod.descripcion,
      imagen: prod.imagen || ""
    });
    setEditId(prod.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar edición
  const handleCancel = () => {
    setProducto({
      nombre: "",
      precio: "",
      stock: "",
      categoria: "",
      descripcion: "",
      imagen: ""
    });
    setEditId(null);
    setErrores({});
  };

  // Guardar producto (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setIsSubmitting(true);

    try {
      const url = editId
        ? `${API_URL}/productos.php?id=${editId}`
        : `${API_URL}/productos.php`;
      const method = editId ? "PUT" : "POST";
      
      const productoData = {
        nombre: producto.nombre.trim(),
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock),
        categoria: producto.categoria,
        descripcion: producto.descripcion.trim(),
        imagen: producto.imagen.trim() || null
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar producto");
      }

      setSuccessMessage(editId ? "Producto actualizado correctamente" : "Producto creado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Actualizar lista de productos
      await fetchProductos();
      handleCancel();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar y paginar productos
  const productosArray = Array.isArray(products) ? products : [];
  const filteredProducts = products.filter(prod => 
    prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="product-management-container">
      <h2>{editId ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre*</label>
            <input
              id="nombre"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
              className={errores.nombre ? "error" : ""}
              placeholder="Ej: Manzanas"
            />
            {errores.nombre && <span className="error-message">{errores.nombre}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="precio">Precio ($)*</label>
            <input
              id="precio"
              type="number"
              name="precio"
              min="0.01"
              step="0.01"
              value={producto.precio}
              onChange={handleChange}
              className={errores.precio ? "error" : ""}
              placeholder="Ej: 2.99"
            />
            {errores.precio && <span className="error-message">{errores.precio}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">Stock*</label>
            <input
              id="stock"
              type="number"
              name="stock"
              min="0"
              value={producto.stock}
              onChange={handleChange}
              className={errores.stock ? "error" : ""}
              placeholder="Ej: 50"
            />
            {errores.stock && <span className="error-message">{errores.stock}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="categoria">Categoría*</label>
            <select
              id="categoria"
              name="categoria"
              value={producto.categoria}
              onChange={handleChange}
              className={errores.categoria ? "error" : ""}
            >
              <option value="">Seleccione...</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errores.categoria && <span className="error-message">{errores.categoria}</span>}
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="descripcion">Descripción*</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
              rows="4"
              className={errores.descripcion ? "error" : ""}
              placeholder="Descripción detallada del producto..."
            />
            {errores.descripcion && <span className="error-message">{errores.descripcion}</span>}
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="imagen">URL de la Imagen</label>
            <input
              id="imagen"
              type="text"
              name="imagen"
              value={producto.imagen}
              onChange={handleChange}
              placeholder="/images/img-tomate1.jpg o https://ejemplo.com/imagen.jpg"
              className={errores.imagen ? "error" : ""}
            />
            {errores.imagen && <span className="error-message">{errores.imagen}</span>}
            <small className="input-hint">
              Usar <code>/images/nombre.jpg</code> para imágenes locales o URL completa para imágenes externas
            </small>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {editId ? "Actualizando..." : "Creando..."}
              </>
            ) : editId ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </div>
      </form>

      {/* Lista de productos */}
      <div className="products-list-section">
        <div className="list-header">
          <h3>Productos Existentes</h3>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.nombre}</td>
                    <td>${Number(prod.precio).toFixed(2)}</td>
                    <td>{prod.stock}</td>
                    <td>{prod.categoria}</td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(prod)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              
              <span>Página {currentPage} de {totalPages}</span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevoProducto;