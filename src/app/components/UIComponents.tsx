'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ── ANNOUNCEMENT BAR ────────────────────────────────────
export function AnnouncementBar() {
  const { isAnnounceVisible, dismissAnnounce } = useApp();

  if (!isAnnounceVisible) return null;

  return (
    <div className="announce-bar" id="announce-bar">
      <span>FREE SHIPPING ON ALL ORDERS — NO MINIMUM</span>
      <span className="announce-sep">|</span>
      <span>NEW COLLECTION DROP — EVERY FRIDAY</span>
      <span className="announce-sep">|</span>
      <span>30-DAY EASY RETURNS</span>
      <button 
        className="announce-close" 
        onClick={dismissAnnounce}
        aria-label="Close announcement"
      >
        ✕
      </button>
    </div>
  );
}

// ── NAVBAR ──────────────────────────────────────────────
export function Navbar() {
  const { cartItems, setCartOpen, setSearchOpen, setMobileMenuOpen, setWishlistOpen } = useApp();

  return (
    <nav className="nav" id="nav">
      <div className="nav-left">
        <a href="/products" className="nav-link" id="nav-men">MEN</a>
        <a href="/new-in" className="nav-link" id="nav-new">NEW IN</a>
        <a href="/products" className="nav-link" id="nav-collections">COLLECTIONS</a>
        <a href="/products" className="nav-link" id="nav-sale">SALE</a>
      </div>

      <a href="/" className="nav-logo" id="nav-logo" aria-label="VORN Home">
        VORN
      </a>

      <div className="nav-right">
        <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span>SEARCH</span>
        </button>
        <button className="nav-icon-btn" aria-label="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>ACCOUNT</span>
        </button>
        <button className="nav-icon-btn" aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>WISHLIST</span>
        </button>
        <button 
          className="nav-icon-btn nav-cart" 
          onClick={() => setCartOpen(true)}
          aria-label="Cart"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>CART (<span id="cart-count">{cartItems.length}</span>)</span>
        </button>
      </div>

      {/* Mobile hamburger */}
      <button 
        className="nav-hamburger" 
        onClick={() => setMobileMenuOpen(true)} 
        aria-label="Open menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}

// ── HEADER CONTAINER ───────────────────────────────────
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-container ${isScrolled ? 'scrolled' : ''}`} id="header-container">
      <AnnouncementBar />
      <Navbar />
    </header>
  );
}

// ── MOBILE MENU OVERLAY ────────────────────────────────
export function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen, setWishlistOpen, setSearchOpen } = useApp();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobile-menu">
      <button 
        className="mobile-menu-close" 
        onClick={() => setMobileMenuOpen(false)}
      >
        ✕
      </button>
      <div className="mobile-menu-links">
        <a href="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>MEN</a>
        <a href="/new-in" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>NEW IN</a>
        <a href="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>COLLECTIONS</a>
        <a href="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>SALE</a>
      </div>
      <div className="mobile-menu-bottom">
        <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setSearchOpen(true); }}>Search</a>
        <a href="#" onClick={(e) => { e.preventDefault(); }}>Account</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setWishlistOpen(true); }}>Wishlist</a>
      </div>
    </div>
  );
}

// ── SEARCH OVERLAY ────────────────────────────────────
export function SearchOverlay() {
  const { isSearchOpen, setSearchOpen } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div 
      className="search-overlay active" 
      id="search-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSearchOpen(false);
      }}
    >
      <button className="search-overlay-close" onClick={() => setSearchOpen(false)}>✕</button>
      <form className="search-overlay-form" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="text"
          className="search-overlay-input"
          id="search-input"
          placeholder="Search VORN..."
          autoComplete="off"
        />
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </form>
      <p className="search-overlay-hint">Try: Overshirt · Cargo · Knitwear · Sale</p>
    </div>
  );
}

// ── CART DRAWER ───────────────────────────────────────
export function CartDrawer() {
  const { isCartOpen, setCartOpen, cartItems, removeFromCart, startCartOrder } = useApp();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cart-drawer">
        <div className="cart-drawer-header">
          <h3>YOUR BAG (<span id="cart-drawer-count">{cartItems.length}</span>)</h3>
          <button className="cart-drawer-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-drawer-body" id="cart-drawer-body">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Your bag is empty.</p>
          ) : (
            cartItems.map((item, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '14px 0', 
                  borderBottom: '1px solid var(--col-border)' 
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--col-dark)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.1em', color: 'var(--col-muted)', marginTop: '4px' }}>
                    SIZE {item.size} · QTY {item.qty}
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(i)} 
                  style={{ fontSize: '16px', color: 'var(--col-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-drawer-footer">
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ width: '100%', textAlign: 'center' }}
            onClick={startCartOrder}
          >
            CHECKOUT / COMMANDER
          </button>
        </div>
      </div>
      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`} 
        id="cart-overlay"
        onClick={() => setCartOpen(false)}
      />
    </>
  );
}

