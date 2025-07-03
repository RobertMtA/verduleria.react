// Servicio para manejo de productos con backend local y remoto
const LOCAL_API_URL = "http://localhost:4001/api";
const REMOTE_API_URL = "https://verduleria-backend-m19n.onrender.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";

// Sistema de persistencia local para datos mock
const MOCK_STORAGE_KEY = 'verduleria_mock_productos';
const RESENAS_STORAGE_KEY = 'reseñas_local';

function getStoredMockProducts() {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error al cargar productos mock desde localStorage:', error);
    return null;
  }
}

function storeMockProducts(productos) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(productos));
  } catch (error) {
    console.error('Error al guardar productos mock en localStorage:', error);
  }
}

function getDefaultMockProducts() {
  return [
    {
      id: "mock_001",
      _id: "mock_001", 
      nombre: "Banana",
      descripcion: "Bananas frescas (Por kilo)",
      precio: 5000,
      stock: 88000,
      imagen: "/images/img-banana1.jpg",
      categoria: "Frutas",
      activo: true
    },
    {
      id: "mock_002",
      _id: "mock_002",
      nombre: "Cebolla",
      descripcion: "Cebollas frescas (Por kilo)",
      precio: 3300,
      stock: 4500,
      imagen: "/images/img-cebollas1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_003",
      _id: "mock_003",
      nombre: "Espinaca",
      descripcion: "Espinaca fresca (Por manojo)",
      precio: 2000,
      stock: 25,
      imagen: "/images/img-espinaca1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_004",
      _id: "mock_004",
      nombre: "Lechuga",
      descripcion: "Lechuga fresca (Por kilo)",
      precio: 2500,
      stock: 50,
      imagen: "/images/img-lechuga1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_005",
      _id: "mock_005",
      nombre: "Morrón Rojo",
      descripcion: "Morrón rojo fresco (Por kilo)",
      precio: 5000,
      stock: 1000,
      imagen: "/images/img-morron-rojo1.jpg",
      categoria: "Verduras",
      activo: true
    }
  ];
}

