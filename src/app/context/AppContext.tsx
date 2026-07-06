'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  name: string;
  size: string;
  qty: number;
};

export type OrderProductInfo = {
  name: string;
  price: string;
  imgClass: string;
  sizes: string[];
  colors: string[];
  isFromCart?: boolean;
};

type AppContextType = {
  cartItems: CartItem[];
  addToCart: (name: string, size?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
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
  startDirectOrder: (product: { name: string; price: string; imgClass: string; sizes: string[]; colors: string[] }) => void;
  startCartOrder: () => void;
  placeOrder: (details: { name: string; phone: string; wilaya: string; size: string; color: string }) => void;

  // Wishlist Drawer States
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

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

  // Load announce status from sessionStorage
  useEffect(() => {
    const closed = sessionStorage.getItem('vorn_announce_closed');
    if (closed) {
      setAnnounceVisible(false);
      document.documentElement.style.setProperty('--announce-h', '0px');
    } else {
      document.documentElement.style.setProperty('--announce-h', '36px');
    }
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
    setCartItems((prev) => [...prev, { name, size, qty: 1 }]);
    showToast(`${name} added to your bag.`);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
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
  const startDirectOrder = (product: { name: string; price: string; imgClass: string; sizes: string[]; colors: string[] }) => {
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

  const placeOrder = (details: { name: string; phone: string; wilaya: string; size: string; color: string }) => {
    console.log("Order Placed:", { details, orderProduct, cartItems });
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
