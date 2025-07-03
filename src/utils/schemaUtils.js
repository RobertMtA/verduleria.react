// utils/schemaUtils.js

export const generateProductSchema = (product) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nombre || product.name,
    "description": product.descripcion || `${product.nombre} fresco y de calidad`,
    "image": `https://tudominio.com${product.imagen || '/images/default-product.svg'}`,
    "sku": product.id || product._id,
    "brand": {
      "@type": "Brand",
      "name": "Verdulería Online"
    },
    "offers": {
      "@type": "Offer",
      "price": product.precio,
      "priceCurrency": "ARS",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Verdulería Online"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1
    } : undefined
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://tudominio.com${crumb.url}`
    }))
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Verdulería Online",
    "url": "https://tudominio.com",
    "logo": "https://tudominio.com/images/img-logo1.jpg",
    "description": "Venta online de frutas y verduras frescas con entrega a domicilio en Buenos Aires",
    "telephone": "+54 11 4176-6377",
    "email": "robertogaona1985@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Buenos Aires",
      "addressRegion": "CABA",
      "addressCountry": "AR"
    },
    "founder": {
      "@type": "Person",
      "name": "Roberto Gaona",
      "email": "robertogaona1985@gmail.com",
      "jobTitle": "Desarrollador Web Full Stack"
    },
    "sameAs": [
      "https://wa.me/541141766377"
    ]
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Verdulería Online",
    "url": "https://tudominio.com",
    "description": "Compra frutas y verduras frescas online con entrega a domicilio",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tudominio.com/productos?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateFAQSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Hacen entregas a domicilio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, realizamos entregas a domicilio en toda la zona de Buenos Aires. Podes elegir el horario que más te convenga al momento de hacer tu pedido."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué métodos de pago aceptan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Aceptamos efectivo al momento de la entrega, transferencia bancaria y Mercado Pago (tarjetas de crédito y débito)."
        }
      },
      {
        "@type": "Question",
        "name": "¿Los productos son frescos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, todos nuestros productos son seleccionados diariamente para garantizar la máxima frescura y calidad."
        }
      },
      {
        "@type": "Question",
        "name": "¿Tienen productos orgánicos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, contamos con una sección especial de productos orgánicos certificados."
        }
      }
    ]
  };
};

// Función para inyectar schema en el head
export const injectSchema = (schema) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
  
  return () => {
    if (document.head.contains(script)) {
      document.head.removeChild(script);
    }
  };
};
