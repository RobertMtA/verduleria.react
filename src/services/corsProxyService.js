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
      throw new Error(`Proxy error: ${response.status}`);
    }
    
    const proxyData = await response.json();
    
    // allorigins.win devuelve la respuesta en la propiedad 'contents'
    if (proxyData.contents) {
      try {
        const actualData = JSON.parse(proxyData.contents);
        console.log(`✅ Datos recibidos vía proxy:`, actualData);
        return actualData;
      } catch (parseError) {
        console.error('❌ Error parseando respuesta del proxy:', parseError);
        throw new Error('Error parseando respuesta del servidor');
      }
    } else {
      throw new Error('Respuesta vacía del proxy');
    }
  } catch (error) {
    console.error(`❌ Error en fetchWithProxy para ${endpoint}:`, error);
    
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

// Función genérica para cualquier endpoint
export { fetchWithProxy };

export default {
  getProductos,
  getOfertas,
  getResenas,
  fetchWithProxy
};