// Intentar conectar con backend (local primero, remoto después)
async function fetchAdminOperation(endpoint, options = {}) {
  // Intentar primero con el backend local
  try {
    console.log(`🔄 Intentando operación ${options.method || 'GET'} en backend local: ${LOCAL_API_URL}${endpoint}`);
    
    const response = await fetch(`${LOCAL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Operación exitosa en backend local`);
      
      return {
        success: true,
        source: 'local-backend',
        ...result
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
  } catch (localError) {
    console.log(`❌ Error en backend local: ${localError.message}`);
    
    // Si el backend local falla, intentar con el backend remoto
    try {
      console.log(`🔄 Intentando operación ${options.method || 'GET'} en backend remoto: ${REMOTE_API_URL}${endpoint}`);
      
      const response = await fetch(`${REMOTE_API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Operación exitosa en backend remoto`);
        
        return {
          success: true,
          source: 'remote-backend',
          ...result
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
    } catch (remoteError) {
      console.log(`❌ Error en backend remoto: ${remoteError.message}`);
      
      // Si ambos backends fallan, lanzar error
      throw new Error(`Backends no disponibles. Local: ${localError.message}, Remoto: ${remoteError.message}`);
    }
  }
}

// Funciones CRUD para productos
export async function createProduct(productData) {
  try {
    // Intentar crear en backend (local o remoto)
    const result = await fetchAdminOperation('/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (result && result.success) {
      console.log(`✅ Producto creado exitosamente en ${result.source}`);
      return result;
    } else {
      throw new Error('Respuesta inválida del backend');
    }
  } catch (error) {
    console.log(`⚠️  Backends no disponibles, usando localStorage: ${error.message}`);
    
    // Fallback a localStorage
    const productos = getStoredMockProducts() || getDefaultMockProducts();
    const newProduct = {
      ...productData,
      _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    productos.push(newProduct);
    storeMockProducts(productos);
    
    return {
      success: true,
      message: 'Producto creado en almacenamiento local',
      producto: newProduct,
      source: 'local-storage'
    };
  }
}

export async function updateProduct(id, productData) {
  try {
    // Intentar actualizar en backend (local o remoto)
    const result = await fetchAdminOperation(`/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (result && result.success) {
      console.log(`✅ Producto actualizado exitosamente en ${result.source}`);
      return result;
    } else {
      throw new Error('Respuesta inválida del backend');
    }
  } catch (error) {
    console.log(`⚠️  Backends no disponibles, usando localStorage: ${error.message}`);
    
    // Fallback a localStorage
    const productos = getStoredMockProducts() || getDefaultMockProducts();
    const index = productos.findIndex(p => p._id === id || p.id === id);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    productos[index] = {
      ...productos[index],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    storeMockProducts(productos);
    
    return {
      success: true,
      message: 'Producto actualizado en almacenamiento local',
      producto: productos[index],
      source: 'local-storage'
    };
  }
}

export async function deleteProduct(id) {
  try {
    // Intentar eliminar en backend (local o remoto)
    const result = await fetchAdminOperation(`/productos/${id}`, {
      method: 'DELETE'
    });
    
    if (result && result.success) {
      console.log(`✅ Producto eliminado exitosamente en ${result.source}`);
      return result;
    } else {
      throw new Error('Respuesta inválida del backend');
    }
  } catch (error) {
    console.log(`⚠️  Backends no disponibles, usando localStorage: ${error.message}`);
    
    // Fallback a localStorage
    const productos = getStoredMockProducts() || getDefaultMockProducts();
    const index = productos.findIndex(p => p._id === id || p.id === id);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    productos.splice(index, 1);
    storeMockProducts(productos);
    
    return {
      success: true,
      message: 'Producto eliminado de almacenamiento local',
      source: 'local-storage'
    };
  }
}

// Función para obtener productos (GET)
export async function getProductos() {
  try {
    // Intentar primero con el backend local
    console.log(`🔄 Intentando obtener productos del backend local: ${LOCAL_API_URL}/productos`);
    
    const localResponse = await fetch(`${LOCAL_API_URL}/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (localResponse.ok) {
      const localData = await localResponse.json();
      console.log(`✅ Productos obtenidos del backend local`);
      
      return {
        success: true,
        source: 'local-backend',
        productos: localData.productos || localData,
        total: (localData.productos || localData).length
      };
    }
  } catch (localError) {
    console.log(`❌ Backend local no disponible: ${localError.message}`);
  }

  // Si el backend local falla, intentar con el remoto via proxy
  try {
    console.log(`🔄 Intentando con backend remoto via proxy...`);
    
    const encodedUrl = encodeURIComponent(`${REMOTE_API_URL}/productos`);
    const proxyRequestUrl = `${PROXY_URL}${encodedUrl}`;
    
    const response = await fetch(proxyRequestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const proxyData = await response.json();
      
      if (proxyData.contents) {
        try {
          const actualData = JSON.parse(proxyData.contents);
          console.log(`✅ Productos obtenidos del backend remoto via proxy`);
          
          return {
            success: true,
            source: 'remote-backend',
            productos: actualData.productos || actualData,
            total: (actualData.productos || actualData).length
          };
        } catch (parseError) {
          throw new Error(`Error parsing remote backend data: ${parseError.message}`);
        }
      } else {
        throw new Error('No data in proxy response');
      }
    }
  } catch (error) {
    console.log(`❌ Backend remoto no disponible: ${error.message}`);
  }

  // Usar datos locales como fallback
  console.log(`🔄 Usando datos locales como fallback...`);
  let stored = getStoredMockProducts();
  if (!stored) {
    const defaultProducts = getDefaultMockProducts();
    storeMockProducts(defaultProducts);
    stored = defaultProducts;
  }
  
  return {
    success: true,
    productos: stored,
    total: stored.length,
    source: 'local-storage'
  };
}

// Exportación por defecto simple
export default {
  getProductos,
  createProduct,
  updateProduct,
  deleteProduct
};
