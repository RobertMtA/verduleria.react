import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar la carga inicial

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user'); // Limpia el dato corrupto
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData debe ser un objeto con las propiedades del usuario
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('rol', userData.role || userData.rol || 'user');
    // Si tienes un token, guárdalo así:
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para verificar si el usuario es admin
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.rol === 'admin');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser,
        isAuthenticated, 
        login, 
        logout, 
        loading,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
