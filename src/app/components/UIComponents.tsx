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
        <a href="#" className="nav-link" id="nav-men">MEN</a>
        <a href="#" className="nav-link" id="nav-new">NEW IN</a>
        <a href="#" className="nav-link" id="nav-collections">COLLECTIONS</a>
        <a href="#" className="nav-link" id="nav-sale">SALE</a>
      </div>

      <a href="#" className="nav-logo" id="nav-logo" aria-label="VORN Home">
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
        <a href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>MEN</a>
        <a href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>NEW IN</a>
        <a href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>COLLECTIONS</a>
        <a href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>SALE</a>
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
  const { isWishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart } = useApp();

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

  const getProductImageClass = (name: string) => {
    switch (name) {
      case "Washed Canvas Overshirt": return "product-img-1";
      case "Oversized Cargo Tee": return "product-img-2";
      case "Relaxed Cargo Trousers": return "product-img-3";
      case "Heavyweight Crew Sweat": return "product-img-4";
      case "Urban Bomber Jacket": return "product-img-5";
      case "Classic Slim Chinos": return "product-img-6";
      case "Knitted Linen Polo": return "product-img-7";
      case "Minimalist Leather Sneakers": return "product-img-8";
      default: return "product-img-1";
    }
  };

  const getProductPrice = (name: string) => {
    switch (name) {
      case "Washed Canvas Overshirt": return "$89.00";
      case "Oversized Cargo Tee": return "$49.00";
      case "Relaxed Cargo Trousers": return "$79.00";
      case "Heavyweight Crew Sweat": return "$95.00";
      case "Urban Bomber Jacket": return "$120.00";
      case "Classic Slim Chinos": return "$65.00";
      case "Knitted Linen Polo": return "$55.00";
      case "Minimalist Leather Sneakers": return "$110.00";
      default: return "$89.00";
    }
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
                <div className={`order-summary-img ${getProductImageClass(name)}`} style={{ width: '50px', height: '62px' }}></div>
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
