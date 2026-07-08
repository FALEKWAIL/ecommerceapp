'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

// ── PRODUCT CARD COMPONENT ─────────────────────────────
interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  sizes: string[];
  selectedSize: string;
  outOfStockSizes?: string[];
  label?: 'NEW' | 'SALE' | null;
  imgClass: string;
  imgUrl?: string;
  colors: string[];
}

function ProductCard({
  name,
  category,
  price,
  originalPrice,
  sizes,
  selectedSize,
  outOfStockSizes = [],
  label,
  imgClass,
  imgUrl,
  colors,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, startDirectOrder, openDetail } = useApp();
  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = wishlist.includes(name);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 3;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 3;
    e.currentTarget.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart(name, selectedSize);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    startDirectOrder({
      name,
      price,
      imgClass,
      imgUrl,
      sizes,
      colors,
    });
  };

  const handleCardClick = () => {
    openDetail({
      name,
      category,
      price,
      original_price: originalPrice,
      sizes,
      out_of_stock_sizes: outOfStockSizes,
      label,
      img_class: imgClass,
      img_url: imgUrl,
      colors,
    });
  };

  return (
    <article 
      className="product-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{ transition: 'transform 0.1s ease-out', cursor: 'pointer' }}
    >
      <div className="product-img-wrap">
        <div 
          className={`product-img ${imgClass}`}
          style={imgUrl ? { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          <div className="product-img-overlay"></div>
          {label && (
            <div className={`product-label ${label === 'SALE' ? 'product-label-sale' : ''}`}>
              {label}
            </div>
          )}
          <button 
            type="button"
            className={`product-wishlist ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(name);
            }}
            aria-label="Ajouter aux favoris"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <div className="product-actions">
          <button 
            type="button"
            className={`product-quick-add-btn ${isAdded ? 'added' : ''}`}
            onClick={handleQuickAdd}
          >
            {isAdded ? 'AJOUTÉ ✓' : 'PANIER'}
          </button>
          <button 
            type="button"
            className="product-direct-order-btn"
            onClick={handleDirectOrder}
          >
            COMMANDER
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span className="product-category">{category}</span>
        </div>
        <h3 className="product-name">{name}</h3>
        <div className="product-price">
          <span className="price-current">{price}</span>
          {originalPrice && <span className="price-original">{originalPrice}</span>}
        </div>
        <div className="product-sizes">
          {sizes.map((size) => {
            const isSelected = size === selectedSize;
            return (
              <span key={size} className={isSelected ? 'size-sel' : ''}>
                {size}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

// ── MAIN PRODUCTS PAGE ──────────────────────────────────
export default function ProductsPage() {
  const { products, loadingProducts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Read URL search parameter for category filter client-side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) {
      const upperCat = cat.toUpperCase();
      setSelectedCategory(upperCat);
    }
  }, []);

  // Filter products by selected category or sale label
  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : selectedCategory === 'SALE'
      ? products.filter((p: any) => p.label === 'SALE')
      : products.filter((p: any) => p.category === selectedCategory);

  // Set reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredProducts]);

  const categories = ['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'KNITWEAR', 'STREETWEAR', 'ACCESSORIES', 'SALE'];

  return (
    <main style={{ paddingTop: 'calc(var(--nav-h) + var(--announce-h))', minHeight: '85vh', background: 'var(--col-bg)' }}>
      {/* Breadcrumbs & Title */}
      <section style={{ padding: '60px 40px 40px', borderBottom: '1px solid var(--col-border)' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--col-muted)', marginBottom: '16px' }}>
          ACCUEIL / NOS ARTICLES
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 900, letterSpacing: '0.08em', color: 'var(--col-dark)', margin: 0 }}>
          COLLECTION COMPLETE
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--col-mid)', marginTop: '8px', maxWidth: '500px', lineHeight: 1.6 }}>
          Découvrez notre catalogue complet d&apos;articles de prêt-à-porter masculin contemporain.
        </p>
      </section>

      {/* Category Filter Controls */}
      <section style={{ padding: '24px 40px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const isAct = cat === selectedCategory;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 18px',
                border: `1px solid ${isAct ? 'var(--col-dark)' : 'var(--col-border)'}`,
                background: isAct ? 'var(--col-dark)' : '#fff',
                color: isAct ? 'var(--col-bg)' : 'var(--col-muted)',
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* Products Grid */}
      <section className="products" style={{ padding: '40px 40px 100px' }}>
        <div className="products-grid">
          {loadingProducts ? (
            <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--col-muted)' }}>
              CHARGEMENT DES ARTICLES...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--col-muted)' }}>
              AUCUN ARTICLE DANS CETTE CATÉGORIE
            </div>
          ) : (
            filteredProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                category={p.category}
                price={p.price}
                originalPrice={p.original_price}
                sizes={p.sizes}
                selectedSize={p.sizes[0] || 'M'}
                outOfStockSizes={p.out_of_stock_sizes}
                label={p.label}
                imgClass={p.img_class}
                imgUrl={p.img_url}
                colors={p.colors}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
