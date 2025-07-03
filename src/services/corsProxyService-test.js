// Servicio temporal para evitar problemas de CORS
// Usa allorigins.win como proxy

const LOCAL_API_URL = "http://localhost:4001/api";
const REMOTE_API_URL = "https://verduleria-backend-m19n.onrender.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";

// Sistema de reseñas local para persistir datos mientras el backend está inactivo
const RESENAS_STORAGE_KEY = 'reseñas_local';

// Sistema de persistencia local para datos mock
const MOCK_STORAGE_KEY = 'verduleria_mock_productos';

// Test simple de sintaxis
export async function createProduct(productData) {
  console.log('Test function');
  return { success: true };
}

export async function updateProduct(id, productData) {
  console.log('Test function');
  return { success: true };
}

export async function deleteProduct(id) {
  console.log('Test function');
  return { success: true };
}

export default {
  createProduct,
  updateProduct,
  deleteProduct
};
