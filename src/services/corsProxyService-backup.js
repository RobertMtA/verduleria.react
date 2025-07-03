// Servicio temporal para evitar problemas de CORS
// Usa allorigins.win como proxy

const LOCAL_API_URL = "http://localhost:4001/api";
const REMOTE_API_URL = "https://verduleria-backend-m19n.onrender.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";

// Sistema de reseñas local para persistir datos mientras el backend está inactivo
const RESENAS_STORAGE_KEY = 'reseñas_local';

// Sistema de persistencia local para datos mock
const MOCK_STORAGE_KEY = 'verduleria_mock_productos';

// Cargar reseñas desde localStorage
function getLocalResenas() {
  try {
    const stored = localStorage.getItem(RESENAS_STORAGE_KEY);
    const resenas = stored ? JSON.parse(stored) : getInitialMockResenas();
    return resenas;
  } catch (error) {
    return getInitialMockResenas();
  }
}

// Guardar reseñas en localStorage
function saveLocalResenas(resenas) {
  try {
    localStorage.setItem(RESENAS_STORAGE_KEY, JSON.stringify(resenas));
  } catch (error) {
    // Error silencioso
  }
}

// Datos iniciales de reseñas mock
function getInitialMockResenas() {
  return [
    {
      _id: "mock_resena_001",
      usuario: "maria.garcia@email.com",
      nombreUsuario: "María García",
      mensaje: "Excelente calidad de productos y entrega rápida. Las frutas llegaron muy frescas.",
      calificacion: 5,
      fecha: new Date('2024-01-15').toISOString(),
      aprobada: true,
      visible: true
    },
    {
      _id: "mock_resena_002", 
      usuario: "juan.perez@email.com",
      nombreUsuario: "Juan Pérez",
      mensaje: "Buenos precios y variedad. El servicio al cliente es muy atento.",
      calificacion: 4,
      fecha: new Date('2024-01-20').toISOString(),
      aprobada: true,
      visible: true
    },
    {
      _id: "mock_resena_003",
      usuario: "ana.lopez@email.com", 
      nombreUsuario: "Ana López",
      mensaje: "Las verduras siempre están frescas. Recomiendo especialmente las zanahorias.",
      calificacion: 5,
      fecha: new Date('2024-01-25').toISOString(),
      aprobada: false,
      visible: false
    }
  ];
}

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

function updateMockProduct(productId, updatedData) {
  const stored = getStoredMockProducts();
  const productos = stored || getDefaultMockProducts();
  
  const index = productos.findIndex(p => p._id === productId || p.id === productId);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...updatedData };
    storeMockProducts(productos);
    return true;
  }
  return false;
}

function deleteMockProduct(productId) {
  const stored = getStoredMockProducts();
  const productos = stored || getDefaultMockProducts();
  
  const filteredProducts = productos.filter(p => p._id !== productId && p.id !== productId);
  storeMockProducts(filteredProducts);
  return filteredProducts.length < productos.length;
}

