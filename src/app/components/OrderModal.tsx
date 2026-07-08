'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function OrderModal() {
  const { isOrderOpen, setOrderOpen, orderProduct, placeOrder, cartItems, products } = useApp();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  // Snapshot of items being ordered, to preserve display after cart clears
  const [orderedItemsSnapshot, setOrderedItemsSnapshot] = useState<any[]>([]);

  // Reset states when the modal is opened for a new product
  useEffect(() => {
    if (orderProduct) {
      setSelectedColor(orderProduct.colors[0] || 'Default');
      setSelectedSize(orderProduct.sizes[0] || 'M');
      setIsSubmitted(false);
      setName('');
      setPhone('');

      if (orderProduct.isFromCart) {
        setOrderedItemsSnapshot([...cartItems]);
      } else {
        setOrderedItemsSnapshot([{ name: orderProduct.name, size: orderProduct.sizes[0] || 'M', qty: 1 }]);
      }
    }
  }, [orderProduct, cartItems]);

  if (!isOrderOpen || !orderProduct) return null;

  // Retrieve price/details for a product name
  const getProductDetails = (name: string) => {
    const p = products.find(prod => prod.name === name);
    if (p) {
      const priceVal = parseFloat(p.price.replace('$', '')) || 0;
      return { priceStr: p.price, priceVal };
    }
    return { priceStr: '$0.00', priceVal: 0 };
  };

  // Calculate order total
  const getOrderTotal = () => {
    return orderedItemsSnapshot.reduce((acc, item) => {
      const { priceVal } = getProductDetails(item.name);
      return acc + (priceVal * item.qty);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      setIsSubmitted(true);
      placeOrder({
        name,
        phone,
        wilaya,
        size: selectedSize,
        color: selectedColor,
      });
    }, 1200);
  };

  const wilayas = [
    '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
    '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
    '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
    '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
    '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
    '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
    '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arréridj', '35 - Boumerdès',
    '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
    '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
    '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', '49 - El M\'Ghair', 
    '50 - El Meniaa', '51 - Ouled Djellal', '52 - Bordj Baji Mokhtar', '53 - Béni Abbès', 
    '54 - In Salah', '55 - In Guezzam', '56 - Touggourt', '57 - Djanet', '58 - Timimoun'
  ];

  return (
    <div 
      className="order-overlay active" 
      onClick={(e) => {
        if (e.target === e.currentTarget) setOrderOpen(false);
      }}
    >
      <div className="order-modal">
        <button className="order-modal-close" onClick={() => setOrderOpen(false)}>✕</button>
        
        {!isSubmitted ? (
          <form className="order-form" onSubmit={handleSubmit}>
            <h2 className="order-title">COMMANDE DIRECTE</h2>
            <p className="order-subtitle">Finalisez votre commande rapidement. Paiement cash à la livraison.</p>
            
            {/* Detailed Summary Box */}
            <div className="order-summary-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div 
                  className={`order-summary-img ${orderProduct.imgClass}`}
                  style={orderProduct.imgUrl ? { backgroundImage: `url(${orderProduct.imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '50px', height: '62px' } : { width: '50px', height: '62px' }}
                ></div>
                <div className="order-summary-info" style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                    {orderProduct.isFromCart ? 'VOTRE PANIER' : orderProduct.name}
                  </h3>
                  <p className="order-summary-price" style={{ color: 'var(--col-sand)', fontWeight: 700, fontSize: '13px', margin: '4px 0 0 0' }}>
                    TOTAL: ${getOrderTotal().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Confirmation of ordered items */}
              <div style={{ borderTop: '1px solid var(--col-border)', paddingTop: '10px', marginTop: '2px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--col-muted)', marginBottom: '8px', fontWeight: 700 }}>
                  ARTICLES À CONFIRMER:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {orderedItemsSnapshot.map((item, i) => {
                    const { priceStr } = getProductDetails(item.name);
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--col-dark)' }}>
                        <span>
                          <strong>{item.qty}x</strong> {item.name} <span style={{ fontSize: '11px', color: 'var(--col-muted)' }}>(Taille {item.size})</span>
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{priceStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom attributes for direct order */}
            {!orderProduct.isFromCart && (
              <div className="order-attributes">
                <div className="form-group">
                  <label>CHOISIR LA TAILLE</label>
                  <div className="form-sizes-grid">
                    {orderProduct.sizes.map(size => (
                      <button
                        type="button"
                        key={size}
                        className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>CHOISIR LA COULEUR</label>
                  <div className="form-colors-grid">
                    {orderProduct.colors.map(color => (
                      <button
                        type="button"
                        key={color}
                        className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contact details */}
            <div className="form-group">
              <label htmlFor="fullname">NOM &amp; PRÉNOM *</label>
              <input
                id="fullname"
                type="text"
                className="form-input"
                placeholder="Ex: Mohamed Benrahla"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">NUMÉRO DE TÉLÉPHONE *</label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="Ex: 0555123456"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="wilaya">WILAYA DE DESTINATION *</label>
              <select
                id="wilaya"
                className="form-select"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
              >
                {wilayas.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-submit-order" disabled={isPlacing}>
              {isPlacing ? 'TRAITEMENT EN COURS...' : 'CONFIRMER LA COMMANDE'}
            </button>
          </form>
        ) : (
          <div className="order-success-view">
            <div className="success-icon" style={{ background: 'var(--col-sand)', color: 'var(--col-dark)' }}>✓</div>
            <h2 style={{ color: 'var(--col-sand)', fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.08em', marginBottom: '8px' }}>
              C&apos;EST FAIT ! / DONE !
            </h2>
            <p className="success-thankyou" style={{ fontWeight: 700, fontSize: '15px', color: 'var(--col-dark)', marginBottom: '16px' }}>
              Nous vous appellerons pour confirmer la commande.
            </p>
            <div className="success-details" style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--col-dark)', textAlign: 'left', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--col-border)', padding: '20px', borderRadius: '2px', width: '100%', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--col-border)', paddingBottom: '8px', color: 'var(--col-dark)', fontWeight: 700, fontSize: '12px' }}>
                RÉCAPITULATIF DES ARTICLES :
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {orderedItemsSnapshot.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <strong>{item.qty}x</strong> {item.name} <span style={{ fontSize: '11px', color: 'var(--col-muted)' }}>(Taille {item.size})</span>
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ margin: '12px 0 0 0', borderTop: '1px solid var(--col-border)', paddingTop: '12px' }}>
                Votre commande a été enregistrée avec succès. Nous allons vous contacter par téléphone au <strong>{phone}</strong> très prochainement pour confirmer l&apos;expédition de votre colis vers la wilaya de <strong>{wilaya}</strong>.
              </p>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setOrderOpen(false)}>
              RETOUR AU SITE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
