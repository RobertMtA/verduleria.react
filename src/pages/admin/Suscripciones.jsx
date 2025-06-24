import React, { useEffect, useState } from "react";
import "./Suscripciones.css";

const Suscripciones = () => {
  // Estado de la lista de suscriptores
  const [listaSuscriptores, setListaSuscriptores] = useState([]);
  // Estado de carga
  const [cargando, setCargando] = useState(true);
  // Estado de error general
  const [errorGeneral, setErrorGeneral] = useState(null);
  // Estado del término de búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // Estado del email nuevo a suscribir
  const [emailNuevo, setEmailNuevo] = useState("");
  // Estado para mostrar/ocultar el formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Estado de error del formulario
  const [errorFormulario, setErrorFormulario] = useState("");

  // Obtener la lista de suscriptores desde la API
  const obtenerListaSuscriptores = async () => {
    try {
      setCargando(true);
      setErrorGeneral(null);
      const respuesta = await fetch("http://localhost/api/suscriptores.php");
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al cargar suscriptores");
      }
      const data = await respuesta.json();
      setListaSuscriptores(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorGeneral(err.message || "Error al obtener suscriptores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerListaSuscriptores();
  }, []);

  // Manejar el envío del formulario de nueva suscripción
  const manejarEnvioSuscripcion = async (e) => {
    e.preventDefault();

    if (!emailNuevo || !validarEmail(emailNuevo)) {
      setErrorFormulario("Por favor ingrese un email válido");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost/api/suscriptores.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNuevo })
      });

      const data = await respuesta.json();

      if (!respuesta.ok || !data.success) {
        throw new Error(data.error || "Error al suscribirse");
      }

      if (data.data) {
        setListaSuscriptores([data.data, ...listaSuscriptores]);
      }
      setEmailNuevo("");
      setMostrarFormulario(false);
      setErrorFormulario("");
    } catch (err) {
      setErrorFormulario(err.message || "Hubo un error al suscribirse");
    }
  };

  // Validar formato de email
  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Filtrar suscriptores por término de búsqueda
  const suscriptoresFiltrados = listaSuscriptores.filter(suscriptor =>
    suscriptor.email.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  // Formatear fecha a formato legible
  const formatearFecha = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Manejar eliminación de suscriptor (debes implementar handleDelete)
  const manejarEliminarSuscriptor = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este suscriptor?")) return;
    try {
      const respuesta = await fetch(`http://localhost/api/suscriptores.php?id=${id}`, {
        method: "DELETE"
      });
      const data = await respuesta.json();
      if (!respuesta.ok || !data.success) {
        throw new Error(data.error || "No se pudo eliminar el suscriptor");
      }
      // Elimina el suscriptor de la lista localmente
      setListaSuscriptores(listaSuscriptores.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar suscriptor");
    }
  };

  if (cargando) return <p className="loading-message">Cargando suscriptores...</p>;
  if (errorGeneral) return <p className="error-message">Error: {errorGeneral}</p>;

  return (
    <div className="suscriptores-container">
      <h2>Suscriptores al Newsletter</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Buscar por email..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="search-input"
        />

        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="add-button"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo Suscriptor'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={manejarEnvioSuscripcion} className="subscribe-form">
          <input
            type="email"
            placeholder="Ingrese email"
            value={emailNuevo}
            onChange={(e) => setEmailNuevo(e.target.value)}
            className="email-input"
          />
          <button type="submit" className="submit-button">Suscribir</button>
          {errorFormulario && <p className="form-error">{errorFormulario}</p>}
        </form>
      )}

      <p className="results-count">
        {suscriptoresFiltrados.length} suscriptores encontrados
      </p>

      {suscriptoresFiltrados.length === 0 ? (
        <p className="empty-message">
          {terminoBusqueda ?
            "No se encontraron suscriptores con ese email" :
            "No hay suscriptores registrados."}
        </p>
      ) : (
        <table className="suscriptores-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Fecha de suscripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suscriptoresFiltrados.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td>{formatearFecha(s.fecha_suscripcion)}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => manejarEliminarSuscriptor(s.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Suscripciones;