function addMockProduct(newProduct) {
  const stored = getStoredMockProducts();
  const productos = stored || getDefaultMockProducts();
  
  const newId = `mock_${Date.now()}`;
  const productToAdd = {
    ...newProduct,
    id: newId,
    _id: newId
  };
  
  productos.push(productToAdd);
  storeMockProducts(productos);
  return productToAdd;
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
    },
    {
      id: "mock_006",
      _id: "mock_006",
      nombre: "Naranja",
      descripcion: "Naranja fresca y jugosa (Por kilo)",
      precio: 2500,
      stock: 1000,
      imagen: "/images/img-naranja1.jpg",
      categoria: "Frutas",
      activo: true
    },
    {
      id: "mock_007",
      _id: "mock_007",
      nombre: "Papa",
      descripcion: "Papas frescas (Por kilo)",
      precio: 2700,
      stock: 1000,
      imagen: "/images/img-papa1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_008",
      _id: "mock_008",
      nombre: "Pera",
      descripcion: "Peras frescas (Por kilo)",
      precio: 6000,
      stock: 1000,
      imagen: "/images/img-pera1.jpg",
      categoria: "Frutas",
      activo: true
    },
    {
      id: "mock_009",
      _id: "mock_009",
      nombre: "Zanahoria",
      descripcion: "Zanahorias frescas (Por kilo)",
      precio: 2000,
      stock: 1000,
      imagen: "/images/img-zanahoria1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_010",
      _id: "mock_010",
      nombre: "Zapallo",
      descripcion: "Zapallo fresco (Por unidad)",
      precio: 2000,
      stock: 11,
      imagen: "/images/img-zapallo-verde1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_011",
      _id: "mock_011",
      nombre: "Perejil",
      descripcion: "Perejil fresco (por kilo)",
      precio: 3000,
      stock: 34,
      imagen: "/images/img-perejil1.jpg",
      categoria: "Verduras",
      activo: true
    },
    {
      id: "mock_012",
      _id: "mock_012",
      nombre: "Manzana",
      descripcion: "Manzana roja y fresca (por kilo)",
      precio: 2500,
      stock: 5000,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-pera1.jpg" // Usar pera como similar hasta tener la imagen de manzana
    },
    {
      id: "mock_013",
      _id: "mock_013",
      nombre: "Frutillas",
      descripcion: "Frutillas frescas y dulces (Por kilo)",
      precio: 10000,
      stock: 1000,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-banana1.jpg" // Usar imagen de fruta que existe
    },
    {
      id: "mock_014",
      _id: "mock_014",
      nombre: "Melón",
      descripcion: "Melón fresco y bien dulce (Por kilo)",
      precio: 4600,
      stock: 20,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-pera1.jpg" // Usar imagen de fruta que existe
    },
    {
      id: "mock_015",
      _id: "mock_015",
      nombre: "Repollo",
      descripcion: "Repollo fresco para tu ensalada (Por kilo)",
      precio: 2000,
      stock: 20,
      categoria: "Verduras",
      activo: true,
      imagen: "/images/img-lechuga1.jpg" // Usar imagen que existe
    },
    {
      id: "mock_016",
      _id: "mock_016",
      nombre: "Mandarina",
      descripcion: "Mandarinas ricas y jugosas (Por kilo)",
      precio: 3500,
      stock: 5000,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-naranja1.jpg" // Usar imagen similar que existe
    },
    {
      id: "mock_017",
      _id: "mock_017",
      nombre: "Brócoli",
      descripcion: "Brócoli fresco y nutritivo (Por kilo)",
      precio: 4500,
      stock: 30,
      categoria: "Verduras",
      activo: true,
      imagen: "/images/img-espinaca1.jpg" // Usar imagen similar verde
    },
    {
      id: "mock_018",
      _id: "mock_018",
      nombre: "Apio",
      descripcion: "Apio fresco y crujiente (Por manojo)",
      precio: 1800,
      stock: 25,
      categoria: "Verduras",
      activo: true,
      imagen: "/images/img-perejil1.jpg" // Usar imagen similar de hoja verde
    },
    {
      id: "mock_019",
      _id: "mock_019",
      nombre: "Kiwi",
      descripcion: "Kiwi importado, rico en vitamina C (Por kilo)",
      precio: 8000,
      stock: 15,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-pera1.jpg" // Usar imagen de fruta similar
    },
    {
      id: "mock_020",
      _id: "mock_020",
      nombre: "Acelga",
      descripcion: "Acelga fresca para guisos (Por manojo)",
      precio: 2200,
      stock: 40,
      categoria: "Verduras",
      activo: true,
      imagen: "/images/img-espinaca1.jpg" // Usar imagen de hoja verde
    },
    {
      id: "mock_021",
      _id: "mock_021",
      nombre: "Limón",
      descripcion: "Limones jugosos, perfectos para condimentar (Por kilo)",
      precio: 2800,
      stock: 100,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-naranja1.jpg" // Usar imagen de cítrico similar
    },
    {
      id: "mock_022",
      _id: "mock_022",
      nombre: "Remolacha",
      descripcion: "Remolacha fresca, rica en nutrientes (Por kilo)",
      precio: 3200,
      stock: 25,
      categoria: "Verduras",
      activo: true,
      imagen: "/images/img-tomate1.jpg" // Usar imagen de color similar
    },
    {
      id: "mock_023",
      _id: "mock_023",
      nombre: "Durazno",
      descripcion: "Duraznos dulces y jugosos (Por kilo)",
      precio: 7500,
      stock: 35,
      categoria: "Frutas",
      activo: true,
      imagen: "/images/img-pera1.jpg" // Usar imagen de fruta similar
    },
    {
      id: "mock_024",
      _id: "mock_024",
      nombre: "Coliflor",
      descripcion: "Coliflor fresca y blanca (Por unidad)",
      precio: 3800,
      stock: 20,
      categoria: "Verduras",
      activo: true,
      imagen: "/images/img-zapallo-verde1.jpg" // Usar imagen de verdura similar
    }
  ];
}

