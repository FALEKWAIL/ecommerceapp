'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── TYPES ───────────────────────────────────────────────
interface Product {
  id: string | number;
  name: string;
  category: string;
  price: string;
  original_price?: string;
  sizes: string[];
  out_of_stock_sizes: string[];
  label?: 'NEW' | 'SALE' | null;
  img_class: string;
  img_url?: string;
  colors: string[];
  is_active: boolean;
  created_at: string;
}

interface Order {
  id: string | number;
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  size: string;
  color: string;
  product_name?: string;
  product_price?: string;
  is_cart_order: boolean;
  cart_items: { name: string; size: string; qty: number }[];
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  created_at: string;
}

// ── STATUS COLORS ────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending:   { bg: 'rgba(184,149,106,0.15)', color: '#B8956A' },
  Confirmed: { bg: 'rgba(94,163,100,0.15)',  color: '#5EA364' },
  Shipped:   { bg: 'rgba(94,130,200,0.15)',  color: '#5E82C8' },
  Delivered: { bg: 'rgba(100,180,100,0.15)', color: '#64B464' },
  Cancelled: { bg: 'rgba(220,80,80,0.15)',   color: '#DC5050' },
};

// ── EMPTY PRODUCT FORM ───────────────────────────────────
const EMPTY_PRODUCT: Omit<Product, 'id' | 'created_at'> = {
  name: '',
  category: 'OUTERWEAR',
  price: '',
  original_price: '',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  out_of_stock_sizes: [],
  label: null,
  img_class: 'product-img-1',
  img_url: '',
  colors: [],
  is_active: true,
};

