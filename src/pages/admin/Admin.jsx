import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import FormularioProducto from "../components/FormularioProducto";
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || "https://verduleria-backend-m19n.onrender.com/api";

const Admin = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [estadisticas, setEstadisticas] = useState({
        ventasTotales: 0,
        pedidosPendientes: 0,
        productosActivos: 0,
        clientesRegistrados: 0
    });

    // Obtener productos
    const fetchProductos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/productos`);
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            const data = await response.json();
            // MongoDB: los productos tienen _id, no id
            setProductos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Obtener estadísticas reales (ajusta la ruta si tienes endpoint en Node)
    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const response = await fetch(`${API_URL}/reportes`);
                if (!response.ok) throw new Error("Error al cargar estadísticas");
                const data = await response.json();
                // Ajusta según la estructura de tu endpoint de reportes
                setEstadisticas({
                    ventasTotales: data?.reduce?.((acc, r) => acc + (r.ventas || 0), 0) || 0,
                    pedidosPendientes: 0, // Implementa si tienes endpoint de pedidos pendientes
                    productosActivos: productos.length,
                    clientesRegistrados: 0 // Implementa si tienes endpoint de usuarios
                });
            } catch (err) {
                console.error("Error estadísticas:", err);
            }
        };
        fetchEstadisticas();
        // eslint-disable-next-line
    }, [productos.length]);

    // Manejar operaciones CRUD
    const handleAddProduct = async (producto) => {
        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al agregar producto');
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Error al agregar producto');
            }

            setSuccessMessage('Producto agregado correctamente');
            setIsFormOpen(false);
            await fetchProductos();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            const productId = editingProduct._id;
            const response = await fetch(`${API_URL}/productos/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al actualizar producto');
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Error al actualizar producto');
            }

            setSuccessMessage('Producto actualizado correctamente');
            setEditingProduct(null);
            setIsFormOpen(false);
            await fetchProductos();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const response = await fetch(`${API_URL}/productos/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al eliminar producto');
            }

            setSuccessMessage('Producto eliminado correctamente');
            await fetchProductos();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <ul className="admin-nav-list">
                    <li className="admin-nav-item">
                        <button className="admin-nav-button">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Cerrar sesión</span>
                        </button>
                    </li>
                    <li className="admin-nav-item">
                        <a href="/admin" className="admin-nav-link">Admin</a>
                    </li>
                </ul>
            </nav>

            <h1 className="admin-title">Panel Administrativo</h1>

            {/* RESUMEN DE ESTADÍSTICAS */}
            <div className="admin-summary">
                <div className="admin-summary-item">
                    <span className="admin-summary-title">Ventas Totales</span>
                    <span className="admin-summary-value">${estadisticas.ventasTotales}</span>
                </div>
                <div className="admin-summary-item">
                    <span className="admin-summary-title">Pedidos Pendientes</span>
                    <span className="admin-summary-value">{estadisticas.pedidosPendientes}</span>
                    <a href="/admin/pedidos" className="admin-summary-link">Ver pedidos</a>
                </div>
                <div className="admin-summary-item">
                    <span className="admin-summary-title">Productos Activos</span>
                    <span className="admin-summary-value">{estadisticas.productosActivos}</span>
                    <a href="/admin" className="admin-summary-link">Gestionar productos</a>
                </div>
                <div className="admin-summary-item">
                    <span className="admin-summary-title">Clientes Registrados</span>
                    <span className="admin-summary-value">{estadisticas.clientesRegistrados}</span>
                </div>
            </div>

            {successMessage && (
                <div className="admin-alert success">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="admin-alert error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-loading">
                    <p>Cargando productos...</p>
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    <button 
                        onClick={() => {
                            setEditingProduct(null);
                            setIsFormOpen(true);
                        }} 
                        className="admin-add-button"
                    >
                        <i className="fa-solid fa-plus"></i> Agregar producto nuevo
                    </button>

                    <ul className="admin-product-list">
                        {productos.map((product) => {
                            // Procesar URL de imagen correctamente
                            const getImageUrl = (imagePath) => {
                                if (!imagePath) return "/images/no-image.jpg";
                                if (imagePath.startsWith('http')) return imagePath;
                                if (imagePath.startsWith('/images/')) {
                                    return `https://verduleria-backend-m19n.onrender.com${imagePath}`;
                                }
                                return `https://verduleria-backend-m19n.onrender.com/images/${imagePath}`;
                            };

                            return (
                                <li key={product._id} className="admin-product-item">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.nombre}
                                        className="admin-product-image"
                                        onError={e => { e.target.src = "/images/no-image.jpg"; }}
                                    />
                                    <div className="admin-product-info">
                                        <span className="admin-product-name">{product.nombre}</span>
                                        <span className="admin-product-price">${Number(product.precio).toFixed(2)}</span>
                                    </div>
                                    <div className="admin-product-actions">
                                    <button 
                                        onClick={() => handleEditClick(product)}
                                        className="admin-edit-button"
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i> Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="admin-delete-button"
                                    >
                                        <i className="fa-solid fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </li>
                        );
                        })}
                    </ul>
                </>
            )}

            {isFormOpen && (
                <FormularioProducto 
                    product={editingProduct}
                    onAdd={handleAddProduct}
                    onUpdate={handleUpdateProduct}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
};

Admin.propTypes = {
    // Agrega PropTypes si este componente recibe props
};

export default Admin;
