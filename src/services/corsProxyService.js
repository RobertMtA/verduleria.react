// Servicio temporal para evitar problemas de CORS
// Usa allorigins.win como proxy

const ORIGINAL_API_URL = "https://verduleria-backend-m19n.onrender.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";

async function fetchWithProxy(endpoint, options = {}) {
  try {
    console.log(`🔄 Usando proxy para: ${endpoint}`);
    
    const encodedUrl = encodeURIComponent(`${ORIGINAL_API_URL}${endpoint}`);
    const proxyRequestUrl = `${PROXY_URL}${encodedUrl}`;
    
    const response = await fetch(proxyRequestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`⚠️ Proxy error: ${response.status}, usando fallback`);
      return getMockData(endpoint);
    }
    
    const proxyData = await response.json();
    
    // allorigins.win devuelve la respuesta en la propiedad 'contents'
    if (proxyData.contents) {
      try {
        const actualData = JSON.parse(proxyData.contents);
        console.log(`✅ Datos recibidos vía proxy:`, actualData);
        
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
        
        // Fallback si no es ni array ni objeto válido
        console.warn('⚠️ Formato de respuesta inesperado:', actualData);
        return getMockData(endpoint);
        
      } catch (parseError) {
        console.error('❌ Error parseando respuesta del proxy:', parseError);
        
        // Si hay error de parseo, probablemente es HTML (404)
        if (proxyData.contents.includes('<!DOCTYPE') || proxyData.contents.includes('<html>')) {
          console.warn('⚠️ Respuesta es HTML (probablemente 404), usando fallback');
        }
        
        return getMockData(endpoint);
      }
    } else {
      console.warn('⚠️ Respuesta vacía del proxy, usando fallback');
      return getMockData(endpoint);
    }
  } catch (error) {
    console.warn(`⚠️ Error en fetchWithProxy para ${endpoint}:`, error.message);
    
    // Fallback: retornar datos mock
    return getMockData(endpoint);
  }
}

function getMockData(endpoint) {
  console.log(`📦 Usando datos mock para: ${endpoint}`);
  
  if (endpoint === '/productos') {
    return {
      success: true,
      productos: [
        {
          id: "mock_001",
          nombre: "Banana",
          descripcion: "Bananas frescas (Por kilo)",
          precio: 6000,
          stock: 77000,
          imagen: "/images/img-banana1.jpg",
          categoria: "Frutas",
          activo: true
        },
        {
          id: "mock_002",
          nombre: "Naranja",
          descripcion: "Naranja fresca y jugosa (Por kilo)",
          precio: 2500,
          stock: 1000,
          imagen: "/images/img-naranja1.jpg",
          categoria: "Frutas",
          activo: true
        },
        {
          id: "mock_003",
          nombre: "Lechuga",
          descripcion: "Lechuga fresca (Por kilo)",
          precio: 2500,
          stock: 50,
          imagen: "/images/img-lechuga1.jpg",
          categoria: "Verduras",
          activo: true
        },
        {
          id: "mock_004",
          nombre: "Papa",
          descripcion: "Papas frescas (Por kilo)",
          precio: 2700,
          stock: 1000,
          imagen: "/images/img-papa1.jpg",
          categoria: "Verduras",
          activo: true
        }
      ],
      total: 4,
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
          imagen: '/images/img-banana1.jpg',
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
          imagen: '/images/img-naranja1.jpg',
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
      return {
        success: true,
        estadisticas: {
          total: 4,
          aprobadas: 3,
          pendientes: 1,
          rechazadas: 0,
          promedio_rating: 4.2
        },
        source: 'mock'
      };
    }
    
    return {
      success: true,
      reseñas: [
        {
          _id: 'mock_res_001',
          usuario: 'Juan Pérez',
          email: 'juan@example.com',
          producto: 'Banana',
          rating: 5,
          comentario: 'Excelente calidad, muy frescas y dulces. Las mejores bananas que he probado.',
          fecha: new Date('2024-12-15').toISOString(),
          aprobada: true,
          publica: true
        },
        {
          _id: 'mock_res_002',
          usuario: 'María González',
          email: 'maria@example.com',
          producto: 'Lechuga',
          rating: 4,
          comentario: 'Buena lechuga, fresca y crujiente. Perfecta para ensaladas.',
          fecha: new Date('2024-12-14').toISOString(),
          aprobada: true,
          publica: true
        },
        {
          _id: 'mock_res_003',
          usuario: 'Carlos Rodriguez',
          email: 'carlos@example.com',
          producto: 'Naranja',
          rating: 4,
          comentario: 'Naranjas jugosas y con buen sabor. Recomendadas.',
          fecha: new Date('2024-12-13').toISOString(),
          aprobada: true,
          publica: true
        },
        {
          _id: 'mock_res_004',
          usuario: 'Ana Martín',
          email: 'ana@example.com',
          producto: 'Papa',
          rating: 4,
          comentario: 'Papas de buena calidad para cocinar.',
          fecha: new Date('2024-12-12').toISOString(),
          aprobada: false,
          publica: false
        }
      ],
      total: 4,
      source: 'mock'
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
  const endpoint = publicas ? '/resenas?publicas=true' : '/resenas';
  return await fetchWithProxy(endpoint);
}

export async function getEstadisticasResenas() {
  return await fetchWithProxy('/resenas/estadisticas');
}

export async function getPedidosUsuario(emailUsuario) {
  const endpoint = `/pedidos/usuario/${encodeURIComponent(emailUsuario)}`;
  return await fetchWithProxy(endpoint);
}

export async function aprobarResena(id) {
  return await fetchWithProxy(`/resenas/${id}/aprobar`, { method: 'PUT' });
}

export async function rechazarResena(id) {
  return await fetchWithProxy(`/resenas/${id}/rechazar`, { method: 'PUT' });
}

// Función genérica para cualquier endpoint
export { fetchWithProxy };

export default {
  getProductos,
  getOfertas,
  getResenas,
  getEstadisticasResenas,
  getPedidosUsuario,
  aprobarResena,
  rechazarResena,
  fetchWithProxy
};
