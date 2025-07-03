// utils/imageUtils.js
const BASE_URL = "https://verduleria-backend-m19n.onrender.com";
const GITHUB_FALLBACK = "https://raw.githubusercontent.com/RobertMtA/verduleria-backend/main/public";
const DEFAULT_IMAGE = "/default-product.svg";

/**
 * Construye la URL completa para una imagen con fallback a GitHub
 * @param {string} imagePath - Ruta de la imagen (puede ser relativa o absoluta)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_IMAGE; // Imagen por defecto
  if (imagePath.startsWith('http')) return imagePath; // URL absoluta
  
  // Construir URL principal y fallback
  const mainUrl = imagePath.startsWith('/images/') ? `${BASE_URL}${imagePath}` : `${BASE_URL}/images/${imagePath}`;
  const fallbackUrl = imagePath.startsWith('/images/') ? `${GITHUB_FALLBACK}${imagePath}` : `${GITHUB_FALLBACK}/images/${imagePath}`;
  
  // Retornar la URL principal (el navegador manejará el fallback si es necesario)
  return mainUrl;
};

/**
 * Obtiene la URL de una imagen de producto
 * @param {Object} product - Objeto producto
 * @returns {string} URL de la imagen del producto
 */
export const getProductImageUrl = (product) => {
  return getImageUrl(product?.imagen || product?.image);
};

/**
 * Maneja errores de carga de imagen estableciendo imagen por defecto
 * @param {Event} e - Evento de error
 */
export const handleImageError = (e) => {
  // Evitar loops infinitos de error
  if (e.target.src.includes('default-product.svg')) {
    return;
  }
  e.target.src = DEFAULT_IMAGE;
};
