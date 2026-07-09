'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, products } = useApp();

  // Apply body class for header/footer transitions
  useEffect(() => {
    document.body.classList.add('full-bg-page');
    return () => {
      document.body.classList.remove('full-bg-page');
    };
  }, []);

  // Retrieve full product data for each item in the wishlist
  const wishlistProducts = wishlist
    .map((name) => products.find((p) => p.name === name))
    .filter(Boolean);

  return (
    <main
      style={{
        backgroundImage: "url('/assets/images/daniel-dalea-ou6Izmhpxtg-unsplash.jpg')",
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

      {/* Wishlist Panel */}
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
        <div style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--col-sand)', textTransform: 'uppercase', marginBottom: '8px' }}>
            FAVORITES / WISHLIST
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1.1 }}>
            YOUR WISHLIST ({wishlist.length})
          </h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '24px' }}>
              Your wishlist is empty.
            </p>
            <a
              href="/products"
              className="btn btn-primary"
              style={{ background: 'var(--col-sand)', color: 'var(--col-dark)', textDecoration: 'none', display: 'inline-block', padding: '14px 28px' }}
            >
              BROWSE CATALOG
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {wishlistProducts.map((product: any) => (
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
                {/* Product Thumbnail */}
                <div
                  className={product.img_url ? "" : product.img_class}
                  style={{
                    backgroundImage: product.img_url ? `url(${product.img_url})` : undefined,
                    height: '240px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.name)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(12, 12, 12, 0.65)',
                      border: 'none',
                      color: 'var(--col-sand)',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                    aria-label="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>

                {/* Metadata & Actions */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {product.category}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em', color: '#fff', margin: '0 0 6px 0', minHeight: '36px' }}>
                    {product.name}
                  </h3>
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
    </main>
  );
}
