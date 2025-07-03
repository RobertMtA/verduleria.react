import React, { useState, useEffect } from 'react';
import './FormularioProducto.css';

function FormularioProducto({ product, onAdd, onUpdate, onClose }) {
    const [producto, setProducto] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        stock: '',
        categoria: '',
        activo: true
    });
    const [errores, setErrores] = useState({});
    
    const categorias = [
        "Frutas",
        "Verduras",
        "Lácteos",
        "Carnes",
        "Panadería",
        "Bebidas",
        "Otros"
    ];

    // Efecto para cargar los datos del producto cuando se edita
    useEffect(() => {
        if (product) {
            setProducto({
                nombre: product.nombre || '',
                precio: product.precio || '',
                descripcion: product.descripcion || '',
                stock: product.stock || '',
                categoria: product.categoria || '',
                activo: product.activo !== false
            });
        } else {
            // Limpiar formulario para nuevo producto
            setProducto({
                nombre: '',
                precio: '',
                descripcion: '',
                stock: '',
                categoria: '',
                activo: true
            });
        }
        setErrores({});
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProducto({ ...producto, [name]: type === 'checkbox' ? checked : value });
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        
        if (!producto.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio.';
        } else if (producto.nombre.length < 3) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
        }
        
        if (!producto.precio || producto.precio <= 0) {
            nuevosErrores.precio = 'El precio debe ser mayor a 0.';
        }
        
        if (!producto.descripcion.trim()) {
            nuevosErrores.descripcion = 'La descripción es obligatoria.';
        } else if (producto.descripcion.length < 10) {
            nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres.';
        }
        
        if (!producto.stock || parseInt(producto.stock) < 0) {
            nuevosErrores.stock = 'El stock debe ser mayor o igual a 0.';
        }
        
        if (!producto.categoria) {
            nuevosErrores.categoria = 'Debe seleccionar una categoría.';
        }
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarFormulario()) {
            return;
        }
        
        const productoData = {
            ...producto,
            precio: parseFloat(producto.precio),
            stock: parseInt(producto.stock)
        };
        
        if (product) {
            // Editar producto existente
            onUpdate(productoData);
        } else {
            // Agregar nuevo producto
            onAdd(productoData);
        }
    };

    return (
        <div className="formulario-producto-overlay">
            <div className="formulario-producto-modal">
                <form onSubmit={handleSubmit}>
                    <div className="formulario-header">
                        <h2>{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
                        <button type="button" onClick={onClose} className="close-button">×</button>
                    </div>
                    
                    <div className="formulario-body">
                        <div className="form-group">
                            <label htmlFor="form-nombre">Nombre:</label>
                            <input
                                id="form-nombre"
                                type="text" 
                                name="nombre" 
                                value={producto.nombre} 
                                onChange={handleChange} 
                                required 
                                className={errores.nombre ? 'error' : ''}
                            />
                            {errores.nombre && <span className="error-message">{errores.nombre}</span>}
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="form-precio">Precio ($):</label>
                                <input 
                                    id="form-precio"
                                    type="number" 
                                    name="precio" 
                                    value={producto.precio} 
                                    onChange={handleChange} 
                                    required
                                    min="0"
                                    step="0.01"
                                    className={errores.precio ? 'error' : ''}
                                />
                                {errores.precio && <span className="error-message">{errores.precio}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="form-stock">Stock:</label>
                                <input 
                                    id="form-stock"
                                    type="number" 
                                    name="stock" 
                                    value={producto.stock} 
                                    onChange={handleChange} 
                                    required
                                    min="0"
                                    className={errores.stock ? 'error' : ''}
                                />
                                {errores.stock && <span className="error-message">{errores.stock}</span>}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="form-categoria">Categoría:</label>
                            <select
                                id="form-categoria"
                                name="categoria"
                                value={producto.categoria}
                                onChange={handleChange}
                                required
                                className={errores.categoria ? 'error' : ''}
                            >
                                <option value="">Seleccionar categoría...</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errores.categoria && <span className="error-message">{errores.categoria}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="form-descripcion">Descripción:</label>
                            <textarea
                                id="form-descripcion"
                                name="descripcion"
                                value={producto.descripcion}
                                onChange={handleChange}
                                required
                                rows="4"
                                className={errores.descripcion ? 'error' : ''}
                            />
                            {errores.descripcion && <span className="error-message">{errores.descripcion}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="activo"
                                    checked={producto.activo}
                                    onChange={handleChange}
                                />
                                Producto activo
                            </label>
                        </div>
                    </div>
                    
                    <div className="formulario-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            {product ? 'Actualizar' : 'Agregar'} Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormularioProducto;
