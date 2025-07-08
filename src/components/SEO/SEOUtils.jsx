import React, { useEffect } from 'react';

// Sitemap Generator for React Router
export const generateSitemap = (routes) => {
  const baseUrl = 'https://trovia.in';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemapUrls = routes.map(route => {
    const priority = route.priority || '0.8';
    const changefreq = route.changefreq || 'weekly';
    
    return `
    <url>
      <loc>${baseUrl}${route.path}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls}
</urlset>`;
};

// Robots.txt Generator
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /payment-test/
Disallow: /mock-payment/
Disallow: /razorpay-debugger/

# Sitemap
Sitemap: https://trovia.in/sitemap.xml

# Crawl-delay
Crawl-delay: 1`;
};

// Rich Snippets for Trek Cards
export const TrekRichSnippet = ({ trek }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": trek.title,
    "image": trek.imageUrl,
    "description": trek.description,
    "brand": {
      "@type": "Brand",
      "name": "Trovia"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://trovia.in/trek/${trek.id}`,
      "priceCurrency": "INR",
      "price": trek.price,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": trek.rating || "4.5",
      "reviewCount": trek.reviewCount || "50"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Duration",
        "value": trek.duration
      },
      {
        "@type": "PropertyValue",
        "name": "Difficulty",
        "value": trek.difficulty
      },
      {
        "@type": "PropertyValue",
        "name": "Location",
        "value": trek.location
      }
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

// Community Rich Snippet
export const CommunityRichSnippet = ({ community }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": community.name,
    "description": community.description,
    "url": `https://trovia.in/community/${community.id}`,
    "logo": community.imageUrl,
    "memberOf": {
      "@type": "Organization",
      "name": "Trovia Trekking Community"
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": community.memberCount
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": community.rating || "4.5",
      "reviewCount": community.reviews || "25"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

// Blog Post SEO Component - React 19 Compatible
export const BlogPostSEO = ({ post }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "author": {
      "@type": "Person",
      "name": post.author || "Trovia Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Trovia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://trovia.in/assets/images/trovia-logo.png"
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.modifiedDate || post.publishedDate,
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": post.wordCount
  };

  useEffect(() => {
    // Update title
    document.title = `${post.title} | Trovia Blog`;
    
    // Helper function to update meta tags
    const updateMeta = (property, content, type = 'name') => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[${type}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(type, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update meta tags
    updateMeta('description', post.excerpt);
    updateMeta('keywords', post.tags.join(", "));
    updateMeta('author', post.author || "Trovia Team");
    updateMeta('article:published_time', post.publishedDate, 'property');
    updateMeta('article:modified_time', post.modifiedDate || post.publishedDate, 'property');
    updateMeta('article:section', post.category, 'property');
    updateMeta('article:tag', post.tags.join(", "), 'property');
    
    // Add structured data
    const existingScript = document.getElementById('blog-post-schema');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-post-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const script = document.getElementById('blog-post-schema');
      if (script) {
        script.remove();
      }
    };
  }, [post, schema]);

  return null;
};

// Image SEO Component
export const ImageSEO = ({ src, alt, title, caption }) => {
  const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return (
    <figure itemScope itemType="https://schema.org/ImageObject">
      <img
        src={optimizedSrc}
        alt={alt}
        title={title}
        loading="lazy"
        itemProp="contentUrl"
        style={{ width: '100%', height: 'auto' }}
      />
      {caption && (
        <figcaption itemProp="caption">{caption}</figcaption>
      )}
      <meta itemProp="description" content={alt} />
      <meta itemProp="name" content={title} />
    </figure>
  );
};

// Local Business Schema for Trek Operators
export const LocalBusinessSchema = ({ business }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": business.website,
    "telephone": business.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": business.city,
      "addressRegion": business.state,
      "postalCode": business.zipCode,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.lat,
      "longitude": business.lng
    },
    "openingHours": business.hours,
    "priceRange": business.priceRange,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "reviewCount": business.reviewCount
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

// Event Schema for Trek Schedules
export const TrekEventSchema = ({ trek, date }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${trek.title} - ${date}`,
    "description": trek.description,
    "startDate": date,
    "endDate": new Date(new Date(date).getTime() + (trek.duration * 24 * 60 * 60 * 1000)).toISOString(),
    "location": {
      "@type": "Place",
      "name": trek.location,
      "address": trek.address
    },
    "organizer": {
      "@type": "Organization",
      "name": "Trovia",
      "url": "https://trovia.in"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://trovia.in/trek/${trek.id}`,
      "price": trek.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "image": trek.imageUrl,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

export default {
  generateSitemap,
  generateRobotsTxt,
  TrekRichSnippet,
  CommunityRichSnippet,
  BlogPostSEO,
  ImageSEO,
  LocalBusinessSchema,
  TrekEventSchema
};
