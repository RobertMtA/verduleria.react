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

// Función para obtener ofertas
export async function getOfertas(activasSolo = false) {
  try {
    const endpoint = activasSolo ? '/ofertas?activas_solo=true' : '/ofertas';
    
    // Intentar primero con el backend local
    try {
      console.log(`🔄 Intentando obtener ofertas del backend local: ${LOCAL_API_URL}${endpoint}`);
      
      const localResponse = await fetch(`${LOCAL_API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        console.log(`✅ Ofertas obtenidas del backend local`);
        
        return {
          success: true,
          source: 'local-backend',
          ofertas: localData.ofertas || localData,
          total: (localData.ofertas || localData).length
        };
      }
    } catch (localError) {
      console.log(`❌ Backend local no disponible: ${localError.message}`);
    }

    // Fallback con datos mock
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
          imagen: '/images/img-banana1.jpg',
          activa: true,
          vigente: true,
          categoria: 'Frutas'
        }
      ],
      total: 1,
      source: 'mock'
    };
  } catch (error) {
    console.error('Error en getOfertas:', error);
    return {
      success: false,
      error: error.message,
      ofertas: [],
      total: 0
    };
  }
}

// === FUNCIONES DE RESEÑAS MEJORADAS ===

// Datos mock para reseñas
function getDefaultMockResenas() {
  return [
    {
      _id: "resena_001",
      id: "resena_001",
      usuario: {
        nombre: "María González",
        email: "maria.gonzalez@example.com"
      },
      rating: 5,
      comentario: "Excelente calidad de productos! Las verduras siempre están frescas y el servicio es muy rápido. Definitivamente recomendado.",
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      aprobada: true,
      productos: ["Lechuga", "Tomate"]
    },
    {
      _id: "resena_002", 
      id: "resena_002",
      usuario: {
        nombre: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com"
      },
      rating: 4,
      comentario: "Muy buena variedad de productos frescos. Los precios son competitivos y la entrega fue puntual.",
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      aprobada: true,
      productos: ["Banana", "Manzana"]
    },
    {
      _id: "resena_003",
      id: "resena_003", 
      usuario: {
        nombre: "Ana Martínez",
        email: "ana.martinez@example.com"
      },
      rating: 5,
      comentario: "La mejor verdulería online que he encontrado. Todo llega en perfecto estado y muy fresco.",
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      aprobada: true,
      productos: ["Zanahoria", "Cebolla"]
    },
    {
      _id: "resena_004",
      id: "resena_004",
      usuario: {
        nombre: "Luis Herrera",
        email: "luis.herrera@example.com"
      },
      rating: 4,
      comentario: "Buen servicio en general. Solo me gustaría que tuvieran más variedad de frutas orgánicas.",
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      aprobada: false,
      productos: ["Espinaca"]
    },
    {
      _id: "resena_005",
      id: "resena_005",
      usuario: {
        nombre: "Carmen Silva",
        email: "carmen.silva@example.com"
      },
      rating: 5,
      comentario: "Servicio excepcional! Los productos son de primera calidad y la atención al cliente es excelente.",
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      aprobada: true,
      productos: ["Papa", "Morron Rojo"]
    },
    {
      _id: "resena_006",
      id: "resena_006",
      usuario: {
        nombre: "Diego Fernández",
        email: "diego.fernandez@example.com"
      },
      rating: 3,
      comentario: "El producto estaba bien pero la entrega se retrasó un poco. Espero mejore en el futuro.",
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      aprobada: false,
      productos: ["Naranja"]
    }
  ];
}

function getStoredMockResenas() {
  try {
    const stored = localStorage.getItem(RESENAS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Si no hay datos almacenados, usar los datos por defecto
    const defaultResenas = getDefaultMockResenas();
    storeMockResenas(defaultResenas);
    return defaultResenas;
  } catch (error) {
    console.error('Error al cargar reseñas mock desde localStorage:', error);
    return getDefaultMockResenas();
  }
}

function storeMockResenas(resenas) {
  try {
    localStorage.setItem(RESENAS_STORAGE_KEY, JSON.stringify(resenas));
  } catch (error) {
    console.error('Error al guardar reseñas mock en localStorage:', error);
  }
}

export async function getResenas(publicas = false) {
  try {
    const endpoint = publicas ? '/resenas?aprobadas=true' : '/resenas';
    
    // Intentar primero con el backend local
    try {
      smartLog('getResenas_local', `🔄 Intentando obtener reseñas del backend local: ${LOCAL_API_URL}${endpoint}`);
      
      const localResponse = await fetch(`${LOCAL_API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        smartLog('getResenas_local_success', `✅ Reseñas obtenidas del backend local`, true);
        
        return {
          success: true,
          source: 'local-backend',
          reseñas: localData.reseñas || localData,
          total: (localData.reseñas || localData).length
        };
      }
    } catch (localError) {
      smartLog('getResenas_local_error', `❌ Backend local no disponible: ${localError.message}`);
    }

    // Fallback con datos mock
    const mockResenas = getStoredMockResenas();
    const filteredResenas = publicas 
      ? mockResenas.filter(resena => resena.aprobada) 
      : mockResenas;
    
    smartLog('getResenas_mock', `📋 Usando datos mock de reseñas: ${filteredResenas.length} reseñas`);
    
    return {
      success: true,
      reseñas: filteredResenas,
      total: filteredResenas.length,
      source: 'mock'
    };
  } catch (error) {
    console.error('Error en getResenas:', error);
    return {
      success: false,
      error: error.message,
      reseñas: [],
      total: 0
    };
  }
}

// Función para estadísticas de reseñas
export async function getEstadisticasResenas() {
  try {
    // Intentar con backend local
    try {
      const localResponse = await fetch(`${LOCAL_API_URL}/resenas/estadisticas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        return {
          success: true,
          source: 'local-backend',
          estadisticas: localData.estadisticas || localData
        };
      }
    } catch (localError) {
      smartLog('getEstadisticas_local_error', `❌ Backend local no disponible: ${localError.message}`);
    }

    // Fallback con datos mock calculados
    const mockResenas = getStoredMockResenas();
    const aprobadas = mockResenas.filter(r => r.aprobada);
    const pendientes = mockResenas.filter(r => !r.aprobada);
    const totalRatings = aprobadas.reduce((sum, r) => sum + r.rating, 0);
    const promedioRating = aprobadas.length > 0 ? (totalRatings / aprobadas.length).toFixed(1) : 0;
    
    const estadisticas = {
      total: mockResenas.length,
      aprobadas: aprobadas.length,
      pendientes: pendientes.length,
      rechazadas: 0,
      promedio_rating: parseFloat(promedioRating)
    };
    
    smartLog('getEstadisticas_mock', `📊 Estadísticas mock calculadas: ${JSON.stringify(estadisticas)}`);
    
    return {
      success: true,
      estadisticas,
      source: 'mock'
    };
  } catch (error) {
    console.error('Error en getEstadisticasResenas:', error);
    return {
      success: false,
      error: error.message,
      estadisticas: {
        total: 0,
        aprobadas: 0,
        pendientes: 0,
        rechazadas: 0,
        promedio_rating: 0
      }
    };
  }
}

// Función genérica fetchWithProxy para compatibilidad
export async function fetchWithProxy(endpoint, options = {}) {
  if (options.method && options.method !== 'GET') {
    return await fetchAdminOperation(endpoint, options);
  }
  
  // Para operaciones GET, usar las funciones específicas
  if (endpoint === '/productos') {
    return await getProductos();
  } else if (endpoint.includes('/ofertas')) {
    return await getOfertas(endpoint.includes('activas_solo=true'));
  } else if (endpoint.includes('/resenas')) {
    return await getResenas(endpoint.includes('aprobadas=true'));
  }
  
  // Para otros endpoints, intentar llamada directa
  try {
    const response = await fetch(`${LOCAL_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        source: 'local-backend',
        ...data
      };
    }
  } catch (error) {
    console.log(`Error en fetchWithProxy: ${error.message}`);
  }
  
  return {
    success: false,
    error: 'Endpoint no disponible',
    data: []
  };
}

// Sistema de logs optimizado para evitar spam
let lastLogTime = {};
let logCount = {};

function smartLog(key, message, forceLog = false) {
  const now = Date.now();
  const lastTime = lastLogTime[key] || 0;
  const count = logCount[key] || 0;
  
  // Solo log si ha pasado más de 5 segundos desde el último log del mismo tipo
  // O si es un log forzado
  if (forceLog || (now - lastTime) > 5000) {
    if (count > 1) {
      console.log(`${message} (ocurrió ${count} veces más)`);
      logCount[key] = 0;
    } else {
      console.log(message);
    }
    lastLogTime[key] = now;
  } else {
    logCount[key] = count + 1;
  }
}

// Funciones stub para reseñas (compatibilidad)
export async function enviarResenaLocal(resenaData) {
  try {
    const result = await fetchAdminOperation('/resenas', {
      method: 'POST',
      body: JSON.stringify({
        usuario: {
          nombre: resenaData.nombreUsuario,
          email: resenaData.usuario
        },
        calificacion: resenaData.calificacion,
        comentario: resenaData.mensaje,
        producto: resenaData.producto || 'general'
      })
    });
    
    return {
      success: true,
      message: 'Reseña enviada correctamente',
      ...result
    };
  } catch (error) {
    console.error('Error enviando reseña a backends:', error);
    
    // Si los backends fallan, simular envío con datos mock
    console.log('⚠️ Backends no disponibles, simulando envío con datos mock...');
    
    const nuevaReseña = {
      _id: Date.now().toString(),
      usuario: {
        nombre: resenaData.nombreUsuario,
        email: resenaData.usuario
      },
      nombreUsuario: resenaData.nombreUsuario,
      calificacion: resenaData.calificacion,
      comentario: resenaData.mensaje,
      producto: resenaData.producto || 'general',
      fecha_reseña: new Date().toISOString(),
      aprobada: false
    };
    
    // Agregar a localStorage para persistencia
    const reseñasExistentes = JSON.parse(localStorage.getItem(RESENAS_STORAGE_KEY) || '[]');
    reseñasExistentes.push(nuevaReseña);
    localStorage.setItem(RESENAS_STORAGE_KEY, JSON.stringify(reseñasExistentes));
    
    console.log('✅ Reseña agregada al sistema mock local');
    
    return {
      success: true,
      message: '¡Reseña enviada correctamente! Será revisada por nuestro equipo antes de publicarse.',
      reseña: nuevaReseña,
      source: 'mock'
    };
  }
}

export async function aprobarResena(id) {
  try {
    console.log(`🔄 Intentando aprobar reseña ${id}...`);
    
    // Intentar con backend local primero
    try {
      const result = await fetchAdminOperation(`/resenas/${id}/aprobar`, {
        method: 'PUT'
      });
      
      if (result.success) {
        console.log(`✅ Reseña ${id} aprobada en backend`);
        return result;
      }
    } catch (backendError) {
      console.log(`❌ Backend no disponible para aprobar reseña: ${backendError.message}`);
    }
    
    // Fallback con datos mock
    console.log(`🔄 Usando mock data para aprobar reseña ${id}`);
    const mockResenas = getStoredMockResenas();
    const resenaIndex = mockResenas.findIndex(r => r._id === id || r.id === id);
    
    if (resenaIndex !== -1) {
      mockResenas[resenaIndex].aprobada = true;
      storeMockResenas(mockResenas);
      
      console.log(`✅ Reseña ${id} aprobada en mock data`);
      return {
        success: true,
        message: 'Reseña aprobada correctamente',
        source: 'mock',
        resena: mockResenas[resenaIndex]
      };
    }
    
    console.log(`❌ Reseña ${id} no encontrada en mock data`);
    return {
      success: false,
      error: 'Reseña no encontrada'
    };
  } catch (error) {
    console.error('Error aprobando reseña:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function rechazarResena(id) {
  try {
    console.log(`🔄 Intentando rechazar reseña ${id}...`);
    
    // Intentar con backend local primero
    try {
      const result = await fetchAdminOperation(`/resenas/${id}/rechazar`, {
        method: 'PUT'
      });
      
      if (result.success) {
        console.log(`✅ Reseña ${id} rechazada en backend`);
        return result;
      }
    } catch (backendError) {
      console.log(`❌ Backend no disponible para rechazar reseña: ${backendError.message}`);
    }
    
    // Fallback con datos mock
    console.log(`🔄 Usando mock data para rechazar reseña ${id}`);
    const mockResenas = getStoredMockResenas();
    const resenaIndex = mockResenas.findIndex(r => r._id === id || r.id === id);
    
    if (resenaIndex !== -1) {
      mockResenas[resenaIndex].aprobada = false;
      storeMockResenas(mockResenas);
      
      console.log(`❌ Reseña ${id} rechazada en mock data`);
      return {
        success: true,
        message: 'Reseña rechazada correctamente', 
        source: 'mock',
        resena: mockResenas[resenaIndex]
      };
    }
    
    console.log(`❌ Reseña ${id} no encontrada en mock data`);
    return {
      success: false,
      error: 'Reseña no encontrada'
    };
  } catch (error) {
    console.error('Error rechazando reseña:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function eliminarResena(id) {
  try {
    console.log(`🔄 Intentando eliminar reseña ${id}...`);
    
    // Intentar con backend local primero
    try {
      const result = await fetchAdminOperation(`/resenas/${id}`, {
        method: 'DELETE'
      });
      
      if (result.success) {
        console.log(`🗑️ Reseña ${id} eliminada en backend`);
        return result;
      }
    } catch (backendError) {
      console.log(`❌ Backend no disponible para eliminar reseña: ${backendError.message}`);
    }
    
    // Fallback con datos mock
    console.log(`🔄 Usando mock data para eliminar reseña ${id}`);
    const mockResenas = getStoredMockResenas();
    const resenaIndex = mockResenas.findIndex(r => r._id === id || r.id === id);
    
    if (resenaIndex !== -1) {
      const resenaEliminada = mockResenas.splice(resenaIndex, 1)[0];
      storeMockResenas(mockResenas);
      
      console.log(`🗑️ Reseña ${id} eliminada de mock data`);
      return {
        success: true,
        message: 'Reseña eliminada correctamente',
        source: 'mock',
        resena: resenaEliminada
      };
    }
    
    console.log(`❌ Reseña ${id} no encontrada en mock data`);
    return {
      success: false,
      error: 'Reseña no encontrada'
    };
  } catch (error) {
    console.error('Error eliminando reseña:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Exportación por defecto completa
export default {
  getProductos,
  getOfertas,
  getResenas,
  getEstadisticasResenas,
  fetchWithProxy,
  enviarResenaLocal,
  aprobarResena,
  rechazarResena,
  createProduct,
  updateProduct,
  deleteProduct,
  eliminarResena
};
