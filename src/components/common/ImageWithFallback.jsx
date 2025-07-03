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

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      
      // Intentar con GitHub si la imagen original falló
      if (src?.includes(BACKEND_URL)) {
        const githubUrl = src.replace(BACKEND_URL, GITHUB_FALLBACK);
        setCurrentSrc(githubUrl);
        return;
      }
      
      // Usar fallback personalizado si se proporcionó
      if (fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
      
      // Imagen por defecto
      setCurrentSrc('/default-product.svg');
    }
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
