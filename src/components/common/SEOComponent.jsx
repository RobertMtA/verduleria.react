import { useEffect } from 'react';

const SEOComponent = ({ 
  title = "Verdulería Online | Frutas y Verduras Frescas",
  description = "🥬 Verdulería online con frutas y verduras frescas. Entrega a domicilio en Buenos Aires. ¡Pedí ahora!",
  keywords = "verdulería online, frutas frescas, verduras frescas, delivery, Buenos Aires",
  image = "/images/img-banner.jpg",
  url = "https://tudominio.com",
  type = "website"
}) => {
  
  useEffect(() => {
    // Actualizar title
    document.title = title;
    
    // Actualizar meta description
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    
    // Actualizar Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', `${window.location.origin}${image}`);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', type);
    
    // Actualizar Twitter Cards
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', `${window.location.origin}${image}`);
    
    // Actualizar canonical
    updateCanonical(url);
    
  }, [title, description, keywords, image, url, type]);

  const updateMetaTag = (attribute, value, content) => {
    let element = document.querySelector(`meta[${attribute}="${value}"]`);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, value);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  const updateCanonical = (url) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  };

  return null; // Este componente no renderiza nada visible
};

export default SEOComponent;