async function fetchWithProxy(endpoint, options = {}) {
  // Si es una operación que no es GET (POST, PUT, DELETE), usar función admin directa
  if (options.method && options.method !== 'GET') {
    return await fetchAdminOperation(endpoint, options);
  }

  // Intentar primero con el backend local
  try {
    console.log(`🔄 Intentando conectar con backend local: ${LOCAL_API_URL}${endpoint}`);
    
    const localResponse = await fetch(`${LOCAL_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (localResponse.ok) {
      const localData = await localResponse.json();
      console.log(`✅ Datos obtenidos del backend local`);
      
      return {
        success: true,
        source: 'local-backend',
        ...localData
      };
    }
  } catch (localError) {
    console.log(`❌ Backend local no disponible: ${localError.message}`);
  }

  // Si el backend local falla, intentar con el proxy al backend remoto
  try {
    console.log(`🔄 Intentando con backend remoto via proxy...`);
    
    const encodedUrl = encodeURIComponent(`${REMOTE_API_URL}${endpoint}`);
    const proxyRequestUrl = `${PROXY_URL}${encodedUrl}`;
    
    const response = await fetch(proxyRequestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Proxy response not ok: ${response.status}`);
    }
    
    const proxyData = await response.json();
    
    // allorigins.win devuelve la respuesta en la propiedad 'contents'
    if (proxyData.contents) {
      try {
        const actualData = JSON.parse(proxyData.contents);
        console.log(`✅ Datos obtenidos del backend remoto via proxy`);
        
        // Si recibimos un array directo (como productos), convertir a formato esperado
        if (Array.isArray(actualData)) {
          const result = {
            success: true,
            total: actualData.length,
            source: 'remote-backend'
          };
          
          // Determinar el tipo de datos basado en el endpoint
          if (endpoint === '/productos') {
            result.productos = actualData;
          } else if (endpoint.includes('/ofertas')) {
            result.ofertas = actualData;
          } else {
            result.data = actualData;
          }
          
          return result;
        }
        
        // Si ya tiene el formato correcto, asegurar que tenga success: true
        if (actualData && typeof actualData === 'object') {
          return {
            success: true,
            source: 'remote-backend',
            ...actualData
          };
        }
        
        throw new Error('Invalid data format from remote backend');
        
      } catch (parseError) {
        throw new Error(`Error parsing remote backend data: ${parseError.message}`);
      }
    } else {
      throw new Error('No data in proxy response');
    }
  } catch (error) {
    console.log(`❌ Backend remoto no disponible: ${error.message}`);
    console.log(`🔄 Usando datos locales como fallback...`);
    return getMockData(endpoint);
  }
}

