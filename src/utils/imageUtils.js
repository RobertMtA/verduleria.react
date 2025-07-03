// utils/imageUtils.js
const DEFAULT_IMAGE = "/default-product.svg";

// Mapeo de productos a imágenes locales que están en public/images
const PRODUCT_IMAGE_MAPPING = {
  'banana': '/images/img-banana1.jpg',
  'cebolla': '/images/img-cebollas1.jpg',
  'espinaca': '/images/img-espinaca1.jpg',
  'lechuga': '/images/img-lechuga1.jpg',
  'morrón': '/images/img-morron-rojo1.jpg',
  'morron': '/images/img-morron-rojo1.jpg',
  'naranja': '/images/img-naranja1.jpg',
  'papa': '/images/img-papa1.jpg',
  'pera': '/images/img-pera1.jpg',
  'perejil': '/images/img-perejil1.jpg',
  'tomate': '/images/img-tomate1.jpg',
  'zanahoria': '/images/img-zanahoria1.jpg',
  'zapallo': '/images/img-zapallo-verde1.jpg',
  'manzana': '/images/img-manzana1.jpg',
  // Mapeos para productos adicionales usando imágenes similares
  'frutillas': '/images/img-banana1.jpg',
  'frutilla': '/images/img-banana1.jpg',
  'melón': '/images/img-pera1.jpg',
  'melon': '/images/img-pera1.jpg',
  'repollo': '/images/img-lechuga1.jpg',
  'mandarina': '/images/img-naranja1.jpg',
  'brócoli': '/images/img-espinaca1.jpg',
  'brocoli': '/images/img-espinaca1.jpg',
  'apio': '/images/img-perejil1.jpg',
  'kiwi': '/images/img-pera1.jpg',
  'acelga': '/images/img-espinaca1.jpg',
  'limón': '/images/img-naranja1.jpg',
  'limon': '/images/img-naranja1.jpg',
  'remolacha': '/images/img-tomate1.jpg',
  'durazno': '/images/img-pera1.jpg',
  'coliflor': '/images/img-zapallo-verde1.jpg'
};

/**
 * Busca una imagen alternativa basada en el nombre del producto
 * @param {string} productName - Nombre del producto
 * @returns {string|null} Ruta de imagen alternativa o null
 */
const findAlternativeImage = (productName) => {
  if (!productName) return null;
  
  const normalizedName = productName.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (PRODUCT_IMAGE_MAPPING[normalizedName]) {
    return PRODUCT_IMAGE_MAPPING[normalizedName];
  }
  
  // Buscar coincidencia parcial - buscar si alguna palabra del producto coincide
  const words = normalizedName.split(' ');
  for (const word of words) {
    if (PRODUCT_IMAGE_MAPPING[word]) {
      return PRODUCT_IMAGE_MAPPING[word];
    }
  }
  
  // Buscar coincidencia en cualquier parte del nombre
  for (const [key, imagePath] of Object.entries(PRODUCT_IMAGE_MAPPING)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return imagePath;
    }
  }
  
  return null;
};

/**
 * Construye la URL completa para una imagen usando imágenes locales
 * @param {string} imagePath - Ruta de la imagen (puede ser relativa o absoluta)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  // Si ya es una ruta local, devolverla tal como está
  if (imagePath.startsWith('/images/') || imagePath.startsWith('/default-product.svg')) {
    return imagePath;
  }
  
  // Si es una URL externa, convertir a ruta local
  if (imagePath.startsWith('http')) {
    // Extraer el nombre del archivo de la URL
    const fileName = imagePath.split('/').pop();
    if (fileName && fileName.includes('.')) {
      return `/images/${fileName}`;
    }
    return DEFAULT_IMAGE;
  }
  
  // Para rutas relativas sin /images/, agregarle el prefijo
  return `/images/${imagePath}`;
};

/**
 * Obtiene la URL de una imagen de producto con fallback inteligente
 * @param {Object} product - Objeto producto
 * @returns {string} URL de la imagen del producto
 */
export const getProductImageUrl = (product) => {
  if (!product) return DEFAULT_IMAGE;
  
  // Intentar con la imagen del producto
  if (product.imagen || product.image) {
    return getImageUrl(product.imagen || product.image);
  }
  
  // Si no hay imagen, buscar una alternativa basada en el nombre
  const alternativeImage = findAlternativeImage(product.nombre || product.name);
  if (alternativeImage) {
    return getImageUrl(alternativeImage);
  }
  
  return DEFAULT_IMAGE;
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
