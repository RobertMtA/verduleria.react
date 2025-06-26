# 🔧 **Conceptos de React Implementados**
## Guía Técnica para la Entrega del Proyecto

---

## 📚 **Conceptos Fundamentales de React**

### 1. **🎯 Componentes Funcionales**
```jsx
// Ejemplo: ProductCard.jsx
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      <p>${product.precio}</p>
      <button onClick={() => onAddToCart(product, quantity)}>
        Agregar al Carrito
      </button>
    </div>
  );
};
```

### 2. **🪝 Hooks Implementados**

#### **useState** - Gestión de Estado Local
```jsx
// En ProductCard.jsx
const [quantity, setQuantity] = useState(1);
const [loading, setLoading] = useState(false);

// En Login.jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
```

#### **useEffect** - Efectos Secundarios
```jsx
// En Products.jsx - Cargar productos al montar
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchProducts();
}, []); // Array vacío = solo al montar

// En Cart.jsx - Persistir carrito en localStorage
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}, [cartItems]); // Se ejecuta cuando cambia cartItems
```

#### **useContext** - Consumo de Contexto
```jsx
// En cualquier componente
const { user, login, logout } = useContext(AuthContext);
const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
```

#### **useNavigate** - Navegación Programática
```jsx
// En Login.jsx - Redireccionar después del login
const navigate = useNavigate();

const handleLogin = async (credentials) => {
  const success = await login(credentials);
  if (success) {
    navigate('/products'); // Redirigir a productos
  }
};
```

#### **useParams** - Parámetros de Ruta
```jsx
// En ProductDetail.jsx
const { id } = useParams();

useEffect(() => {
  const fetchProduct = async () => {
    const response = await fetch(`${API_URL}/productos/${id}`);
    const product = await response.json();
    setProduct(product);
  };
  
  fetchProduct();
}, [id]);
```

### 3. **🎯 Context API - Estado Global**

#### **AuthContext.jsx**
```jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **CartContext.jsx**
```jsx
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.precio * item.quantity), 
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

### 4. **🛣️ React Router DOM**

#### **App.jsx - Configuración de Rutas**
```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
      
      {/* Rutas de admin */}
      <Route path="/admin/*" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      } />
    </Routes>
  );
}
```

#### **Componente de Ruta Protegida**
```jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};
```

### 5. **🎨 Conditional Rendering**

```jsx
// En Header.jsx
const Header = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <nav>
      <Link to="/">Logo</Link>
      
      {/* Renderizado condicional basado en autenticación */}
      {user ? (
        <>
          <span>Hola, {user.nombre}</span>
          <Link to="/perfil">Mi Perfil</Link>
          {user.role === 'admin' && (
            <Link to="/admin">Panel Admin</Link>
          )}
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
};
```

### 6. **📝 Controlled Components - Formularios**

```jsx
// En Login.jsx
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (!success) {
      setError('Credenciales inválidas');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};
```

### 7. **🔄 Lists y Keys**

```jsx
// En ProductList.jsx
const ProductList = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product._id} // Key única para cada elemento
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
};
```

### 8. **⚡ Event Handling**

```jsx
// Diferentes tipos de eventos manejados
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Click events
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  // Change events
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };
  
  // Submit events (en formularios)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío
  };
  
  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        min="1"
      />
      <button onClick={handleAddToCart}>
        Agregar al Carrito
      </button>
    </div>
  );
};
```

### 9. **🎛️ Props y PropTypes**

```jsx
// Pasando props desde padre a hijo
const ProductList = ({ products, onAddToCart, loading }) => {
  if (loading) return <div>Cargando productos...</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          showActions={true}
        />
      ))}
    </div>
  );
};

// Validación de props (opcional pero buena práctica)
ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};
```

### 10. **🔄 Custom Hooks**

#### **useAuth.jsx**
```jsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return context;
};
```

#### **useProducts.jsx**
```jsx
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/productos`);
        
        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
```

---

## 🏆 **Patrones de Diseño Implementados**

### 1. **Provider Pattern (Context API)**
- Provee estado global a toda la aplicación
- Evita prop drilling
- Centraliza lógica de estado

### 2. **Container/Presentational Pattern**
- Separación entre lógica y presentación
- Componentes reutilizables
- Fácil testing

### 3. **Custom Hooks Pattern**
- Reutilización de lógica entre componentes
- Abstracción de efectos complejos
- Código más limpio y mantenible

### 4. **Higher-Order Component (HOC)**
```jsx
const withAuth = (Component) => {
  return (props) => {
    const { user } = useAuth();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};

// Uso
const ProtectedPage = withAuth(MyComponent);
```

---

## 🎯 **Ciclo de Vida de Componentes (con Hooks)**

### **Montaje (Mount)**
```jsx
useEffect(() => {
  // Se ejecuta después de que el componente se monta
  console.log('Componente montado');
  
  // Simular componentDidMount
  fetchData();
}, []); // Array vacío = solo al montar
```

### **Actualización (Update)**
```jsx
useEffect(() => {
  // Se ejecuta cada vez que 'dependency' cambia
  console.log('Dependency cambió');
}, [dependency]);
```

### **Desmontaje (Unmount)**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    // Alguna lógica
  }, 1000);
  
  // Cleanup function (simula componentWillUnmount)
  return () => {
    clearInterval(timer);
  };
}, []);
```

---

## 📊 **Gestión de Estado en la Aplicación**

### **Estado Local (useState)**
- Estados específicos del componente
- Formularios
- Toggles y flags temporales

### **Estado Global (Context API)**
- Autenticación de usuario
- Carrito de compras
- Configuraciones globales

### **Estado del Servidor**
- Datos de productos (fetch desde API)
- Información de pedidos
- Datos de usuarios (admin)

---

## 🚀 **Optimizaciones Implementadas**

### **React.memo**
```jsx
const ProductCard = React.memo(({ product, onAddToCart }) => {
  // Solo se re-renderiza si las props cambian
  return (
    <div>
      {/* Contenido del componente */}
    </div>
  );
});
```

### **useMemo**
```jsx
const ExpensiveComponent = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {expensiveValue}</div>;
};
```

### **useCallback**
```jsx
const ProductList = ({ products }) => {
  const handleAddToCart = useCallback((product, quantity) => {
    // Función memoizada
    addToCart(product, quantity);
  }, [addToCart]);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
```

---

## ✅ **Checklist de Conceptos de React Implementados**

- ✅ **Componentes Funcionales**
- ✅ **JSX y Templates**
- ✅ **Props y PropTypes**
- ✅ **Estado con useState**
- ✅ **Efectos con useEffect**
- ✅ **Context API**
- ✅ **Custom Hooks**
- ✅ **React Router DOM**
- ✅ **Conditional Rendering**
- ✅ **Lists y Keys**
- ✅ **Event Handling**
- ✅ **Controlled Components**
- ✅ **Form Handling**
- ✅ **API Integration**
- ✅ **Error Boundaries**
- ✅ **Code Splitting**
- ✅ **Performance Optimization**

---

Esta documentación demuestra el dominio completo de React y sus conceptos fundamentales aplicados en un proyecto real y funcional.