function getMockData(endpoint) {
  if (endpoint === '/productos') {
    // Usar productos almacenados o datos por defecto
    let stored = getStoredMockProducts();
    if (!stored) {
      // Si no hay datos almacenados, guardar los datos por defecto
      const defaultProducts = getDefaultMockProducts();
      storeMockProducts(defaultProducts);
      stored = defaultProducts;
    }
    
    return {
      success: true,
      productos: stored,
      total: stored.length,
      source: 'local'
    };
  }
  
  if (endpoint.includes('/ofertas')) {
    return {
      success: true,
      ofertas: [
        {
          _id: 'mock_001',
          nombre: 'Súper Oferta Bananas',
          descripcion: 'Bananas frescas con 30% de descuento',
          precio_original: 6000,
          precio_oferta: 4200,
          descuento_porcentaje: 30,
          imagen: 'https://verduleria-react.vercel.app/images/img-banana1.jpg',
          activa: true,
          vigente: true,
          categoria: 'Frutas'
        },
        {
          _id: 'mock_002',
          nombre: 'Oferta Especial Naranjas',
          descripcion: 'Naranjas jugosas con 25% de descuento',
          precio_original: 2500,
          precio_oferta: 1875,
          descuento_porcentaje: 25,
          imagen: 'https://verduleria-react.vercel.app/images/img-naranja1.jpg',
          activa: true,
          vigente: true,
          categoria: 'Frutas'
        }
      ],
      total: 2,
      source: 'mock'
    };
  }

  if (endpoint.includes('/resenas')) {
    if (endpoint.includes('/estadisticas')) {
      const resenas = getLocalResenas();
      const aprobadas = resenas.filter(r => r.aprobada).length;
      const pendientes = resenas.filter(r => !r.aprobada && r.visible !== false).length;
      const promedio = resenas.filter(r => r.aprobada).reduce((acc, r) => acc + r.calificacion, 0) / aprobadas || 0;
      
      return {
        success: true,
        estadisticas: {
          total: resenas.length,
          aprobadas,
          pendientes,
          rechazadas: resenas.filter(r => r.visible === false).length,
          promedio_rating: Math.round(promedio * 10) / 10
        },
        source: 'local'
      };
    }
    
    const resenas = getLocalResenas();
    return {
      success: true,
      reseñas: resenas,
      total: resenas.length,
      source: 'local'
    };
  }

  if (endpoint.includes('/pedidos')) {
    // Si es pedidos por usuario específico, usar proxy para obtener datos reales
    if (endpoint.includes('/usuario/')) {
      // Este endpoint necesita usar el proxy ya que el backend tiene datos reales
      // Retornar un formato que indique que debe usar el proxy
      return {
        success: false,
        useProxy: true,
        message: 'Usar proxy para obtener pedidos reales'
      };
    }
    
    return {
      success: true,
      pedidos: [],
      total: 0,
      source: 'mock',
      message: 'No hay pedidos disponibles'
    };
  }
  
  // Para otros endpoints, retornar estructura básica
  return {
    success: true,
    data: [],
    total: 0,
    source: 'mock',
    message: 'Datos temporales - Servicio en mantenimiento'
  };
}

// Funciones específicas para cada endpoint
export async function getProductos() {
  return await fetchWithProxy('/productos');
}

export async function getOfertas(activasSolo = false) {
  const endpoint = activasSolo ? '/ofertas?activas_solo=true' : '/ofertas';
  return await fetchWithProxy(endpoint);
}