// ══════════════════════════════════════════════════════════
// DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();

  // Auth
  const [userEmail, setUserEmail] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders,   setLoadingOrders]   = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch,   setOrderSearch]   = useState('');
  const [orderFilter,   setOrderFilter]   = useState('All');

  // Product Drawer
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm]               = useState(EMPTY_PRODUCT);
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState('');
  const [uploadFile, setUploadFile]   = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploading, setUploading]     = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  // Toast
  const [toast, setToast]         = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Confirm Delete
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  // ── AUTH CHECK ──────────────────────────────────────────
  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        const data = await res.json();
        if (!data.success || !data.user) {
          router.push('/admin/login');
        } else {
          setUserEmail(data.user.email ?? '');
          setAuthChecked(true);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  // ── LOAD DATA ───────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products?all=true');
      const json = await res.json();
      setProducts(json.data ?? []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      setOrders(json.data ?? []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    loadProducts();
    loadOrders();
  }, [authChecked, loadProducts, loadOrders]);

  // ── TOAST ───────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // ── LOGOUT ──────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // ── PRODUCT FORM ─────────────────────────────────────────
  const openAddDrawer = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setFormError('');
    setUploadFile(null);
    setUploadPreview('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      original_price: p.original_price ?? '',
      sizes: p.sizes,
      out_of_stock_sizes: p.out_of_stock_sizes,
      label: p.label ?? null,
      img_class: p.img_class,
      img_url: p.img_url ?? '',
      colors: p.colors,
      is_active: p.is_active,
    });
    setFormError('');
    setUploadFile(null);
    setUploadPreview(p.img_url ?? '');
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setEditProduct(null); setUploadFile(null); setUploadPreview(''); };

  // ── IMAGE UPLOAD ─────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setFormError('Please select an image file.'); return; }
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setFormError('');
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploading(false);
      if (!res.ok || !data.success) {
        setFormError(`Upload failed: ${data.error || 'Server error'}`);
        return null;
      }
      return data.url;
    } catch (err: any) {
      setUploading(false);
      setFormError(`Upload failed: ${err.message}`);
      return null;
    }
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price) { setFormError('Name and price are required.'); return; }
    setSaving(true);
    setFormError('');

    // Upload image first if a file was selected
    let finalImgUrl = form.img_url || null;
    if (uploadFile) {
      const uploadedUrl = await uploadImageToStorage(uploadFile);
      if (!uploadedUrl) { setSaving(false); return; }
      finalImgUrl = uploadedUrl;
    }

    const payload = {
      name: form.name,
      category: form.category,
      price: form.price,
      original_price: form.original_price || null,
      sizes: form.sizes,
      out_of_stock_sizes: form.out_of_stock_sizes,
      label: form.label || null,
      img_class: form.img_class,
      img_url: finalImgUrl,
      colors: form.colors,
      is_active: form.is_active,
    };

    try {
      if (editProduct) {
        const res = await fetch(`/api/products/${editProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFormError(data.error || 'Failed to update product');
          setSaving(false);
          return;
        }
        showToast(`"${form.name}" updated.`);
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFormError(data.error || 'Failed to add product');
          setSaving(false);
          return;
        }
        showToast(`"${form.name}" added.`);
      }

      setSaving(false);
      closeDrawer();
      loadProducts();
    } catch (err: any) {
      setFormError(err.message || 'Error saving product');
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      showToast('Product deleted.');
      loadProducts();
    } catch (err: any) {
      showToast(`Error deleting product: ${err.message}`);
    }
  };

  // ── ORDER STATUS UPDATE ──────────────────────────────────
  const updateOrderStatus = async (id: string | number, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o));
      showToast(`Order #${id} → ${status}`);
    } catch (err: any) {
      showToast(`Failed to update order: ${err.message}`);
    }
  };

  // ── FILTERS ─────────────────────────────────────────────
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone.includes(orderSearch) ||
      (o.product_name ?? '').toLowerCase().includes(orderSearch.toLowerCase());
    const matchFilter = orderFilter === 'All' || o.status === orderFilter;
    return matchSearch && matchFilter;
  });

  // ── STATS ───────────────────────────────────────────────
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.is_active).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
    confirmedOrders: orders.filter(o => o.status === 'Confirmed').length,
    shippedOrders: orders.filter(o => o.status === 'Shipped').length,
  };

  // ── GUARD ───────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--col-dark)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.2em', color: 'var(--col-muted)' }}>
          AUTHENTICATING...
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--col-bg)' }}>

      {/* ── SIDEBAR ────────────────────────────────────────── */}
      <aside style={{
        width: '240px',
        minHeight: '100vh',
        background: 'var(--col-dark)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, letterSpacing: '0.22em', color: 'var(--col-bg)' }}>
            VORN
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--col-sand)', marginTop: '4px' }}>
            SELLER DASHBOARD
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {(['overview', 'products', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 28px',
                background: activeTab === tab ? 'rgba(184,149,106,0.12)' : 'none',
                border: 'none',
                borderLeft: `3px solid ${activeTab === tab ? 'var(--col-sand)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--col-sand)' : 'rgba(240,237,232,0.45)',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'overview' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              )}
              {tab === 'products' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              )}
              {tab === 'orders' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              )}
              {tab.toUpperCase()}
              {tab === 'orders' && stats.pendingOrders > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--col-sand)',
                  color: 'var(--col-dark)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '20px',
                }}>
                  {stats.pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(240,237,232,0.3)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'rgba(240,237,232,0.4)',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '8px 14px',
              cursor: 'pointer',
              width: '100%',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = 'var(--col-bg)'; (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = 'rgba(240,237,232,0.4)'; (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Header Bar */}
        <div style={{
          padding: '28px 40px',
          borderBottom: '1px solid var(--col-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--col-bg)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, letterSpacing: '0.12em' }}>
              {activeTab === 'overview' ? 'OVERVIEW' : activeTab === 'products' ? 'PRODUCTS' : 'ORDERS'}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--col-muted)', marginTop: '2px' }}>
              {activeTab === 'overview' && 'Your store at a glance'}
              {activeTab === 'products' && `${stats.activeProducts} active of ${stats.totalProducts} total`}
              {activeTab === 'orders' && `${stats.pendingOrders} pending of ${stats.totalOrders} total`}
            </div>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={openAddDrawer}
              style={{
                background: 'var(--col-dark)',
                color: 'var(--col-bg)',
                border: 'none',
                padding: '12px 24px',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ADD PRODUCT
            </button>
          )}
        </div>

        <div style={{ padding: '32px 40px' }}>

          {/* ── OVERVIEW TAB ──────────────────────────────── */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[
                  { label: 'TOTAL PRODUCTS', value: stats.totalProducts, sub: `${stats.activeProducts} active` },
                  { label: 'TOTAL ORDERS', value: stats.totalOrders, sub: `${stats.pendingOrders} pending` },
                  { label: 'CONFIRMED', value: stats.confirmedOrders, sub: `${stats.shippedOrders} shipped` },
                ].map(({ label, value, sub }) => (
                  <div key={label} style={{
                    background: '#fff',
                    border: '1px solid var(--col-border)',
                    padding: '28px 32px',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.25em', color: 'var(--col-muted)', marginBottom: '16px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--col-muted)', marginTop: '8px' }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.18em', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  RECENT ORDERS
                  <button onClick={() => setActiveTab('orders')} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--col-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    VIEW ALL →
                  </button>
                </div>
                <OrderTable orders={orders.slice(0, 5)} onStatusUpdate={updateOrderStatus} compact />
              </div>
            </div>
          )}

          {/* ── PRODUCTS TAB ──────────────────────────────── */}
          {activeTab === 'products' && (
            <div>
              {/* Search */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  style={{
                    width: '320px',
                    background: '#fff',
                    border: '1px solid var(--col-border)',
                    padding: '11px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    outline: 'none',
                    color: 'var(--col-dark)',
                  }}
                />
              </div>

              {loadingProducts ? (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--col-muted)', padding: '40px 0' }}>LOADING...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                  {filteredProducts.map(p => (
                    <div key={p.id} style={{
                      background: '#fff',
                      border: '1px solid var(--col-border)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      opacity: p.is_active ? 1 : 0.5,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', color: 'var(--col-muted)', marginBottom: '4px' }}>{p.category}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, letterSpacing: '0.06em' }}>{p.name}</div>
                        </div>
                        {p.label && (
                          <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '9px',
                            letterSpacing: '0.2em',
                            padding: '3px 8px',
                            background: p.label === 'SALE' ? 'rgba(220,80,80,0.1)' : 'rgba(184,149,106,0.15)',
                            color: p.label === 'SALE' ? '#DC5050' : 'var(--col-sand)',
                          }}>
                            {p.label}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>{p.price}</span>
                        {p.original_price && <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--col-muted)', textDecoration: 'line-through' }}>{p.original_price}</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--col-muted)' }}>
                        Sizes: {p.sizes.join(', ')} · Colors: {p.colors.join(', ')}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          onClick={() => openEditDrawer(p)}
                          style={{
                            flex: 1,
                            padding: '9px',
                            background: 'var(--col-dark)',
                            color: 'var(--col-bg)',
                            border: 'none',
                            fontFamily: 'var(--font-display)',
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            cursor: 'pointer',
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          style={{
                            padding: '9px 14px',
                            background: 'none',
                            color: '#DC5050',
                            border: '1px solid rgba(220,80,80,0.3)',
                            fontFamily: 'var(--font-display)',
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            cursor: 'pointer',
                          }}
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--col-muted)' }}>
                      NO PRODUCTS FOUND
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS TAB ────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search by name, phone, product..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  style={{
                    width: '320px',
                    background: '#fff',
                    border: '1px solid var(--col-border)',
                    padding: '11px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    outline: 'none',
                    color: 'var(--col-dark)',
                  }}
                />
                {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setOrderFilter(s)}
                    style={{
                      padding: '10px 16px',
                      background: orderFilter === s ? 'var(--col-dark)' : '#fff',
                      color: orderFilter === s ? 'var(--col-bg)' : 'var(--col-muted)',
                      border: '1px solid var(--col-border)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s.toUpperCase()}
                    {s !== 'All' && orders.filter(o => o.status === s).length > 0 && (
                      <span style={{ marginLeft: '6px', opacity: 0.6 }}>({orders.filter(o => o.status === s).length})</span>
                    )}
                  </button>
                ))}
              </div>

              {loadingOrders ? (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--col-muted)', padding: '40px 0' }}>LOADING...</div>
              ) : (
                <OrderTable orders={filteredOrders} onStatusUpdate={updateOrderStatus} />
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── PRODUCT DRAWER ────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            onClick={closeDrawer}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '480px',
            maxWidth: '100vw',
            height: '100vh',
            background: 'var(--col-bg)',
            zIndex: 101,
            overflowY: 'auto',
            boxShadow: '-4px 0 32px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--col-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, letterSpacing: '0.15em' }}>
                {editProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </div>
              <button onClick={closeDrawer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--col-muted)', fontSize: '20px' }}>✕</button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <ProductFormField label="PRODUCT NAME *" >
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="e.g. Washed Canvas Overshirt" />
              </ProductFormField>

              <ProductFormField label="CATEGORY">
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                  {['OUTERWEAR', 'TOPS', 'BOTTOMS', 'KNITWEAR', 'STREETWEAR', 'ESSENTIALS', 'ACCESSORIES'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </ProductFormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <ProductFormField label="PRICE *">
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} placeholder="e.g. $89.00" />
                </ProductFormField>
                <ProductFormField label="ORIGINAL PRICE">
                  <input value={form.original_price ?? ''} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} style={inputStyle} placeholder="e.g. $120.00" />
                </ProductFormField>
              </div>

              <ProductFormField label="LABEL">
                <select value={form.label ?? ''} onChange={e => setForm(f => ({ ...f, label: (e.target.value as 'NEW' | 'SALE' | null) || null }))} style={inputStyle}>
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                </select>
              </ProductFormField>

              <ProductFormField label="SIZES (comma-separated)">
                <input
                  value={form.sizes.join(', ')}
                  onChange={e => setForm(f => ({ ...f, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  style={inputStyle}
                  placeholder="XS, S, M, L, XL"
                />
              </ProductFormField>

              <ProductFormField label="OUT OF STOCK SIZES (comma-separated)">
                <input
                  value={form.out_of_stock_sizes.join(', ')}
                  onChange={e => setForm(f => ({ ...f, out_of_stock_sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  style={inputStyle}
                  placeholder="e.g. XXL"
                />
              </ProductFormField>

              <ProductFormField label="COLORS (comma-separated)">
                <input
                  value={form.colors.join(', ')}
                  onChange={e => setForm(f => ({ ...f, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  style={inputStyle}
                  placeholder="e.g. Noir, Olive, Ecru"
                />
              </ProductFormField>

              {/* IMAGE UPLOAD */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--col-muted)', marginBottom: '8px' }}>
                  PRODUCT IMAGE
                </label>

                {/* Drop / Click zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--col-sand)'; }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--col-border)'; }}
                  onDrop={e => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--col-border)';
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                  style={{
                    border: '2px dashed var(--col-border)',
                    borderRadius: '2px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fff',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {uploadPreview ? (
                    // Preview
                    <>
                      <img
                        src={uploadPreview}
                        alt="preview"
                        style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }}
                      />
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--col-sand)', marginTop: '4px' }}>
                        {uploadFile ? uploadFile.name : 'CURRENT IMAGE'} — CLICK TO CHANGE
                      </div>
                    </>
                  ) : (
                    // Placeholder
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--col-muted)" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--col-muted)' }}>
                        CLICK OR DRAG TO UPLOAD
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--col-muted)', opacity: 0.6 }}>
                        JPG, PNG, WEBP — Max 5MB
                      </div>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                />

                {uploading && (
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--col-sand)', marginTop: '6px' }}>
                    UPLOADING IMAGE...
                  </div>
                )}
              </div>

              <ProductFormField label="FALLBACK CSS CLASS (if no image uploaded)">
                <select value={form.img_class} onChange={e => setForm(f => ({ ...f, img_class: e.target.value }))} style={inputStyle}>
                  {['product-img-1', 'product-img-2', 'product-img-3', 'product-img-4', 'product-img-5', 'product-img-6', 'product-img-7', 'product-img-8'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </ProductFormField>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="is_active" style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--col-mid)', cursor: 'pointer' }}>
                  ACTIVE (visible on store)
                </label>
              </div>

              {formError && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#DC5050', padding: '12px 14px', background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.2)' }}>
                  {formError}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--col-border)', display: 'flex', gap: '12px', flexShrink: 0 }}>
              <button onClick={handleSaveProduct} disabled={saving} style={{
                flex: 1,
                padding: '14px',
                background: 'var(--col-dark)',
                color: 'var(--col-bg)',
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'SAVING...' : editProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
              </button>
              <button onClick={closeDrawer} style={{
                padding: '14px 20px',
                background: 'none',
                color: 'var(--col-mid)',
                border: '1px solid var(--col-border)',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                cursor: 'pointer',
              }}>
                CANCEL
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── DELETE CONFIRM MODAL ─────────────────────────── */}
      {deleteId !== null && (
        <>
          <div onClick={() => setDeleteId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200 }} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--col-bg)',
            padding: '40px',
            zIndex: 201,
            width: '380px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '12px' }}>DELETE PRODUCT</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--col-mid)', marginBottom: '28px' }}>
              This action cannot be undone. The product will be permanently removed.
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleDeleteProduct} style={{
                flex: 1,
                padding: '13px',
                background: '#DC5050',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                cursor: 'pointer',
              }}>
                DELETE
              </button>
              <button onClick={() => setDeleteId(null)} style={{
                flex: 1,
                padding: '13px',
                background: 'none',
                color: 'var(--col-mid)',
                border: '1px solid var(--col-border)',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                cursor: 'pointer',
              }}>
                CANCEL
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── TOAST ─────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        background: 'var(--col-dark)',
        color: 'var(--col-bg)',
        padding: '14px 20px',
        fontFamily: 'var(--font-display)',
        fontSize: '12px',
        letterSpacing: '0.15em',
        zIndex: 300,
        transition: 'all 0.3s',
        opacity: toastVisible ? 1 : 0,
        transform: toastVisible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: 'none',
      }}>
        {toast}
      </div>

    </div>
  );
}

// ── ORDER TABLE COMPONENT ────────────────────────────────
function OrderTable({ orders, onStatusUpdate, compact = false }: {
  orders: Order[];
  onStatusUpdate: (id: string | number, status: string) => void;
  compact?: boolean;
}) {
  if (orders.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--col-muted)' }}>
        NO ORDERS FOUND
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--col-border)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--col-border)' }}>
            {['#', 'CUSTOMER', 'PRODUCT', 'WILAYA', 'STATUS', 'DATE', ...(compact ? [] : ['ACTION'])].map(h => (
              <th key={h} style={{
                padding: compact ? '12px 16px' : '14px 20px',
                textAlign: 'left',
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: 'var(--col-muted)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid var(--col-border)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={tdStyle(compact)}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--col-muted)' }}>#{o.id}</span>
              </td>
              <td style={tdStyle(compact)}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500 }}>{o.customer_name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--col-muted)' }}>{o.customer_phone}</div>
              </td>
              <td style={tdStyle(compact)}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px' }}>
                  {o.is_cart_order
                    ? `Cart (${o.cart_items.length} items)`
                    : o.product_name ?? '—'
                  }
                </div>
                {!o.is_cart_order && (
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--col-muted)' }}>
                    {o.size} · {o.color}
                  </div>
                )}
              </td>
              <td style={tdStyle(compact)}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px' }}>{o.customer_wilaya}</span>
              </td>
              <td style={tdStyle(compact)}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  padding: '4px 10px',
                  background: STATUS_COLORS[o.status]?.bg ?? 'transparent',
                  color: STATUS_COLORS[o.status]?.color ?? 'inherit',
                }}>
                  {o.status.toUpperCase()}
                </span>
              </td>
              <td style={tdStyle(compact)}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--col-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              </td>
              {!compact && (
                <td style={tdStyle(compact)}>
                  <select
                    value={o.status}
                    onChange={e => onStatusUpdate(o.id, e.target.value)}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      padding: '7px 10px',
                      background: '#fff',
                      border: '1px solid var(--col-border)',
                      color: 'var(--col-dark)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── HELPERS ──────────────────────────────────────────────
function ProductFormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: 'var(--col-muted)',
        marginBottom: '8px',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: '1px solid var(--col-border)',
  padding: '12px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--col-dark)',
  outline: 'none',
};

function tdStyle(compact: boolean): React.CSSProperties {
  return {
    padding: compact ? '12px 16px' : '16px 20px',
    verticalAlign: 'middle',
  };
}
