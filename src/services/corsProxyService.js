// Servicio temporal para evitar problemas de CORS
// Usa allorigins.win como proxy

const ORIGINAL_API_URL = "https://verduleria-backend-m19n.onrender.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";

// Sistema de reseñas local para persistir datos mientras el backend está inactivo
const RESENAS_STORAGE_KEY = 'verduleria_resenas_local';

// Cargar reseñas desde localStorage
function getLocalResenas() {
  try {
    console.log('📂 Cargando reseñas desde localStorage...');
    const stored = localStorage.getItem(RESENAS_STORAGE_KEY);
    const resenas = stored ? JSON.parse(stored) : getInitialMockResenas();
    console.log(`📋 Reseñas cargadas: ${resenas.length} total`);
    return resenas;
  } catch (error) {
    console.warn('⚠️ Error cargando reseñas locales:', error);
    return getInitialMockResenas();
  }
}

// Guardar reseñas en localStorage
function saveLocalResenas(resenas) {
  try {
    console.log(`💾 Guardando ${resenas.length} reseñas en localStorage...`);
    localStorage.setItem(RESENAS_STORAGE_KEY, JSON.stringify(resenas));
    console.log('✅ Reseñas guardadas exitosamente');
  } catch (error) {
    console.warn('⚠️ Error guardando reseñas locales:', error);
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

async function fetchWithProxy(endpoint, options = {}) {
  try {
    // Si es una operación que no es GET (POST, PUT, DELETE), usar función admin directa
    if (options.method && options.method !== 'GET') {
      return await fetchAdminOperation(endpoint, options);
    }
    
    const encodedUrl = encodeURIComponent(`${ORIGINAL_API_URL}${endpoint}`);
    const proxyRequestUrl = `${PROXY_URL}${encodedUrl}`;
    
    const response = await fetch(proxyRequestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return getMockData(endpoint);
    }
    
    const proxyData = await response.json();
    
    // allorigins.win devuelve la respuesta en la propiedad 'contents'
    if (proxyData.contents) {
      try {
        const actualData = JSON.parse(proxyData.contents);
        
        // Si recibimos un array directo (como productos), convertir a formato esperado
        if (Array.isArray(actualData)) {
          const result = {
            success: true,
            total: actualData.length,
            source: 'proxy'
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
            source: 'proxy',
            ...actualData
          };
        }
        
        return getMockData(endpoint);
        
      } catch (parseError) {
        return getMockData(endpoint);
      }
    } else {
      return getMockData(endpoint);
    }
  } catch (error) {
    return getMockData(endpoint);
  }
}

function getMockData(endpoint) {
  if (endpoint === '/productos') {
    return {
      success: true,
      productos: [
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
      ],
      total: 24,
      source: 'mock'
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
    console.log('🔄 Intentando obtener reseñas del backend...');
    
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
        console.log('✅ Reseñas obtenidas directamente del backend:', directData);
        return {
          ...directData,
          source: 'backend'
        };
      }
    } catch (directError) {
      console.log('⚠️ Conexión directa falló, intentando con proxy:', directError.message);
    }
    
    // Si la conexión directa falla, usar proxy
    const result = await fetchWithProxy(endpoint);
    
    if (result && result.success && result.source !== 'mock' && result.source !== 'local') {
      console.log('✅ Reseñas obtenidas del backend via proxy:', result);
      return {
        ...result,
        source: 'backend'
      };
    } else {
      console.log('⚠️ Backend no disponible, usando datos locales');
      throw new Error('Backend no disponible');
    }
  } catch (error) {
    console.log('📱 Usando sistema local de reseñas');
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
    console.log('📊 Intentando obtener estadísticas del backend...');
    const result = await fetchWithProxy('/resenas/estadisticas');
    
    if (result && result.success && result.source !== 'mock' && result.source !== 'local') {
      console.log('✅ Estadísticas obtenidas del backend:', result);
      return result;
    } else {
      throw new Error('Backend no disponible');
    }
  } catch (error) {
    console.log('📱 Calculando estadísticas locales');
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

// Para operaciones de administración (POST, PUT, DELETE) usamos el backend directo
// ya que allorigins.win solo soporta GET
async function fetchAdminOperation(endpoint, options = {}) {
  try {
    console.log(`🔧 Operación admin directa: ${endpoint}`);
    
    const response = await fetch(`${ORIGINAL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Error ${response.status}:`, errorData);
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Operación admin completada:`, result);
    return result;
    
  } catch (error) {
    console.error(`❌ Error en operación admin:`, error);
    throw error;
  }
}

// Funciones para manejar reseñas localmente
export async function enviarResenaLocal(resenaData) {
  try {
    console.log('🔄 Enviando reseña local...', resenaData);
    
    // Primero intentar enviar al backend real
    try {
      console.log('🌐 Intentando enviar al backend...');
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
        console.log('✅ Reseña enviada al backend exitosamente');
        return {
          success: true,
          message: 'Reseña enviada correctamente. Será revisada por un administrador.',
          source: 'backend'
        };
      }
    } catch (backendError) {
      console.log('⚠️ Backend no disponible, usando sistema local:', backendError.message);
    }
    
    // Si el backend falla, usar el sistema local
    const resenas = getLocalResenas();
    console.log('📋 Reseñas existentes:', resenas.length);
    
    const nuevaResena = {
      _id: `local_${Date.now()}`,
      ...resenaData,
      fecha: new Date().toISOString(),
      aprobada: false, // Las nuevas reseñas necesitan aprobación
      visible: true
    };
    
    console.log('🆕 Nueva reseña creada:', nuevaResena);
    
    resenas.push(nuevaResena);
    saveLocalResenas(resenas);
    
    console.log('💾 Total de reseñas guardadas:', resenas.length);
    
    return {
      success: true,
      message: 'Reseña enviada correctamente. Será revisada por un administrador.',
      resena: nuevaResena,
      source: 'local'
    };
  } catch (error) {
    console.error('❌ Error enviando reseña local:', error);
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
    console.error('Error aprobando reseña local:', error);
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
  rechazarResenaLocal
};