export async function getResenas(publicas = false) {
  const endpoint = publicas ? '/resenas?aprobadas=true' : '/resenas';
  
  try {
    // Intentar directamente con fetch (sin proxy primero)
    try {
      const directResponse = await fetch(`${ORIGINAL_API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (directResponse.ok) {
        const directData = await directResponse.json();
        return {
          ...directData,
          source: 'backend'
        };
      }
    } catch (directError) {
      // Silenciar error de conexión directa
    }
    
    // Si la conexión directa falla, usar proxy
    const result = await fetchWithProxy(endpoint);
    
    if (result && result.success && result.source !== 'mock' && result.source !== 'local') {
      return {
        ...result,
        source: 'backend'
      };
    } else {
      throw new Error('Backend no disponible');
    }
  } catch (error) {
    // Usar sistema local como fallback
    const resenas = getLocalResenas();
    
    const reseñasFiltradas = publicas ? resenas.filter(r => r.aprobada === true) : resenas;
    
    return {
      success: true,
      reseñas: reseñasFiltradas,
      total: reseñasFiltradas.length,
      source: 'local'
    };
  }
}

export async function getEstadisticasResenas() {
  try {
    const result = await fetchWithProxy('/resenas/estadisticas');
    
    if (result && result.success && result.source !== 'mock' && result.source !== 'local') {
      return result;
    } else {
      throw new Error('Backend no disponible');
    }
  } catch (error) {
    // Calcular estadísticas locales como fallback
    const resenas = getLocalResenas();
    const aprobadas = resenas.filter(r => r.aprobada).length;
    const pendientes = resenas.filter(r => !r.aprobada && r.visible !== false).length;
    const promedio = resenas.filter(r => r.aprobada).reduce((acc, r) => acc + r.calificacion, 0) / aprobadas || 0;
    
    return {
      success: true,
      estadisticas: {
        total: resenas.length,
        aprobadas,
        pendientes,
        rechazadas: resenas.filter(r => r.visible === false).length,
        promedio_rating: Math.round(promedio * 10) / 10
      },
      source: 'local'
    };
  }
}

export async function getPedidosUsuario(emailUsuario) {
  const endpoint = `/pedidos/usuario/${encodeURIComponent(emailUsuario)}`;
  return await fetchWithProxy(endpoint);
}

export async function aprobarResena(id) {
  try {
    // Intentar usar la versión local primero
    return await aprobarResenaLocal(id);
  } catch (error) {
    // Fallback al método original si es necesario
    return await fetchWithProxy(`/resenas/${id}/aprobar`, { method: 'PUT' });
  }
}

export async function rechazarResena(id) {
  try {
    // Intentar usar la versión local primero
    return await rechazarResenaLocal(id);
  } catch (error) {
    // Fallback al método original si es necesario
    return await fetchWithProxy(`/resenas/${id}/rechazar`, { method: 'PUT' });
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
    
    // Si hay éxito con cualquier backend, retornar el resultado
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
    
    // Si hay éxito con cualquier backend, retornar el resultado
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

export async function deleteProduct(id) {
  try {
    // Intentar eliminar en backend (local o remoto)
    const result = await fetchAdminOperation(`/productos/${id}`, {
      method: 'DELETE'
    });
    
    // Si hay éxito con cualquier backend, retornar el resultado
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

// Para operaciones de administración (POST, PUT, DELETE) 
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
      
      // Si ambos backends fallan y es una operación de productos, simular localmente
      if (endpoint.includes('/productos')) {
        console.log(`🔄 Usando simulación local para productos...`);
        return await simulateProductOperation(endpoint, options);
      }
      
      // Para otros endpoints, lanzar el error
      throw new Error(`Backends no disponibles. Local: ${localError.message}, Remoto: ${remoteError.message}`);
    }
  }
}

// Simular operaciones de productos cuando el backend no está disponible
async function simulateProductOperation(endpoint, options = {}) {
  const productos = getStoredMockProducts() || getDefaultMockProducts();
  
  if (options.method === 'PUT') {
    // Actualizar producto
    const productId = endpoint.split('/').pop();
    const updatedData = JSON.parse(options.body);
    
    const index = productos.findIndex(p => p._id === productId || p.id === productId);
    if (index !== -1) {
      productos[index] = { ...productos[index], ...updatedData };
      storeMockProducts(productos);
      
      return {
        success: true,
        message: 'Producto actualizado correctamente (modo local)',
        producto: productos[index]
      };
    }
    
    throw new Error('Producto no encontrado');
  }
  
  if (options.method === 'DELETE') {
    // Eliminar producto
    const productId = endpoint.split('/').pop();
    const filteredProducts = productos.filter(p => p._id !== productId && p.id !== productId);
    
    if (filteredProducts.length < productos.length) {
      storeMockProducts(filteredProducts);
      return {
        success: true,
        message: 'Producto eliminado correctamente (modo local)'
      };
    }
    
    throw new Error('Producto no encontrado');
  }
  
  if (options.method === 'POST') {
    // Crear producto
    const newProductData = JSON.parse(options.body);
    const newId = `mock_${Date.now()}`;
    const newProduct = {
      ...newProductData,
      id: newId,
      _id: newId
    };
    
    productos.push(newProduct);
    storeMockProducts(productos);
    
    return {
      success: true,
      message: 'Producto creado correctamente (modo local)',
      producto: newProduct
    };
  }
  
  throw new Error('Operación no soportada');
}

// Funciones para manejar reseñas localmente
export async function enviarResenaLocal(resenaData) {
  try {
    // Primero intentar enviar al backend real
    try {
      const backendData = {
        usuario: {
          nombre: resenaData.nombreUsuario,
          email: resenaData.usuario
        },
        calificacion: resenaData.calificacion,
        comentario: resenaData.mensaje,
        producto: resenaData.producto || 'general'
      };
      
      const backendResult = await fetchAdminOperation('/resenas', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });
      
      if (backendResult && backendResult.success) {
        return {
          success: true,
          message: 'Reseña enviada correctamente. Será revisada por un administrador.',
          source: 'backend'
        };
      }
    } catch (backendError) {
      // Backend no disponible, usar sistema local
    }
    
    // Si el backend falla, usar el sistema local
    const resenas = getLocalResenas();
    
    const nuevaResena = {
      _id: `local_${Date.now()}`,
      ...resenaData,
      fecha: new Date().toISOString(),
      aprobada: false, // Las nuevas reseñas necesitan aprobación
      visible: true
    };
    
    resenas.push(nuevaResena);
    saveLocalResenas(resenas);
    
    return {
      success: true,
      message: 'Reseña enviada correctamente. Será revisada por un administrador.',
      resena: nuevaResena,
      source: 'local'
    };
  } catch (error) {
    throw error;
  }
}

export async function aprobarResenaLocal(id) {
  try {
    const resenas = getLocalResenas();
    const index = resenas.findIndex(r => r._id === id);
    
    if (index === -1) {
      throw new Error('Reseña no encontrada');
    }
    
    resenas[index].aprobada = true;
    resenas[index].visible = true;
    
    saveLocalResenas(resenas);
    
    return {
      success: true,
      message: 'Reseña aprobada correctamente',
      resena: resenas[index]
    };
  } catch (error) {
    throw error;
  }
}

export async function rechazarResenaLocal(id) {
  try {
    const resenas = getLocalResenas();
    const index = resenas.findIndex(r => r._id === id);
    
    if (index === -1) {
      throw new Error('Reseña no encontrada');
    }
    
    resenas[index].aprobada = false;
    resenas[index].visible = false;
    saveLocalResenas(resenas);
    
    return {
      success: true,
      message: 'Reseña rechazada correctamente',
      resena: resenas[index]
    };
  } catch (error) {
    console.error('Error rechazando reseña local:', error);
    throw error;
  }
}

// Función genérica para cualquier endpoint
export { fetchWithProxy, fetchAdminOperation };

export default {
  getProductos,
  getOfertas,
  getResenas,
  getEstadisticasResenas,
  getPedidosUsuario,
  aprobarResena,
  rechazarResena,
  fetchWithProxy,
  fetchAdminOperation,
  enviarResenaLocal,
  aprobarResenaLocal,
  rechazarResenaLocal,
  createProduct,
  updateProduct,
  deleteProduct
};
