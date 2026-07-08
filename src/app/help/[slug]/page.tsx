'use client';

import React, { use, useState, useEffect } from 'react';

interface HelpPageProps {
  params: Promise<{ slug: string }>;
}

export default function HelpPage({ params }: HelpPageProps) {
  const { slug } = use(params);

  // Apply body class for header/footer transitions
  useEffect(() => {
    document.body.classList.add('full-bg-page');
    return () => {
      document.body.classList.remove('full-bg-page');
    };
  }, []);

  // Size Guide States
  const [sizeTab, setSizeTab] = useState<'tops' | 'bottoms'>('tops');

  // Track Order States
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  // Contact Us States
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Choose background photo from homepage editorial selection
  const bgImage = slug === 'size-guide' || slug === 'returns-exchanges' || slug === 'contact-us'
    ? '/assets/images/daniel-dalea-ou6Izmhpxtg-unsplash.jpg'
    : '/assets/images/caleb-EIOmriN64sU-unsplash.jpg';

  // Sizing Data (from famous mark - Zara Menswear standards)
  const topsSizes = [
    { size: 'XS', chest: '88 - 92 cm / 34.6" - 36.2"', waist: '76 - 80 cm / 29.9" - 31.5"', collar: '38 cm / 15.0"' },
    { size: 'S', chest: '92 - 96 cm / 36.2" - 37.8"', waist: '80 - 84 cm / 31.5" - 33.1"', collar: '39 cm / 15.4"' },
    { size: 'M', chest: '96 - 100 cm / 37.8" - 39.4"', waist: '84 - 88 cm / 33.1" - 34.6"', collar: '40 cm / 15.7"' },
    { size: 'L', chest: '100 - 104 cm / 39.4" - 40.9"', waist: '88 - 92 cm / 34.6" - 36.2"', collar: '41 cm / 16.1"' },
    { size: 'XL', chest: '104 - 108 cm / 40.9" - 42.5"', waist: '92 - 96 cm / 36.2" - 37.8"', collar: '42 cm / 16.5"' },
    { size: 'XXL', chest: '108 - 112 cm / 42.5" - 44.1"', waist: '96 - 100 cm / 37.8" - 39.4"', collar: '43 cm / 16.9"' },
  ];

  const bottomsSizes = [
    { usSize: '30', euSize: '38', waist: '76 - 78 cm / 29.9" - 30.7"', hips: '94 - 96 cm / 37.0" - 37.8"', inseam: '81 cm / 31.9"' },
    { usSize: '32', euSize: '40', waist: '80 - 82 cm / 31.5" - 32.3"', hips: '98 - 100 cm / 38.6" - 39.4"', inseam: '82 cm / 32.3"' },
    { usSize: '34', euSize: '42', waist: '84 - 86 cm / 33.1" - 33.9"', hips: '102 - 104 cm / 40.2" - 40.9"', inseam: '82 cm / 32.3"' },
    { usSize: '36', euSize: '44', waist: '88 - 90 cm / 34.6" - 35.4"', hips: '106 - 108 cm / 41.7" - 42.5"', inseam: '83 cm / 32.7"' },
    { usSize: '38', euSize: '46', waist: '92 - 94 cm / 36.2" - 37.0"', hips: '110 - 112 cm / 43.3" - 44.1"', inseam: '83 cm / 32.7"' },
  ];

  // FAQ List
  const faqs = [
    { q: "What materials do you use for VORN garments?", a: "We prioritize heavy-duty organic cotton, recycled nylon, and premium knit blends. Detailed compositions are listed on each product detail page." },
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Orders are shipped from our central warehouse within 24 hours of placement." },
    { q: "What is your return policy?", a: "We accept returns and exchanges within 30 days of delivery, provided that items are in their original condition with all tags attached." },
    { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. International shipping rates are calculated at checkout and usually take between 5 to 10 business days." },
    { q: "How do I care for my VORN clothes?", a: "To ensure longevity, we recommend cold washing (30°C) inside out, avoiding tumble dryers, and ironing on low heat. Always check the garment care label." },
  ];

  // Track Order Handler
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) {
      setTrackError("Please enter an order number.");
      setTrackResult(null);
      return;
    }
    setTrackError('');
    // Mock tracking result
    setTrackResult({
      id: trackInput.toUpperCase(),
      status: 'In Transit',
      carrier: 'DHL Express',
      estDelivery: 'July 14, 2026',
      steps: [
        { label: 'Order Placed', date: 'July 07', checked: true },
        { label: 'Processed & Packed', date: 'July 08', checked: true },
        { label: 'In Transit', date: 'July 09', checked: true, current: true },
        { label: 'Out for Delivery', date: 'Pending', checked: false },
      ]
    });
  };

  // Contact Form Handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Get Page Details based on slug
  const getPageDetails = () => {
    switch (slug) {
      case 'size-guide':
        return {
          title: 'SIZE GUIDE / GUIDE DES TAILLES',
          subtitle: 'Find your perfect fit. Sizing measurements based on premium international menswear standards.',
          content: (
            <div>
              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '32px', paddingBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSizeTab('tops')}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    letterSpacing: '0.12em',
                    fontWeight: sizeTab === 'tops' ? 700 : 400,
                    color: sizeTab === 'tops' ? 'var(--col-sand)' : 'rgba(255, 255, 255, 0.5)',
                    borderBottom: sizeTab === 'tops' ? '2px solid var(--col-sand)' : 'none',
                    paddingBottom: '8px',
                    marginBottom: '-10px',
                    transition: 'all 0.2s',
                  }}
                >
                  TOPS, SHIRTS &amp; OUTERWEAR
                </button>
                <button
                  type="button"
                  onClick={() => setSizeTab('bottoms')}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    letterSpacing: '0.12em',
                    fontWeight: sizeTab === 'bottoms' ? 700 : 400,
                    color: sizeTab === 'bottoms' ? 'var(--col-sand)' : 'rgba(255, 255, 255, 0.5)',
                    borderBottom: sizeTab === 'bottoms' ? '2px solid var(--col-sand)' : 'none',
                    paddingBottom: '8px',
                    marginBottom: '-10px',
                    transition: 'all 0.2s',
                  }}
                >
                  BOTTOMS &amp; TROUSERS
                </button>
              </div>

              {/* Sizing Tables */}
              {sizeTab === 'tops' ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'var(--col-sand)' }}>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>SIZE</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>CHEST WIDTH</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>WAISTLINE</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>COLLAR SIZE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topsSizes.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <td style={{ padding: '14px 8px', fontWeight: 600 }}>{row.size}</td>
                          <td style={{ padding: '14px 8px', color: 'rgba(255, 255, 255, 0.8)' }}>{row.chest}</td>
                          <td style={{ padding: '14px 8px', color: 'rgba(255, 255, 255, 0.8)' }}>{row.waist}</td>
                          <td style={{ padding: '14px 8px', color: 'rgba(255, 255, 255, 0.8)' }}>{row.collar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'var(--col-sand)' }}>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>US / UK SIZE</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>EU SIZE</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>WAISTLINE</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>HIPS</th>
                        <th style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>INSEAM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bottomsSizes.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <td style={{ padding: '14px 8px', fontWeight: 600 }}>{row.usSize}</td>
                          <td style={{ padding: '14px 8px', fontWeight: 600 }}>{row.euSize}</td>
                          <td style={{ padding: '14px 8px', color: 'rgba(255, 255, 255, 0.8)' }}>{row.waist}</td>
                          <td style={{ padding: '14px 8px', color: 'rgba(255, 255, 255, 0.8)' }}>{row.hips}</td>
                          <td style={{ padding: '14px 8px', color: 'rgba(255, 255, 255, 0.8)' }}>{row.inseam}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.5 }}>
                * How to measure: <strong>Chest</strong>: Measure around the fullest part of your chest, keeping the tape horizontal. <strong>Waist</strong>: Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.
              </p>
            </div>
          )
        };

      case 'delivery-info':
        return {
          title: 'DELIVERY INFO / LIVRAISON',
          subtitle: 'Fast, secure and fully tracked shipping worldwide. Free shipping on all standard orders.',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '2px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.12em', color: 'var(--col-sand)', marginBottom: '8px' }}>
                    STANDARD SHIPPING
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>
                    Deliveries within 3 - 5 business days. Full tracking provided via email.
                  </p>
                  <strong style={{ fontSize: '14px' }}>COST: FREE</strong>
                </div>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '2px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.12em', color: 'var(--col-sand)', marginBottom: '8px' }}>
                    EXPRESS SHIPPING
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>
                    Next business day delivery for orders placed before 1 PM.
                  </p>
                  <strong style={{ fontSize: '14px' }}>COST: $15.00</strong>
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  INTERNATIONAL SHIPPING
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                  We dispatch orders to over 50 countries. Deliveries typically arrive in 5 - 10 business days depending on customs clearances. Custom duties and import fees are calculated at checkout and fully pre-paid, ensuring no hidden delivery charges.
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.08em', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
                  TRACKING INFORMATION
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.5 }}>
                  Once your order has been dispatched from our fulfillment center, you will automatically receive an email confirmation containing your unique tracking number and direct tracking link.
                </p>
              </div>
            </div>
          )
        };

      case 'returns-exchanges':
        return {
          title: 'RETURNS & EXCHANGES / RETOURS',
          subtitle: 'Simple returns and size swaps. Return your items within 30 days of receiving them.',
          content: (
            <div>
              {/* Process Stepper */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
                {[
                  { step: '01', title: 'REQUEST', desc: 'Initiate return online' },
                  { step: '02', title: 'LABEL', desc: 'Print pre-paid label' },
                  { step: '03', title: 'SHIP', desc: 'Drop at dropoff point' },
                  { step: '04', title: 'REFUND', desc: 'Processed in 5 days' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderLeft: '2px solid var(--col-sand)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--col-sand)' }}>{s.step}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginTop: '4px' }}>{s.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '12px' }}>
                RETURN CONDITIONS
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', paddingLeft: '16px', listStyleType: 'disc', marginBottom: '32px' }}>
                <li>Items must be returned within 30 days of delivery.</li>
                <li>Garments must be unworn, unwashed, and undamaged.</li>
                <li>All original tags, labels, and hygiene seals must remain intact.</li>
                <li>Footwear must be returned in the original branded shoe box.</li>
              </ul>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '12px' }}>
                HOW TO INITIATE AN EXCHANGE
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                Need a different size or color? The fastest way is to return your original item for a full refund and place a new order on our website. Alternatively, contact our support team at <strong>exchanges@vorn.com</strong> to arrange a direct swap.
              </p>
            </div>
          )
        };

      case 'track-my-order':
        return {
          title: 'TRACK MY ORDER / SUIVI',
          subtitle: 'Check the real-time status of your package. Enter your unique tracking credentials.',
          content: (
            <div>
              <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
                <input
                  type="text"
                  placeholder="ORDER NUMBER (E.G. VORN-5678)"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '14px 20px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    color: '#fff',
                    outline: 'none',
                    borderRadius: '2px',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: 'var(--col-sand)', color: 'var(--col-dark)', padding: '14px 28px' }}
                >
                  TRACK
                </button>
              </form>

              {trackError && <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '20px' }}>{trackError}</div>}

              {trackResult && (
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>ORDER</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px' }}>{trackResult.id}</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>EST. DELIVERY</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--col-sand)' }}>{trackResult.estDelivery}</h4>
                    </div>
                  </div>

                  {/* Horizontal Timeline */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '20px' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
                    {trackResult.steps.map((step: any, idx: number) => (
                      <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: step.checked ? 'var(--col-sand)' : 'var(--col-dark)',
                            border: `2px solid ${step.checked ? 'var(--col-sand)' : 'rgba(255,255,255,0.2)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            color: '#000',
                            fontWeight: 'bold',
                            boxShadow: step.current ? '0 0 12px var(--col-sand)' : 'none',
                          }}
                        >
                          {step.checked ? '✓' : ''}
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', marginTop: '8px', textAlign: 'center' }}>
                          {step.label}
                        </span>
                        <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>
                          {step.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        };

      case 'contact-us':
        return {
          title: 'CONTACT US / NOUS CONTACTER',
          subtitle: 'Do you have a question? Drop us a line. Our support team is online 24/7.',
          content: (
            <div>
              {contactSuccess ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--col-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#000', fontSize: '20px', fontWeight: 'bold' }}>✓</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '8px' }}>MESSAGE SENT</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '6px' }}>NAME</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '6px' }}>SUBJECT</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '6px' }}>MESSAGE</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ background: 'var(--col-sand)', color: 'var(--col-dark)', alignSelf: 'flex-start', border: 'none', padding: '16px 36px' }}
                  >
                    SEND MESSAGE
                  </button>
                </form>
              )}
            </div>
          )
        };

      case 'faq':
      default:
        return {
          title: 'FREQUENTLY ASKED QUESTIONS / FAQ',
          subtitle: 'Got questions? We have got answers. Find quick solutions to the most common queries.',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: '16px',
                        letterSpacing: '0.05em',
                        color: isOpen ? 'var(--col-sand)' : '#fff',
                        fontWeight: 600,
                        padding: '10px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontSize: '16px' }}>{isOpen ? '−' : '+'}</span>
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? '200px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease-in-out',
                      }}
                    >
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', paddingTop: '8px', paddingBottom: '12px' }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        };
    }
  };

  const details = getPageDetails();

  return (
    <main
      style={{
        backgroundImage: `url('${bgImage}')`,
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

      {/* Content panel */}
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
            HELP / SERVICE CLIENT
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1.1 }}>
            {details.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px', lineHeight: 1.5 }}>
            {details.subtitle}
          </p>
        </div>

        {details.content}
      </div>
    </main>
  );
}
