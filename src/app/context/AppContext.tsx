'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export type CartItem = {
  name: string;
  size: string;
  qty: number;
};

export type OrderProductInfo = {
  name: string;
  price: string;
  imgClass: string;
  imgUrl?: string;
  sizes: string[];
  colors: string[];
  isFromCart?: boolean;
};

type AppContextType = {
  cartItems: CartItem[];
  addToCart: (name: string, size?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  updateCartQty: (index: number, qty: number) => void;
  wishlist: string[];
  toggleWishlist: (name: string) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isAnnounceVisible: boolean;
  dismissAnnounce: () => void;
  toastMessage: string;
  showToast: (msg: string) => void;
  isToastVisible: boolean;
  
  // Direct Order States
  isOrderOpen: boolean;
  setOrderOpen: (open: boolean) => void;
  orderProduct: OrderProductInfo | null;
  startDirectOrder: (product: { name: string; price: string; imgClass: string; imgUrl?: string; sizes: string[]; colors: string[] }) => void;
  startCartOrder: () => void;
  placeOrder: (details: { name: string; phone: string; wilaya: string; size: string; color: string }) => Promise<void>;

  // Wishlist Drawer States
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;

  // Product Details Drawer States
  isDetailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  detailProduct: any | null;
  openDetail: (product: any) => void;

  // Dynamic Product Data from Supabase
  products: any[];
  loadingProducts: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Washed Canvas Overshirt",
    category: "OUTERWEAR",
    price: "$89.00",
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    label: "NEW",
    img_class: "product-img-1",
    colors: ['Olive', 'Noir', 'Ecru'],
    is_active: true
  },
  {
    id: 2,
    name: "Oversized Cargo Tee",
    category: "TOPS",
    price: "$49.00",
    original_price: "$69.00",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    out_of_stock_sizes: ['XXL'],
    label: "SALE",
    img_class: "product-img-2",
    colors: ['Sable', 'Noir', 'Kaki'],
    is_active: true
  },
  {
    id: 3,
    name: "Relaxed Cargo Trousers",
    category: "BOTTOMS",
    price: "$79.00",
    sizes: ['28', '30', '32', '34', '36'],
    label: "NEW",
    img_class: "product-img-3",
    colors: ['Noir', 'Khaki', 'Sauge'],
    is_active: true
  },
  {
    id: 4,
    name: "Heavyweight Crew Sweat",
    category: "KNITWEAR",
    price: "$95.00",
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img_class: "product-img-4",
    colors: ['Gris', 'Noir', 'Ecru'],
    is_active: true
  },
  {
    id: 5,
    name: "Urban Bomber Jacket",
    category: "OUTERWEAR",
    price: "$120.00",
    sizes: ['S', 'M', 'L', 'XL'],
    label: "NEW",
    img_class: "product-img-5",
    colors: ['Noir', 'Bleu Marine', 'Olive'],
    is_active: true
  },
  {
    id: 6,
    name: "Classic Slim Chinos",
    category: "BOTTOMS",
    price: "$65.00",
    sizes: ['30', '32', '34', '36'],
    img_class: "product-img-6",
    colors: ['Khaki', 'Bleu Marine', 'Sable'],
    is_active: true
  },
  {
    id: 7,
    name: "Knitted Linen Polo",
    category: "TOPS",
    price: "$55.00",
    sizes: ['S', 'M', 'L', 'XL'],
    img_class: "product-img-7",
    colors: ['Sable', 'Ecru', 'Noir'],
    is_active: true
  },
  {
    id: 8,
    name: "Minimalist Leather Sneakers",
    category: "SHOES",
    price: "$110.00",
    sizes: ['40', '41', '42', '43', '44'],
    label: "NEW",
    img_class: "product-img-8",
    colors: ['Blanc', 'Noir'],
    is_active: true
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnnounceVisible, setAnnounceVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setToastVisible] = useState(false);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  // Direct Order States
  const [isOrderOpen, setOrderOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<OrderProductInfo | null>(null);

  // Wishlist Drawer States
  const [isWishlistOpen, setWishlistOpen] = useState(false);

  // Product Details Drawer States
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any | null>(null);

  const openDetail = (product: any) => {
    setDetailProduct(product);
    setDetailOpen(true);
  };

  // Dynamic Product Data States
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load announce status, cart, and wishlist from storage on mount
  useEffect(() => {
    const closed = sessionStorage.getItem('vorn_announce_closed');
    if (closed) {
      setAnnounceVisible(false);
      document.documentElement.style.setProperty('--announce-h', '0px');
    } else {
      document.documentElement.style.setProperty('--announce-h', '36px');
    }

    const savedCart = localStorage.getItem('vorn_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items:', e);
      }
    }

    const savedWishlist = localStorage.getItem('vorn_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist items:', e);
      }
    }
  }, []);

  // Save cart to local storage on changes
  useEffect(() => {
    localStorage.setItem('vorn_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to local storage on changes
  useEffect(() => {
    localStorage.setItem('vorn_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch active products from Supabase
  useEffect(() => {
    async function loadDbProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.error('Failed to fetch store products, using fallbacks:', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadDbProducts();
  }, []);

  const dismissAnnounce = () => {
    setAnnounceVisible(false);
    document.documentElement.style.setProperty('--announce-h', '0px');
    sessionStorage.setItem('vorn_announce_closed', '1');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimer) clearTimeout(toastTimer);
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 2800);
    setToastTimer(timer);
  };

  const addToCart = (name: string, size = 'M') => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(item => item.name === name && item.size === size);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          qty: updated[existingIdx].qty + 1
        };
        return updated;
      }
      return [...prev, { name, size, qty: 1 }];
    });
    showToast(`${name} added to your bag.`);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQty = (index: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], qty };
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (name: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(name);
      if (exists) {
        showToast(`Removed from wishlist.`);
        return prev.filter((item) => item !== name);
      } else {
        showToast(`Added to wishlist.`);
        return [...prev, name];
      }
    });
  };

  // Direct Order triggers
  const startDirectOrder = (product: { name: string; price: string; imgClass: string; imgUrl?: string; sizes: string[]; colors: string[] }) => {
    setOrderProduct({ ...product, isFromCart: false });
    setOrderOpen(true);
  };

  const startCartOrder = () => {
    if (cartItems.length === 0) {
      showToast("Your bag is empty.");
      return;
    }
    
    setOrderProduct({
      name: `Cart Order (${cartItems.length} items)`,
      price: '',
      imgClass: 'product-img-1',
      sizes: ['M'],
      colors: ['Default'],
      isFromCart: true
    });
    setCartOpen(false);
    setOrderOpen(true);
  };

  const placeOrder = async (details: { name: string; phone: string; wilaya: string; size: string; color: string }) => {
    // Save to Supabase
    const payload = {
      customer_name:   details.name,
      customer_phone:  details.phone,
      customer_wilaya: details.wilaya,
      size:            details.size,
      color:           details.color,
      product_name:    orderProduct?.isFromCart ? null : orderProduct?.name ?? null,
      product_price:   orderProduct?.isFromCart ? null : orderProduct?.price ?? null,
      is_cart_order:   orderProduct?.isFromCart ?? false,
      cart_items:      orderProduct?.isFromCart ? cartItems : [],
      status:          'Pending',
    };

    const { error } = await supabase.from('orders').insert(payload);
    if (error) {
      console.error('Order insert failed:', error.message);
      showToast('Error placing order. Please try again.');
      return;
    }

    if (orderProduct?.isFromCart) {
      clearCart();
    }
    showToast(`Thank you, ${details.name}! Your order has been placed.`);
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQty,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setCartOpen,
        isSearchOpen,
        setSearchOpen,
        isMobileMenuOpen,
        setMobileMenuOpen,
        isAnnounceVisible,
        dismissAnnounce,
        toastMessage,
        showToast,
        isToastVisible,
        
        // Direct Order Exports
        isOrderOpen,
        setOrderOpen,
        orderProduct,
        startDirectOrder,
        startCartOrder,
        placeOrder,

        // Wishlist Drawer Exports
        isWishlistOpen,
        setWishlistOpen,

        // Product Details Drawer Exports
        isDetailOpen,
        setDetailOpen,
        detailProduct,
        openDetail,

        // Dynamic Products from Supabase
        products,
        loadingProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
