'use client';

import React, { useEffect } from 'react';
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
  label?: 'NEW' | 'SALE';
  imgClass: string;
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
  colors,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, startDirectOrder } = useApp();
  const [isAdded, setIsAdded] = React.useState(false);
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
      sizes,
      colors,
    });
  };

  return (
    <article 
      className="product-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.1s ease-out' }}
    >
      <div className="product-img-wrap">
        <div className={`product-img ${imgClass}`}>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill={noneOrColor(isWishlisted)} stroke="currentColor" strokeWidth="1.5">
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
              <span 
                key={size}
                className={isSelected ? 'size-sel' : ''}
              >
                {size}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function noneOrColor(isActive: boolean) {
  return isActive ? 'currentColor' : 'none';
}

// ── MAIN PAGE COMPONENT ────────────────────────────────
export default function NewInPage() {
  // Set reveal class logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ paddingTop: 'calc(var(--nav-h) + var(--announce-h))', minHeight: '80vh', background: 'var(--col-bg)' }}>
      {/* ───── BREADCRUMBS & TITLE ───── */}
      <section style={{ padding: '60px 40px 40px', borderBottom: '1px solid var(--col-border)' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--col-muted)', marginBottom: '16px' }}>
          ACCUEIL / NEW IN
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 900, letterSpacing: '0.08em', color: 'var(--col-dark)', margin: 0 }}>
          NEW IN — SS26
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--col-mid)', marginTop: '8px', maxWidth: '500px', lineHeight: 1.6 }}>
          Explorez nos dernières nouveautés et les pièces incontournables de la saison, conçues pour allier style de rue et finitions sophistiquées.
        </p>
      </section>

      {/* ───── NEW ARRIVALS GRID ───── */}
      <section className="products" style={{ padding: '60px 40px 100px' }}>
        <div className="products-grid">
          <ProductCard
            id={1}
            name="Washed Canvas Overshirt"
            category="OUTERWEAR"
            price="$89.00"
            sizes={['XS', 'S', 'M', 'L', 'XL']}
            selectedSize="M"
            label="NEW"
            imgClass="product-img-1"
            colors={['Olive', 'Noir', 'Ecru']}
          />

          <ProductCard
            id={3}
            name="Relaxed Cargo Trousers"
            category="BOTTOMS"
            price="$79.00"
            sizes={['28', '30', '32', '34', '36']}
            selectedSize="32"
            label="NEW"
            imgClass="product-img-3"
            colors={['Noir', 'Khaki', 'Sauge']}
          />

          <ProductCard
            id={5}
            name="Urban Bomber Jacket"
            category="OUTERWEAR"
            price="$120.00"
            sizes={['S', 'M', 'L', 'XL']}
            selectedSize="M"
            label="NEW"
            imgClass="product-img-5"
            colors={['Noir', 'Bleu Marine', 'Olive']}
          />

          <ProductCard
            id={8}
            name="Minimalist Leather Sneakers"
            category="SHOES"
            price="$110.00"
            sizes={['40', '41', '42', '43', '44']}
            selectedSize="42"
            label="NEW"
            imgClass="product-img-8"
            colors={['Blanc', 'Noir']}
          />
        </div>
      </section>
    </main>
  );
}
