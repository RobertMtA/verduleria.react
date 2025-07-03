// utils/imageUtils.js
const BASE_URL = "https://verduleria-react.vercel.app";
const DEFAULT_IMAGE = "/default-product.svg";

/**
 * Construye la URL completa para una imagen
 * @param {string} imagePath - Ruta de la imagen (puede ser relativa o absoluta)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_IMAGE; // Imagen por defecto
  if (imagePath.startsWith('http')) return imagePath; // URL absoluta
  if (imagePath.startsWith('/images/')) return `${BASE_URL}${imagePath}`; // Ruta relativa
  return `${BASE_URL}/images/${imagePath}`; // Solo nombre de archivo
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
