import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = () => {
    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Email no es válido";
    }

    if (!password) {
      validationErrors.password = "Contraseña es requerida";
    } else if (password.length < 6) {
      validationErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const text = await response.text();
      
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        setErrors({
          form: "Respuesta inválida del servidor. Intente nuevamente.",
        });
        setIsLoading(false);
        return;
      }
      if (data.success) {
        login({
          id: data.user.id,
          nombre: data.user.nombre,
          email: data.user.email,
          telefono: data.user.telefono || "",
          direccion: data.user.direccion || "",
          role: data.user.role || "user",
        });

        const redirectPath = location.state?.from?.pathname ||
          (data.user.role === "admin" ? "/admin" : "/");
        navigate(redirectPath, { replace: true });

      } else {
        setErrors({
          form: data.error || data.message || "Error al iniciar sesión. Intente nuevamente.",
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({
        form: error.message || "Error al iniciar sesión. Intente nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        {errors.form && (
          <div className="alert alert-danger" role="alert">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              aria-describedby="emailHelp"
            />
            {errors.email && (
              <div className="invalid-feedback" id="emailHelp">
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                aria-describedby="passwordHelp"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback" id="passwordHelp">
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Cargando...</span>
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>

          <div className="login-links">
            <Link 
              to="/forgot-password" 
              className="login-link"
              state={{ from: location.state?.from }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <span className="separator" aria-hidden="true">|</span>
            <Link 
              to="/registro" 
              className="login-link"
              state={{ from: location.state?.from }}
            >
              Crear una cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;