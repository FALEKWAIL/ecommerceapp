# VORN — Men's Contemporary Fashion (Next.js Version)

VORN is a premium, editorial-grade menswear e-commerce platform designed for presenting to potential stores and clients. Inspired by the high-contrast, minimalist aesthetics of modern retail giants (Zara, Pull & Bear, Bershka), VORN features clean typographic spacing, bold presentation grids, and smooth performance-minded react animations.

---

## ✦ Core Features

*   **Next.js App Router**: Built using the contemporary Next.js App Router pattern for optimal routing, performance, and developer experience.
*   **Split-Screen Hero Layout**: Editorial lookbook hero dividing content (`1.15fr` and `0.85fr`) with full-bleed imagery and background text watermark layers to eliminate visual overlapping.
*   **Dynamic Navigation Header**: An announcement bar that is fully dismissible. Dismissing the bar dynamically adjusts page margins and offsets via custom state handlers.
*   **Search Overlay Drawer**: Interactive, sleek fullscreen search drawer using premium reveal transitions.
*   **Interactive Cart Drawer & Toast Notifications**: Interactive cart drawer supporting real-time item additions, deletions, size tracking, and custom floating toast notifications.
*   **Micro-Interactions & Tilt Effects**: Premium, performance-optimized card hovering with perspective tilting (desktop only) and custom cursor glow tracking.
*   **React Context State Management**: Clean, centralized global state for managing cart items, wishlist status, search overlays, and UI feedback.

---

## ✦ Technology Stack

*   **Core**: [Next.js](https://nextjs.org/) (v16+) with [React](https://react.dev/) (v19+)
*   **Language**: TypeScript
*   **Styling**: Pure CSS3 Custom Variables (`:root`), Flexbox/Grid layouts, and hardware-accelerated cubic bezier transitions.

---

## ✦ Directory Architecture

```text
clothing/
├── public/             # Static public assets (logos, icons)
├── assets/
│   └── images/         # Premium model catalog photos
├── src/
│   └── app/
│       ├── components/ # Reusable UI components (OrderModal, UIComponents, Cart, Search, etc.)
│       ├── context/    # React Context providers for global UI states
│       ├── css/        # Styling tokens, animation timing paths, and keyframes
│       │   ├── style.css       # Core styles, design tokens, resets
│       │   ├── components.css  # Component overlays, drawers, search drawers, toasts, cart cards
│       │   └── animations.css  # Custom timing paths, keyframe behaviors, scroll-reveals
│       ├── layout.tsx  # Root Layout containing fonts and context providers
│       └── page.tsx    # Main Landing Page route component
```

---

## ✦ Global Design System (Tokens)

All styles are configured in `src/app/css/style.css` using standard CSS variables inside `:root`. To customize the site styling:

*   **Warm Off-White Background**: `--col-bg` (`#F0EDE8`)
*   **Primary Deep Dark Tone**: `--col-dark` (`#0C0C0C`)
*   **Brand Accent**: `--col-sand` (`#B8956A`)
*   **Typography**:
    *   Display headers: `Barlow Condensed`
    *   Body text: `Inter`
    *   Interactive UI elements: `DM Sans`

---

## ✦ Running the Project Locally

To run the Next.js development server locally, follow these steps:

### 1. Install Dependencies
Make sure you have Node.js installed, then install the package dependencies:
```bash
npm install
```

### 2. Start the Development Server
Run the local dev server:
```bash
npm run dev
```
Once running, open your browser and navigate to: **`http://localhost:3000`**

### 3. Build for Production
To build and check for production compile correctness:
```bash
npm run build
```

### 4. Start Production Server
To preview the production build locally:
```bash
npm run start
```
