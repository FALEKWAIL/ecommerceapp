'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';

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
  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = wishlist.includes(name);

  // 3D Card Hover Tilt Effect
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
            const isOutOfStock = outOfStockSizes.includes(size);
            return (
              <span 
                key={size}
                className={`${isSelected ? 'size-sel' : ''} ${isOutOfStock ? 'size-out' : ''}`}
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
export default function Home() {
  const { showToast } = useApp();
  const [translateY, setTranslateY] = useState(0);
  const [email, setEmail] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Parallax Hero Letterform
  useEffect(() => {
    const handleScroll = () => {
      setTranslateY(window.scrollY * 0.25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Reveal triggers
  useEffect(() => {
    const selectors = [
      '.cat-item',
      '.campaign-text',
      '.campaign-image',
      '.trust-item',
      '.product-card',
      '.newsletter-inner',
      '.footer-col',
      '.footer-brand',
      '.products-header',
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.setAttribute('data-reveal', '');
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setFormSuccess(true);
    setEmail('');
    
    setTimeout(() => {
      setFormSuccess(false);
    }, 600);

    showToast("You're on the list. Welcome to VORN.");
  };

  return (
    <main>
      {/* ───── HERO SECTION ───── */}
      <section className="hero" id="hero">
        <div className="hero-left">
          <div 
            className="hero-bg-text" 
            aria-hidden="true"
            style={{ transform: `translate(-50%, calc(-50% + ${translateY}px))` }}
          >
            VORN
          </div>
          <div className="hero-left-content">
            <div className="hero-tagline">
              <span>FASHION</span>
              <span>THAT MOVES</span>
              <span>WITH YOU.</span>
            </div>
            <div className="hero-ctas">
              <a href="#all-products" className="btn btn-primary" id="btn-shop-now">SHOP NOW</a>
              <a href="/new-in" className="btn btn-ghost" id="btn-explore">EXPLORE NEW IN</a>
            </div>
          </div>
          <div className="hero-season-label">
            <span>NEW COLLECTION</span>
            <span>SS26</span>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="assets/images/daniel-dalea-ou6Izmhpxtg-unsplash.jpg"
            alt="VORN — Men's Fashion Editorial"
            className={`hero-img ${heroImageLoaded ? 'loaded' : ''}`}
            id="hero-img"
            loading="eager"
            onLoad={() => setHeroImageLoaded(true)}
          />
        </div>
      </section>

      {/* ───── CATEGORY BAND ───── */}
      <section className="cat-band" id="cat-band">
        <div className="cat-item" id="cat-essentials">
          <div className="cat-img-wrap">
            <img src="assets/images/caleb-EIOmriN64sU-unsplash.jpg" alt="Men's Essentials" />
          </div>
          <div className="cat-info">
            <h3>ESSENTIALS</h3>
            <p>The foundation of every wardrobe.</p>
            <a href="#" className="cat-link">SHOP ESSENTIALS →</a>
          </div>
        </div>

        <div className="cat-item" id="cat-outerwear">
          <div className="cat-img-wrap cat-img-dark">
            <div className="cat-placeholder-text">OUTER<br />WEAR</div>
          </div>
          <div className="cat-info">
            <h3>OUTERWEAR</h3>
            <p>Built for the city. Built for every season.</p>
            <a href="#" className="cat-link">SHOP OUTERWEAR →</a>
          </div>
        </div>

        <div className="cat-item" id="cat-streetwear">
          <div className="cat-img-wrap cat-img-sand">
            <div className="cat-placeholder-text">STREET<br />WEAR</div>
          </div>
          <div className="cat-info">
            <h3>STREETWEAR</h3>
            <p>Raw style. Refined edge.</p>
            <a href="#" className="cat-link">SHOP STREETWEAR →</a>
          </div>
        </div>
      </section>

      {/* ───── CAMPAIGN / EDITORIAL SECTION ───── */}
      <section className="campaign" id="campaign">
        <div className="campaign-text">
          <p className="campaign-eyebrow">NEW SEASON — SS26</p>
          <h2 className="campaign-headline">
            <span>MADE</span>
            <span>FOR THE</span>
            <span>STREETS.</span>
          </h2>
          <p className="campaign-body">
            Elevated everyday essentials for the man who moves with intention. Every piece engineered to outlast the moment.
          </p>
          <a href="#" className="btn btn-primary" id="btn-campaign">EXPLORE COLLECTION</a>
        </div>
        <div className="campaign-image">
          <img
            src="assets/images/caleb-EIOmriN64sU-unsplash.jpg"
            alt="VORN SS26 Campaign — Street Editorial"
            loading="lazy"
          />
          <div className="campaign-img-label">SS26 CAMPAIGN</div>
        </div>
      </section>

      {/* ───── TRUST BADGES ───── */}
      <section className="trust-band" id="trust-band">
        <div className="trust-item">
          <div className="trust-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 4v3h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>FREE DELIVERY</strong>
            <span>On all orders, always</span>
          </div>
        </div>

        <div className="trust-divider"></div>

        <div className="trust-item">
          <div className="trust-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>EASY RETURNS</strong>
            <span>Hassle-free within 30 days</span>
          </div>
        </div>

        <div className="trust-divider"></div>

        <div className="trust-item">
          <div className="trust-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>QUALITY ASSURED</strong>
            <span>Every piece, crafted to last</span>
          </div>
        </div>

        <div className="trust-divider"></div>

        <div className="trust-item">
          <div className="trust-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>SECURE PAYMENT</strong>
            <span>100% encrypted checkout</span>
          </div>
        </div>
      </section>

      {/* ───── BEST SELLERS ───── */}
      <section className="products" id="products">
        <div className="products-header">
          <h2 className="products-title">BEST OF VORN</h2>
          <a href="#" className="products-view-all" id="link-view-all">VIEW ALL</a>
        </div>

        <div className="products-grid" id="products-grid">
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
            id={2}
            name="Oversized Cargo Tee"
            category="TOPS"
            price="$49.00"
            originalPrice="$69.00"
            sizes={['S', 'M', 'L', 'XL', 'XXL']}
            selectedSize="M"
            outOfStockSizes={['XXL']}
            label="SALE"
            imgClass="product-img-2"
            colors={['Sable', 'Noir', 'Kaki']}
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
            id={4}
            name="Heavyweight Crew Sweat"
            category="KNITWEAR"
            price="$95.00"
            sizes={['XS', 'S', 'M', 'L', 'XL']}
            selectedSize="L"
            imgClass="product-img-4"
            colors={['Gris', 'Noir', 'Ecru']}
          />
        </div>
      </section>

      {/* ───── ALL ARTICLES SECTION ───── */}
      <section className="products" id="all-products" style={{ borderTop: '1px solid var(--col-border)' }}>
        <div className="products-header">
          <h2 className="products-title">TOUS NOS ARTICLES</h2>
        </div>

        <div className="products-grid" id="all-products-grid">
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
            id={6}
            name="Classic Slim Chinos"
            category="BOTTOMS"
            price="$65.00"
            sizes={['30', '32', '34', '36']}
            selectedSize="32"
            imgClass="product-img-6"
            colors={['Khaki', 'Bleu Marine', 'Sable']}
          />

          <ProductCard
            id={7}
            name="Knitted Linen Polo"
            category="TOPS"
            price="$55.00"
            sizes={['S', 'M', 'L', 'XL']}
            selectedSize="M"
            imgClass="product-img-7"
            colors={['Sable', 'Ecru', 'Noir']}
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

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <a href="#" className="btn btn-primary" style={{ padding: '16px 40px', letterSpacing: '0.18em' }}>
            VOIR PLUS D&apos;ARTICLES
          </a>
        </div>
      </section>

      {/* ───── MARQUEE STRIP ───── */}
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-track">
          <span>VORN</span><span>·</span>
          <span>NEW COLLECTION</span><span>·</span>
          <span>SS26</span><span>·</span>
          <span>DEFINE YOUR STANDARD</span><span>·</span>
          <span>VORN</span><span>·</span>
          <span>NEW COLLECTION</span><span>·</span>
          <span>SS26</span><span>·</span>
          <span>DEFINE YOUR STANDARD</span><span>·</span>
          <span>VORN</span><span>·</span>
          <span>NEW COLLECTION</span><span>·</span>
          <span>SS26</span><span>·</span>
          <span>DEFINE YOUR STANDARD</span><span>·</span>
        </div>
      </div>

      {/* ───── NEWSLETTER ───── */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter-inner">
          <p className="newsletter-eyebrow">STAY IN THE LOOP</p>
          <h2 className="newsletter-title">FIRST TO KNOW.<br />FIRST TO WEAR.</h2>
          <p className="newsletter-sub">Drop alerts, exclusive offers, and early access — straight to your inbox.</p>
          <form 
            className={`newsletter-form ${formSuccess ? 'success' : ''}`}
            id="newsletter-form"
            onSubmit={handleNewsletter}
          >
            <input
              type="email"
              id="newsletter-email"
              className="newsletter-input"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <button type="submit" className="btn btn-primary" id="btn-subscribe">SUBSCRIBE</button>
          </form>
          <p className="newsletter-legal">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}
