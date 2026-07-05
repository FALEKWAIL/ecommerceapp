/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VORN — Main JavaScript
   All UI interactions, scroll effects, cart logic
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

'use strict';

// ── LINK STYLESHEETS ───────────────────────────────── */
(function loadStyles() {
  ['css/animations.css', 'css/components.css'].forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
})();

// ── ANNOUNCE BAR ──────────────────────────────────── */
(function initAnnounceBar() {
  const bar = document.getElementById('announce-bar');
  const close = document.getElementById('announce-close');

  if (!bar || !close) return;

  close.addEventListener('click', () => {
    bar.classList.add('hidden');
    document.documentElement.style.setProperty('--announce-h', '0px');
    sessionStorage.setItem('vorn_announce_closed', '1');
  });

  if (sessionStorage.getItem('vorn_announce_closed')) {
    bar.classList.add('hidden');
    document.documentElement.style.setProperty('--announce-h', '0px');
  }
})();

// ── NAVIGATION SCROLL ─────────────────────────────── */
(function initNavScroll() {
  const header = document.getElementById('header-container');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;

    if (scroll > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();


// ── MOBILE MENU ───────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();

// ── SEARCH OVERLAY ────────────────────────────────── */
(function initSearch() {
  const btnSearch = document.getElementById('btn-search');

  // Create overlay on first click
  let overlay = null;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'search-overlay';
    overlay.innerHTML = `
      <button class="search-overlay-close" id="search-overlay-close">✕</button>
      <form class="search-overlay-form" onsubmit="return false">
        <input
          type="text"
          class="search-overlay-input"
          id="search-input"
          placeholder="Search VORN..."
          autocomplete="off"
        />
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </form>
      <p class="search-overlay-hint">Try: Overshirt · Cargo · Knitwear · Sale</p>
    `;
    document.body.appendChild(overlay);

    document.getElementById('search-overlay-close').addEventListener('click', closeSearch);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeSearch();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearch();
    });
  }

  function openSearch() {
    if (!overlay) buildOverlay();
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      setTimeout(() => document.getElementById('search-input')?.focus(), 50);
    });
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnSearch) btnSearch.addEventListener('click', openSearch);
})();

// ── CART ──────────────────────────────────────────── */
const Cart = (function () {
  let items = [];
  let count = 0;

  const countEl = document.getElementById('cart-count');
  const drawerCountEl = document.getElementById('cart-drawer-count');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const drawerBody = document.getElementById('cart-drawer-body');

  function updateCount() {
    if (countEl) countEl.textContent = count;
    if (drawerCountEl) drawerCountEl.textContent = count;
  }

  function open() {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function addItem(name) {
    count++;
    items.push(name);
    updateCount();
    renderItems();
    showToast(`${name} added to your bag.`);
  }

  function renderItems() {
    if (!drawerBody) return;
    if (items.length === 0) {
      drawerBody.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
      return;
    }
    drawerBody.innerHTML = items.map((item, i) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--col-border);">
        <div>
          <div style="font-family:var(--font-body);font-size:14px;color:var(--col-dark);">${item}</div>
          <div style="font-family:var(--font-display);font-size:11px;letter-spacing:0.1em;color:var(--col-muted);margin-top:4px;">SIZE M · QTY 1</div>
        </div>
        <button onclick="Cart.remove(${i})" style="font-size:16px;color:var(--col-muted);background:none;border:none;cursor:pointer;">✕</button>
      </div>
    `).join('');
  }

  function remove(index) {
    items.splice(index, 1);
    count = Math.max(0, count - 1);
    updateCount();
    renderItems();
  }

  // Init
  const btnCart = document.getElementById('btn-cart');
  const closeBtn = document.getElementById('cart-drawer-close');

  if (btnCart) btnCart.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  return { open, close, addItem, remove };
})();

// Make Cart available globally for inline HTML references
window.Cart = Cart;

// ── QUICK ADD BUTTONS ─────────────────────────────── */
(function initQuickAdd() {
  const productNames = {
    1: 'Washed Canvas Overshirt',
    2: 'Oversized Cargo Tee',
    3: 'Relaxed Cargo Trousers',
    4: 'Heavyweight Crew Sweat',
  };

  document.querySelectorAll('.product-quick-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.product;
      const name = productNames[id] || 'Item';

      btn.textContent = 'ADDED ✓';
      btn.classList.add('added');

      setTimeout(() => {
        btn.textContent = 'QUICK ADD';
        btn.classList.remove('added');
      }, 1800);

      Cart.addItem(name);
    });
  });
})();

// ── WISHLIST TOGGLE ────────────────────────────────── */
(function initWishlist() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const added = btn.classList.contains('active');
      showToast(added ? 'Added to wishlist.' : 'Removed from wishlist.');
    });
  });
})();

// ── TOAST ─────────────────────────────────────────── */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

window.showToast = showToast;

// ── NEWSLETTER ────────────────────────────────────── */
window.handleNewsletter = function (e) {
  e.preventDefault();
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');

  if (!input?.value) return false;

  form?.classList.add('success');
  input.value = '';

  setTimeout(() => {
    form?.classList.remove('success');
  }, 600);

  showToast('You\'re on the list. Welcome to VORN.');
  return false;
};

// ── HERO IMAGE LOAD ───────────────────────────────── */
(function initHeroImage() {
  const img = document.getElementById('hero-img');
  if (!img) return;
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
  }
})();

// ── PARALLAX HERO LETTERFORM ──────────────────────── */
(function initHeroParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.25;
    bgText.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
  }, { passive: true });
})();

// ── CURSOR GLOW (desktop only) ────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
})();

// ── SCROLL REVEAL ─────────────────────────────────── */
(function initScrollReveal() {
  // Add data-reveal to elements that should animate in
  const selectors = [
    '.cat-item',
    '.campaign-text',
    '.campaign-image',
    '.trust-item',
    '.product-card',
    '.newsletter-inner',
    '.footer-col',
    '.footer-brand',
    '.products-header',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.setAttribute('data-reveal', '');
    });
  });

  // Campaign headline special treatment
  const headline = document.querySelector('.campaign-headline');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();


// ── PRODUCT CARD HOVER TILT (subtle) ─────────────── */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 3;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 3;
      card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

console.log('%cVORN', 'font-size:40px;font-weight:900;letter-spacing:0.2em;color:#0C0C0C;');
console.log('%cDefine Your Standard.', 'font-size:14px;color:#B8956A;letter-spacing:0.1em;');
