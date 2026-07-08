'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function SearchPage() {
  const { products, addToCart, openDetail } = useApp();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);

  // Apply body class for header/footer transitions
  useEffect(() => {
    document.body.classList.add('full-bg-page');
    return () => {
      document.body.classList.remove('full-bg-page');
    };
  }, []);

  // Filter products when query changes
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const results = products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(cleanQuery);
      const catMatch = p.category.toLowerCase().includes(cleanQuery);
      const colorMatch = p.colors?.some((c: string) => c.toLowerCase().includes(cleanQuery)) || false;
      const labelMatch = p.label?.toLowerCase().includes(cleanQuery) || false;
      return nameMatch || catMatch || colorMatch || labelMatch;
    });

    setFiltered(results);
  }, [query, products]);

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
  };

  return (
    <main
      style={{
        backgroundImage: "url('/assets/images/caleb-EIOmriN64sU-unsplash.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        paddingTop: 'calc(var(--nav-h) + var(--announce-h) + 60px)',
        paddingBottom: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      {/* Dark tint overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12, 12, 12, 0.45)',
          zIndex: 1,
        }}
      />

      {/* Search Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(12, 12, 12, 0.72)',
          backdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          padding: '60px 48px',
          width: '90%',
          maxWidth: '850px',
          color: '#fff',
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--col-sand)', textTransform: 'uppercase', marginBottom: '8px' }}>
            CATALOG SEARCH / RECHERCHE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: '24px' }}>
            SEARCH VORN
          </h1>

          {/* Search Input Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="SEARCH BY KEYWORD, CATEGORY, OR COLOR..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '16px 20px 16px 50px',
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                letterSpacing: '0.1em',
                color: '#fff',
                outline: 'none',
                borderRadius: '2px',
              }}
              autoFocus
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '18px' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* Suggestion hints */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-ui)' }}>TRY:</span>
            {['Overshirt', 'Cargo', 'Knitwear', 'Sale', 'Olive', 'Noir'].map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => handleSuggestionClick(keyword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--col-sand)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.05em',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {query.trim() && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              RESULTS ({filtered.length})
            </h3>

            {filtered.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                No matches found for "{query}".
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}
                  >
                    {/* Image Thumbnail */}
                    <div
                      className={product.img_class}
                      onClick={() => openDetail(product)}
                      style={{
                        height: '220px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                      }}
                    />

                    {/* Metadata & Actions */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {product.category}
                      </div>
                      <h4
                        onClick={() => openDetail(product)}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          color: '#fff',
                          margin: '0 0 6px 0',
                          minHeight: '36px',
                          cursor: 'pointer',
                        }}
                      >
                        {product.name}
                      </h4>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--col-sand)', marginBottom: '16px', fontWeight: 600 }}>
                        {product.price}
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(product.name, 'M')}
                        className="btn btn-primary"
                        style={{
                          background: 'var(--col-sand)',
                          color: 'var(--col-dark)',
                          width: '100%',
                          border: 'none',
                          padding: '10px',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          marginTop: 'auto',
                        }}
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