// ── TOAST NOTIFICATION ──────────────────────────────────
export function Toast() {
  const { isToastVisible, toastMessage } = useApp();

  return (
    <div className={`toast ${isToastVisible ? 'show' : ''}`}>
      {toastMessage}
    </div>
  );
}

// ── CURSOR GLOW ─────────────────────────────────────────
export function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches);
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isMobile) return null;

  return (
    <div
      className="cursor-glow"
      style={{
        left: position.x + 'px',
        top: position.y + 'px',
      }}
    />
  );
}

// ── FOOTER ──────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#" className="footer-logo">VORN</a>
          <p className="footer-brand-desc">
            Contemporary menswear for those who move with intention. Crafted with purpose. Worn with conviction.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social" aria-label="Instagram" id="link-instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="footer-social" aria-label="TikTok" id="link-tiktok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
            <a href="#" className="footer-social" aria-label="Pinterest" id="link-pinterest">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0" />
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 12v9" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>SHOP</h4>
          <ul>
            <li><a href="#">New In</a></li>
            <li><a href="#">Tops &amp; Tees</a></li>
            <li><a href="#">Outerwear</a></li>
            <li><a href="#">Bottoms</a></li>
            <li><a href="#">Knitwear</a></li>
            <li><a href="#">Sale</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>HELP</h4>
          <ul>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Delivery Info</a></li>
            <li><a href="#">Returns &amp; Exchanges</a></li>
            <li><a href="#">Track My Order</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>ABOUT</h4>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 VORN. All rights reserved.</p>
        <div className="footer-payments">
          <span className="payment-badge">VISA</span>
          <span className="payment-badge">MASTERCARD</span>
          <span className="payment-badge">PAYPAL</span>
          <span className="payment-badge">APPLE PAY</span>
        </div>
      </div>
    </footer>
  );
}

// Re-export OrderModal so layout.tsx can render it
export { OrderModal } from './OrderModal';

