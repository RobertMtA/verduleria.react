import React, { useState } from 'react';

const BACKEND_URL = "https://verduleria-backend-m19n.onrender.com";
const GITHUB_FALLBACK = "https://raw.githubusercontent.com/RobertMtA/verduleria-backend/main/public";

/**
 * Componente de imagen con fallback automático a GitHub
 */
const ImageWithFallback = ({ 
  src, 
  alt, 
  className = "", 
  style = {},
  fallbackSrc = null,
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);

  const handleError = () => {
    if (fallbackAttempts === 0) {
      // Primer intento fallido - probar con GitHub
      if (src?.includes(BACKEND_URL)) {
        const githubUrl = src.replace(BACKEND_URL, GITHUB_FALLBACK);
        setCurrentSrc(githubUrl);
        setFallbackAttempts(1);
        return;
      }
      
      // Si es una imagen relativa, construir URL de GitHub
      if (src?.startsWith('/images/')) {
        const githubUrl = `${GITHUB_FALLBACK}${src}`;
        setCurrentSrc(githubUrl);
        setFallbackAttempts(1);
        return;
      }
    }
    
    if (fallbackAttempts === 1) {
      // Si falla GitHub, intentar con imagen local
      const localImagePath = `/images/default-product.svg`;
      setCurrentSrc(localImagePath);
      setFallbackAttempts(2);
      return;
    }
    
    if (fallbackAttempts === 2 && fallbackSrc) {
      // Tercer intento - usar fallback personalizado
      setCurrentSrc(fallbackSrc);
      setFallbackAttempts(3);
      return;
    }
    
    // Último recurso - imagen por defecto del public
    setCurrentSrc('/default-product.svg');
    setHasError(true);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
