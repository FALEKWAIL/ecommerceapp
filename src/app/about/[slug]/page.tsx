'use client';

import React, { use, useState, useEffect } from 'react';

interface AboutPageProps {
  params: Promise<{ slug: string }>;
}

export default function AboutPage({ params }: AboutPageProps) {
  const { slug } = use(params);

  // Apply body class for header/footer transitions
  useEffect(() => {
    document.body.classList.add('full-bg-page');
    return () => {
      document.body.classList.remove('full-bg-page');
    };
  }, []);

  // Choose background photo from homepage editorial selection
  const bgImage = slug === 'our-story' || slug === 'careers' || slug === 'privacy-policy'
    ? '/assets/images/daniel-dalea-ou6Izmhpxtg-unsplash.jpg'
    : '/assets/images/caleb-EIOmriN64sU-unsplash.jpg';

  // Career Listings State
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const jobs = [
    {
      id: 1,
      title: "Senior Menswear Designer",
      department: "Creative Direction",
      location: "Paris, FR / Hybrid",
      type: "Full-Time",
      description: "We are seeking a visionary Senior Menswear Designer to lead our design team for the upcoming FW27 collection. You will collaborate directly with our Creative Director to shape VORN's silhouette and aesthetic.",
      requirements: ["5+ years of experience in luxury or contemporary menswear design", "Expert draping, technical drawing and fabric selection skills", "Strong alignment with VORN's architectural, minimal aesthetic."]
    },
    {
      id: 2,
      title: "E-Commerce Logistics Coordinator",
      department: "Operations",
      location: "London, UK / Remote",
      type: "Full-Time",
      description: "VORN is expanding its global shipping footprint. We need a Logistics Coordinator to oversee international fulfillment, customs broker relationships, and ensure seamless delivery times.",
      requirements: ["3+ years of experience in e-commerce fulfillment or fashion logistics", "Experience with Shopify Plus, ERP software, and global customs systems", "Excellent problem solving skills."]
    },
    {
      id: 3,
      title: "Store Supervisor",
      department: "Retail",
      location: "Milan, IT / In-Store",
      type: "Full-Time",
      description: "To lead our upcoming Milan flagship store. You will manage daily operations, train retail associates, and deliver the high-touch customer service experience VORN is known for.",
      requirements: ["2+ years in retail store management, preferably contemporary fashion", "Fluency in English and Italian", "Strong team building and motivational skills."]
    }
  ];

  // Press Releases
  const pressReleases = [
    { date: "June 18, 2026", title: "VORN Launches SS26 Editorial Campaign 'Define Your Standard'", summary: "VORN unveils its Summer/Spring 2026 campaign featuring lightweight canvas overshirts and modular cargo pants, shot in Paris." },
    { date: "May 02, 2026", title: "VORN Announces 100% Transition to Recycled Nylon", summary: "As part of our commitment to sustainable menswear, all outerwear lines starting from Autumn 2026 will utilize recycled waste materials." },
    { date: "March 15, 2026", title: "Flagship Store Opening in Milan Fashion District", summary: "VORN is set to open its third physical store in Europe. The boutique features minimalist concrete interiors and raw oak displays." },
  ];

  // Get Page details based on slug
  const getPageDetails = () => {
    switch (slug) {
      case 'our-story':
        return {
          title: 'OUR STORY / NOTRE HISTOIRE',
          subtitle: 'Contemporary design with street utility. Built for longevity, crafted with intent.',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.8)' }}>
              <p>
                Founded in 2026, VORN was established to bridge the gap between architectural minimalism and modern street utility. We believe menswear should be clean but functional, structured but comfortable.
              </p>
              <blockquote style={{ borderLeft: '3px solid var(--col-sand)', paddingLeft: '20px', margin: '12px 0', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>
                "We don't design for seasons; we design for years. Clothes that move with you, evolve with you."
              </blockquote>
              <p>
                Every silhouette is engineered with purpose. We reject fast fashion cycles. Instead, we release small, tightly curated drops that focus on heavy-duty fabrics, robust hardware, and versatile styling options. VORN is not just clothing — it is a standard of presentation.
              </p>
            </div>
          )
        };

      case 'sustainability':
        return {
          title: 'SUSTAINABILITY / ENGAGEMENT',
          subtitle: 'Our path to zero compromise. Protecting the future through mindful craftsmanship.',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Stat Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { stat: '100%', title: 'ORGANIC COTTON', desc: 'All jersey and fleece lines' },
                  { stat: '94%', title: 'RECYCLED FIBERS', desc: 'Across entire outerwear line' },
                  { stat: '100%', title: 'CARBON NEUTRAL', desc: 'Shipping offset globally' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '2px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--col-sand)' }}>{s.stat}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginTop: '6px' }}>{s.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  OUR SUSTAINABLE CHARTER
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                  We select fabrics that require less water and generate lower carbon footprints. Our suppliers are verified by the Global Organic Textile Standard (GOTS) and the Recycled Claim Standard (RCS). We produce in limited quantities to eliminate deadstock and landfill waste.
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.08em', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
                  ETHICAL FACTORIES
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.5 }}>
                  We collaborate only with factories in Portugal, Italy, and Turkey that guarantee fair wages, safe workspaces, and reasonable working hours. We visit our production sites quarterly to maintain absolute accountability.
                </p>
              </div>
            </div>
          )
        };

      case 'careers':
        return {
          title: 'CAREERS / RECRUTEMENT',
          subtitle: 'Shape the future of contemporary menswear. Join the VORN creative studio.',
          content: (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '20px' }}>
                OPEN POSITIONS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {jobs.map((job) => {
                  const isSelected = selectedJob === job.id;
                  return (
                    <div
                      key={job.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--col-sand)' : 'rgba(255, 255, 255, 0.08)'}`,
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}
                      onClick={() => setSelectedJob(isSelected ? null : job.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, letterSpacing: '0.05em' }}>{job.title}</h4>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginRight: '16px' }}>{job.department}</span>
                          <span style={{ fontSize: '11px', color: 'var(--col-sand)' }}>{job.location} · {job.type}</span>
                        </div>
                        <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.3)' }}>{isSelected ? '−' : '+'}</span>
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                          <p style={{ marginBottom: '12px' }}>{job.description}</p>
                          <strong>Key Requirements:</strong>
                          <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginTop: '6px' }}>
                            {job.requirements.map((req, rIdx) => <li key={rIdx}>{req}</li>)}
                          </ul>
                          <div style={{ marginTop: '16px' }}>
                            <a
                              href="mailto:careers@vorn.com"
                              className="btn btn-primary"
                              onClick={(e) => e.stopPropagation()}
                              style={{ background: 'var(--col-sand)', color: 'var(--col-dark)', fontSize: '10px', padding: '10px 18px' }}
                            >
                              APPLY NOW
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        };

      case 'press':
        return {
          title: 'PRESS / RELATIONS PRESSE',
          subtitle: 'Download resources, assets and find all our official statements and news.',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', marginBottom: '16px' }}>
                  LATEST RELEASES
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {pressReleases.map((pr, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--col-sand)', fontWeight: 600 }}>{pr.date}</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, margin: '4px 0 8px' }}>{pr.title}</h4>
                      <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}>{pr.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.08em', marginBottom: '6px' }}>MEDIA KIT DOWNLOAD</h4>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>Includes high-res product packshots, campaign imagery, brand colors and standard logos.</p>
                  <a href="#" className="btn btn-primary" style={{ background: '#fff', color: '#000', fontSize: '9px', padding: '8px 16px' }}>DOWNLOAD KIT (42 MB)</a>
                </div>
              </div>
            </div>
          )
        };

      case 'privacy-policy':
        return {
          title: 'PRIVACY POLICY / CONFIDENTIALITÉ',
          subtitle: 'Last updated: July 08, 2026. How we secure and handle your data.',
          content: (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '12px', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>1. Collection of Personal Data</h4>
              <p style={{ marginBottom: '16px' }}>We collect personal details that you provide directly, including name, phone number, shipping address, billing details, and email when placing an order or registering for our newsletter.</p>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>2. Use of Data</h4>
              <p style={{ marginBottom: '16px' }}>Your data is processed to manage your orders, handle secure checkouts, organize fast deliveries, send order updates, and provide customized marketing communications if you subscribe.</p>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>3. Data Protection</h4>
              <p style={{ marginBottom: '16px' }}>We enforce SSL encryption protocols, strict database firewalls, and tokenized payment processing through certified credit providers to prevent unauthorized leaks or data breaches.</p>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>4. Cookies Policy</h4>
              <p>We use standard site cookies to remember items in your cart drawer, save your wishlist preferences, and measure visitor traffic to improve our store design.</p>
            </div>
          )
        };

      case 'terms-of-service':
      default:
        return {
          title: 'TERMS OF SERVICE / CONDITIONS',
          subtitle: 'Last updated: July 08, 2026. Standard conditions of purchase and usage.',
          content: (
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '12px', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>1. Scope of Agreement</h4>
              <p style={{ marginBottom: '16px' }}>These terms apply to all transactions, purchases, and browsing sessions on the VORN online store. By checking out, you accept these conditions in full.</p>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>2. Order Acceptance</h4>
              <p style={{ marginBottom: '16px' }}>We reserve the right to cancel or refuse any orders in case of pricing errors, inventory deficits, or suspected fraudulent activity. If cancelled, a full refund is processed immediately.</p>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>3. Prices &amp; Payment</h4>
              <p style={{ marginBottom: '16px' }}>All prices are shown in USD. Payment is captured at checkout. Delivery costs and duties are calculated before checkout confirmation.</p>
              <h4 style={{ color: '#fff', marginBottom: '8px' }}>4. Property Rights</h4>
              <p>All editorial photography, custom logo designs, brand symbols, copy, and product specifications displayed on this site are the exclusive property of VORN.</p>
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
            ABOUT / L&apos;ENTREPRISE
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
