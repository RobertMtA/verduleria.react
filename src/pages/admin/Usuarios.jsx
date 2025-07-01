import React, { useEffect, useState } from 'react';
import './Usuarios.css';
import FormularioNuevoUsuario from './FormularioNuevoUsuario';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const Usuarios = () => {
  const { user } = useAuth() || {};
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }
        const data = await response.json();
        setUsuarios(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [API_URL]);

  // Filtrar usuarios según término de búsqueda
  const filteredUsers = usuarios.filter(u => u && u.nombre && u.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok && (data.success || data.ok)) {
        setUsuarios(usuarios.filter(user => user._id !== userId));
      } else {
        throw new Error(data.error || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddUser = (newUser) => {
    setUsuarios([newUser, ...usuarios]);
    setShowForm(false);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${updatedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      const data = await response.json();
      if (response.ok && (data.success || data.ok)) {
        setUsuarios(usuarios.map(u => u._id === updatedUser._id ? updatedUser : u));
        setEditUser(null);
      } else {
        throw new Error(data.error || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError('Error al actualizar usuario');
    }
  };

  if (loading) {
    return (
      <div className="usuarios-loading">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="usuarios-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  const nombre = user?.nombre || "";

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Administración de Usuarios</h2>
        <div className="usuarios-actions">
          <input
            id="search-users"
            name="search"
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <button 
            className="add-user-btn"
            onClick={() => setShowForm(true)}
          >
            + Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`user-role ${user.role?.toLowerCase()}`}>
                      {user.role || 'Usuario'}
                    </span>
                  </td>
                  <td>{user.creado_en ? new Date(user.creado_en).toLocaleDateString() : ''}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario de edición */}
      {editUser && (
        <FormularioNuevoUsuario
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserAdded={handleUpdateUser}
          isEdit
        />
      )}

      {filteredUsers.length > usersPerPage && (
        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}

      {showForm && (
        <FormularioNuevoUsuario 
          onClose={() => setShowForm(false)}
          onUserAdded={handleAddUser}
        />
      )}
    </div>
  );
};

export default Usuarios;