import React, { useEffect, useState } from 'react';

const SEOTestComponent = () => {
  const [metaTags, setMetaTags] = useState([]);
  const [structuredData, setStructuredData] = useState([]);

  useEffect(() => {
    // Get all meta tags
    const allMetaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
      name: meta.getAttribute('name') || meta.getAttribute('property'),
      content: meta.getAttribute('content')
    })).filter(tag => tag.name);

    // Get structured data scripts
    const ldJsonScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(script => {
        try {
          return JSON.parse(script.textContent);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

    setMetaTags(allMetaTags);
    setStructuredData(ldJsonScripts);
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
      <h2>🔍 SEO Debug Panel</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>📑 Page Title:</h3>
        <p><strong>{document.title}</strong></p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🏷️ Meta Tags ({metaTags.length}):</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
          {metaTags.map((tag, index) => (
            <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
              <strong>{tag.name}:</strong> {tag.content}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📊 Structured Data ({structuredData.length} schemas):</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
          {structuredData.map((schema, index) => (
            <div key={index} style={{ marginBottom: '10px', fontSize: '12px' }}>
              <strong>Type:</strong> {schema['@type']} | <strong>Name:</strong> {schema.name || 'N/A'}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
        <p><strong>✅ SEO Status:</strong> {metaTags.length > 10 ? 'Good' : 'Needs Improvement'}</p>
        <p><strong>📈 Schema Count:</strong> {structuredData.length} (Recommended: 3+)</p>
      </div>
    </div>
  );
};

export default SEOTestComponent;
