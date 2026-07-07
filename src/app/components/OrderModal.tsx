'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function OrderModal() {
  const { isOrderOpen, setOrderOpen, orderProduct, placeOrder, cartItems } = useApp();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  // Reset states when the modal is opened for a new product
  useEffect(() => {
    if (orderProduct) {
      setSelectedColor(orderProduct.colors[0] || 'Default');
      setSelectedSize(orderProduct.sizes[0] || 'M');
      setIsSubmitted(false);
      setName('');
      setPhone('');
    }
  }, [orderProduct]);

  if (!isOrderOpen || !orderProduct) return null;

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
            
            {/* Summary details */}
            <div className="order-summary-box">
              <div 
                className={`order-summary-img ${orderProduct.imgClass}`}
                style={orderProduct.imgUrl ? { backgroundImage: `url(${orderProduct.imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              ></div>
              <div className="order-summary-info">
                <h3>{orderProduct.name}</h3>
                {orderProduct.isFromCart ? (
                  <p className="order-summary-price">{cartItems.length} article(s) dans le sac</p>
                ) : (
                  <p className="order-summary-price">{orderProduct.price}</p>
                )}
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
                pattern="(05|06|07)[0-9]{8}"
                title="Veuillez entrer un numéro de téléphone valide (10 chiffres, commençant par 05, 06 ou 07)"
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
            <div className="success-icon">✓</div>
            <h2>COMMANDE CONFIRMÉE !</h2>
            <p className="success-thankyou">Merci, votre commande est bien enregistrée.</p>
            <p className="success-details">
              Votre commande pour <strong>{orderProduct.name}</strong> a été validée. Nous allons vous contacter par téléphone au <strong>{phone}</strong> très prochainement pour confirmer l&apos;expédition de votre colis vers la wilaya de <strong>{wilaya}</strong>.
            </p>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setOrderOpen(false)}>
              RETOUR AU SITE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