// Wishlist Drawer Component
export function WishlistDrawer() {
  const { isWishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart, products } = useApp();

  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  const getProductImageProps = (name: string) => {
    const p = products.find(prod => prod.name === name);
    if (!p) return { className: 'product-img-1', style: undefined };
    if (p.img_url) {
      return {
        className: '',
        style: { backgroundImage: `url(${p.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '50px', height: '62px' }
      };
    }
    return { className: p.img_class || 'product-img-1', style: { width: '50px', height: '62px' } };
  };

  const getProductPrice = (name: string) => {
    const p = products.find(prod => prod.name === name);
    return p ? p.price : '$89.00';
  };

  return (
    <>
      <div 
        className={`cart-drawer ${isWishlistOpen ? 'open' : ''}`} 
        id="wishlist-drawer" 
        style={{ 
          right: isWishlistOpen ? '0' : '-420px', 
          left: 'auto',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.12)'
        }}
      >
        <div className="cart-drawer-header">
          <h3>VOS FAVORIS (<span id="wishlist-drawer-count">{wishlist.length}</span>)</h3>
          <button className="cart-drawer-close" onClick={() => setWishlistOpen(false)}>✕</button>
        </div>
        <div className="cart-drawer-body">
          {wishlist.length === 0 ? (
            <p className="cart-empty">Votre liste de favoris est vide.</p>
          ) : (
            wishlist.map((name, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  gap: '16px',
                  alignItems: 'center', 
                  padding: '16px 0', 
                  borderBottom: '1px solid var(--col-border)' 
                }}
              >
                {(() => {
                  const props = getProductImageProps(name);
                  return (
                    <div 
                      className={`order-summary-img ${props.className}`} 
                      style={props.style}
                    />
                  );
                })()}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--col-dark)', fontWeight: 500 }}>
                    {name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--col-sand)', marginTop: '4px' }}>
                    {getProductPrice(name)}
                  </div>
                  <button 
                    type="button"
                    onClick={() => { addToCart(name, 'M'); toggleWishlist(name); }}
                    style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '10px', 
                      letterSpacing: '0.1em', 
                      color: 'var(--col-white)', 
                      backgroundColor: 'var(--col-dark)', 
                      border: 'none', 
                      padding: '8px 12px',
                      marginTop: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    AJOUTER AU PANIER
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => toggleWishlist(name)} 
                  style={{ fontSize: '16px', color: 'var(--col-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-label="Enlever des favoris"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div 
        className={`cart-overlay ${isWishlistOpen ? 'active' : ''}`} 
        id="wishlist-overlay"
        onClick={() => setWishlistOpen(false)}
      />
    </>
  );
}

// Product Details Drawer Component
export function ProductDetailDrawer() {
  const { isDetailOpen, setDetailOpen, detailProduct, addToCart, startDirectOrder } = useApp();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (detailProduct) {
      setSelectedSize(detailProduct.sizes[0] || 'M');
      setSelectedColor(detailProduct.colors[0] || 'Default');
    }
  }, [detailProduct]);

  useEffect(() => {
    if (isDetailOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDetailOpen]);

  if (!detailProduct) return null;

  return (
    <>
      <div 
        className={`cart-drawer ${isDetailOpen ? 'open' : ''}`} 
        id="detail-drawer" 
        style={{ 
          right: isDetailOpen ? '0' : '-420px', 
          left: 'auto',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
          width: '420px',
          maxWidth: '100vw',
          zIndex: 99999
        }}
      >
        <div className="cart-drawer-header">
          <h3>DÉTAILS DE L&apos;ARTICLE</h3>
          <button className="cart-drawer-close" onClick={() => setDetailOpen(false)}>✕</button>
        </div>
        <div className="cart-drawer-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image */}
          <div 
            className={detailProduct.img_url ? "" : `order-summary-img ${detailProduct.img_class}`} 
            style={detailProduct.img_url ? { 
              backgroundImage: `url(${detailProduct.img_url})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              width: '100%', 
              height: '280px',
              borderRadius: '2px'
            } : { 
              width: '100%', 
              height: '280px',
              borderRadius: '2px'
            }}
          />

          {/* Info */}
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--col-muted)' }}>
              {detailProduct.category}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, letterSpacing: '0.06em', margin: '4px 0 8px' }}>
              {detailProduct.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--col-sand)' }}>
                {detailProduct.price}
              </span>
              {detailProduct.original_price && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--col-muted)', textDecoration: 'line-through' }}>
                  {detailProduct.original_price}
                </span>
              )}
            </div>
          </div>

          {/* Selectable Sizes */}
          {detailProduct.sizes && detailProduct.sizes.length > 0 && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--col-muted)', marginBottom: '8px' }}>
                CHOISIR LA TAILLE
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {detailProduct.sizes.map((size: string) => {
                  const isSel = size === selectedSize;
                  const isOut = detailProduct.out_of_stock_sizes?.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={isOut}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '10px 14px',
                        border: `1px solid ${isSel ? 'var(--col-dark)' : 'var(--col-border)'}`,
                        background: isSel ? 'var(--col-dark)' : 'none',
                        color: isSel ? 'var(--col-white)' : isOut ? 'var(--col-muted)' : 'var(--col-dark)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '11px',
                        cursor: isOut ? 'not-allowed' : 'pointer',
                        opacity: isOut ? 0.35 : 1,
                        textDecoration: isOut ? 'line-through' : 'none',
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selectable Colors */}
          {detailProduct.colors && detailProduct.colors.length > 0 && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--col-muted)', marginBottom: '8px' }}>
                COULEURS DISPONIBLES
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {detailProduct.colors.map((color: string) => {
                  const isSel = color === selectedColor;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${isSel ? 'var(--col-dark)' : 'var(--col-border)'}`,
                        background: isSel ? 'var(--col-dark)' : 'none',
                        color: isSel ? 'var(--col-white)' : 'var(--col-dark)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                addToCart(detailProduct.name, selectedSize);
                setDetailOpen(false);
              }}
              style={{ width: '100%', border: 'none', cursor: 'pointer', display: 'block', textAlign: 'center' }}
            >
              AJOUTER AU PANIER
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                startDirectOrder({
                  name: detailProduct.name,
                  price: detailProduct.price,
                  imgClass: detailProduct.img_class || 'product-img-1',
                  imgUrl: detailProduct.img_url,
                  sizes: detailProduct.sizes,
                  colors: detailProduct.colors,
                });
                setDetailOpen(false);
              }}
              style={{ width: '100%', cursor: 'pointer', display: 'block', textAlign: 'center' }}
            >
              COMMANDER MAINTENANT (CASH)
            </button>
          </div>
        </div>
      </div>
      <div 
        className={`cart-overlay ${isDetailOpen ? 'active' : ''}`} 
        id="detail-overlay"
        onClick={() => setDetailOpen(false)}
        style={{ zIndex: 99998 }}
      />
    </>
  );
}
