import React, { useEffect } from 'react';

const SEOHelmet = ({ 
  title = "Trovia - Adventure Treks & Travel Community | Book Affordable Treks India",
  description = "Join India's trusted trekking community. Book affordable treks in Himachal, Uttarakhand, Ladakh. Solo & group adventures. Expert guides, safe travel. Book now!",
  keywords = "affordable treks, group treks India, solo treks, adventure travel community, best treks Himachal, Uttarakhand treks, Ladakh adventure trips, Meghalaya hikes, trekking packages India, weekend getaways from Delhi, Bangalore, Mumbai, budget adventure trips",
  url = "https://trovia.in",
  image = "https://trovia.in/assets/images/trovia-og-image.jpg",
  type = "website",
  structuredData = null,
  canonical = null
}) => {
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Trovia",
    "description": "Adventure Treks & Travel Community Platform",
    "url": "https://trovia.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://trovia.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.facebook.com/trovia.in",
      "https://www.instagram.com/trovia.in",
      "https://twitter.com/trovia_in"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Trovia",
    "alternateName": "Trovia Treks",
    "url": "https://trovia.in",
    "logo": "https://trovia.in/assets/images/trovia-logo.png",
    "description": "India's trusted platform for affordable adventure treks and travel community",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8989986204",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1200",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://trovia.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Treks",
        "item": "https://trovia.in/explore"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Community",
        "item": "https://trovia.in/community"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best beginner treks in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Top beginner-friendly treks include Triund (Himachal), Kedarkantha (Uttarakhand), Brahmatal, and Dayara Bugyal. These offer stunning views with moderate difficulty levels perfect for first-time trekkers."
        }
      },
      {
        "@type": "Question",
        "name": "How much do budget treks cost in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Budget treks in India typically range from ₹2,000-8,000 per person, depending on duration, location, and inclusions. Weekend treks near Delhi/Mumbai start from ₹3,000, while longer Himalayan treks can cost ₹5,000-12,000."
        }
      },
      {
        "@type": "Question",
        "name": "Is solo trekking safe in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, solo trekking is safe when you join organized groups, inform others of your plans, carry emergency supplies, and choose well-marked trails. Trovia connects solo travelers with trusted groups for safer adventures."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best time for trekking in Himachal Pradesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best time for Himachal Pradesh treks is April-June and September-November. Summer offers pleasant weather and clear views, while autumn provides stable conditions and beautiful landscapes."
        }
      }
    ]
  };

  // Custom hook to update document head - React 19 compatible
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Helper function to update or create meta tags
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

    // Helper function to update or create link tags
    const updateLink = (rel, href) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Helper function to add structured data
    const addStructuredData = (data, id) => {
      // Remove existing script with same id if exists
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    // Update basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'Trovia Team');
    updateMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMeta('googlebot', 'index, follow');
    updateMeta('bingbot', 'index, follow');
    
    // Update language and locale
    updateMeta('content-language', 'en-IN', 'http-equiv');
    updateMeta('language', 'English');
    
    // Update OpenGraph tags
    updateMeta('og:type', type, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:image:width', '1200', 'property');
    updateMeta('og:image:height', '630', 'property');
    updateMeta('og:site_name', 'Trovia', 'property');
    updateMeta('og:locale', 'en_IN', 'property');
    
    // Update Twitter tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:url', url);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@trovia_in');
    updateMeta('twitter:creator', '@trovia_in');
    
    // Update additional SEO meta tags
    updateMeta('theme-color', '#3399cc');
    updateMeta('msapplication-TileColor', '#3399cc');
    updateMeta('application-name', 'Trovia');
    updateMeta('apple-mobile-web-app-title', 'Trovia');
    
    // Update geographic targeting
    updateMeta('geo.region', 'IN');
    updateMeta('geo.placename', 'India');
    updateMeta('geo.position', '28.6139;77.2090');
    updateMeta('ICBM', '28.6139, 77.2090');
    
    // Update business information
    updateMeta('rating', '4.8');
    updateMeta('price', '₹2000-15000');
    updateMeta('priceCurrency', 'INR');
    updateMeta('availability', 'InStock');
    
    // Update canonical URL
    updateLink('canonical', canonical || url);
    
    // Add structured data
    addStructuredData(structuredData || defaultStructuredData, 'website-schema');
    addStructuredData(organizationSchema, 'organization-schema');
    addStructuredData(breadcrumbSchema, 'breadcrumb-schema');
    addStructuredData(faqSchema, 'faq-schema');

    // Cleanup function to remove scripts when component unmounts
    return () => {
      const schemas = ['website-schema', 'organization-schema', 'breadcrumb-schema', 'faq-schema'];
      schemas.forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, [title, description, keywords, url, image, type, canonical, structuredData]);

  return null; // This component doesn't render anything visible
};

export default SEOHelmet;

// Usage Examples:

// For Homepage:
export const HomepageSEO = () => (
  <SEOHelmet
    title="Trovia - Book Affordable Adventure Treks & Join Travel Community | India's Best Trekking Platform"
    description="Join 50,000+ adventure seekers! Book affordable treks in Himachal, Uttarakhand, Ladakh. Solo & group adventures, expert guides, safe travel. Starting ₹2000. Book now!"
    keywords="affordable treks India, group treks, solo travel, adventure community, book treks online, Himachal Pradesh treks, Uttarakhand trekking, weekend trips Delhi Mumbai Bangalore"
    url="https://trovia.in"
  />
);

// For Explore Page:
export const ExploreSEO = () => (
  <SEOHelmet
    title="Explore Treks in India | Himachal, Uttarakhand, Ladakh Adventure Packages | Trovia"
    description="Discover 200+ verified treks across India. Himachal Pradesh, Uttarakhand, Ladakh adventures. Filter by difficulty, duration, budget. Expert guides, safe groups."
    keywords="explore treks India, Himachal Pradesh treks, Uttarakhand trekking packages, Ladakh adventure trips, beginner treks, advanced mountaineering, weekend treks"
    url="https://trovia.in/explore"
  />
);

// For Community Page:
export const CommunitySEO = () => (
  <SEOHelmet
    title="Join Trekking Community | Connect with Adventure Travelers | Trovia"
    description="Connect with 50,000+ trekkers! Share experiences, find travel buddies, get expert advice. Join region-specific groups, plan trips together. Free to join!"
    keywords="trekking community India, adventure travel groups, find travel buddies, solo travelers community, trek planning groups, mountaineering community"
    url="https://trovia.in/community"
  />
);

// For Individual Trek Pages:
export const TrekSEO = ({ trek }) => (
  <SEOHelmet
    title={`${trek.title} Trek Booking | ${trek.location} Adventure | Trovia`}
    description={`Book ${trek.title} trek in ${trek.location}. ${trek.duration} days, ${trek.difficulty} difficulty. Expert guides, safety gear included. Starting ₹${trek.price}. Book now!`}
    keywords={`${trek.title} trek, ${trek.location} trekking, ${trek.difficulty} treks, ${trek.duration} day trek, book ${trek.title} online`}
    url={`https://trovia.in/trek/${trek.id}`}
    image={trek.imageUrl}
    structuredData={{
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": trek.title,
      "description": trek.description,
      "image": trek.imageUrl,
      "url": `https://trovia.in/trek/${trek.id}`,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": trek.latitude,
        "longitude": trek.longitude
      },
      "offers": {
        "@type": "Offer",
        "price": trek.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": trek.rating,
        "reviewCount": trek.reviewCount
      }
    }}
  />
);
