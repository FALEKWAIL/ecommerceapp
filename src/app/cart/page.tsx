'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { cartItems, updateCartQty, removeFromCart, startCartOrder, products } = useApp();

  // Apply body class for header/footer transitions
  useEffect(() => {
    document.body.classList.add('full-bg-page');
    return () => {
      document.body.classList.remove('full-bg-page');
    };
  }, []);

  // Find product price and image class
  const getItemDetails = (name: string) => {
    const p = products.find((prod) => prod.name === name);
    if (p) {
      const priceVal = parseFloat(p.price.replace('$', '')) || 0;
      return { priceStr: p.price, priceVal, imgClass: p.img_class };
    }
    return { priceStr: '$0.00', priceVal: 0, imgClass: 'product-img-1' };
  };

  // Calculate cart total
  const subtotal = cartItems.reduce((acc, item) => {
    const { priceVal } = getItemDetails(item.name);
    return acc + (priceVal * item.qty);
  }, 0);

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

      {/* Cart Container */}
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
            SHOPPING BAG / PANIER
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1.1 }}>
            YOUR BAG ({cartItems.length})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '24px' }}>
              Your shopping bag is empty.
            </p>
            <a
              href="/products"
              className="btn btn-primary"
              style={{ background: 'var(--col-sand)', color: 'var(--col-dark)', textDecoration: 'none', display: 'inline-block', padding: '14px 28px' }}
            >
              CONTINUE SHOPPING
            </a>
          </div>
        ) : (
          <div>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {cartItems.map((item, idx) => {
                const { priceStr, priceVal, imgClass } = getItemDetails(item.name);
                const itemTotal = (priceVal * item.qty).toFixed(2);

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      padding: '20px',
                      borderRadius: '2px',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      className={imgClass}
                      style={{
                        width: '70px',
                        height: '90px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />

                    {/* Meta */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--col-sand)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        {priceStr}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        <span>SIZE: {item.size}</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px' }}>
                      <button
                        type="button"
                        onClick={() => updateCartQty(idx, item.qty - 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}
                      >
                        −
                      </button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontFamily: 'var(--font-display)' }}>
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(idx, item.qty + 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}
                      >
                        +
                      </button>
                    </div>

                    {/* Total & Delete */}
                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                        ${itemTotal}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.4)',
                          fontSize: '11px',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          marginTop: '6px',
                          padding: 0,
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '24px',
              }}
            >
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  SHIPPING &amp; TAXES
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Calculated at checkout. Cash on Delivery supported.
                </p>
              </div>

              <div style={{ textAlign: 'right', minWidth: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-ui)' }}>SUBTOTAL:</span>
                  <span style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--col-sand)' }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={startCartOrder}
                  className="btn btn-primary"
                  style={{
                    background: 'var(--col-sand)',
                    color: 'var(--col-dark)',
                    width: '100%',
                    padding: '16px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  CHECKOUT / COMMANDER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
