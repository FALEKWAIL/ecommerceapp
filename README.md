# VORN — Men's Contemporary Fashion

VORN is a premium, editorial-grade menswear e-commerce landing page designed for presenting to potential stores and clients. Inspired by high-contrast, minimalist aesthetics of modern retail giants (Zara, Pull & Bear, Bershka), VORN features zero emojis, clean typographic spacing, bold presentation grids, and smooth performance-minded animations.

---

## ✦ Core Features

*   **Split-Screen Viewport Hero Layout**: Editorial lookbook hero dividing content (`1.15fr` and `0.85fr`) with full-bleed imagery and background text watermark layers to eliminate visual overlapping.
*   **Dynamic Navigation Header**: An announcement bar that is fully dismissible. Dismissing the bar dynamically adjusts page margins and offsets (via JavaScript CSS variable resets).
*   **Search Overlay Drawer**: Interactive, sleek fullscreen search drawer using premium reveal transitions.
*   **Interactive Cart Drawer & Toast Notifications**: Client-side interactive cart drawer supporting real-time item additions, deletions, size tracking, and custom floating toast notifications.
*   **Micro-Interactions & Tilt Effects**: Premium, performance-optimized card hovering with perspective tilting (desktop only) and custom cursor glow tracking.
*   **Scroll Reveal Animation System**: Lazy loading visual entry effects triggered by viewport intersection observers rather than simple load hooks.

---

## ✦ Technology Stack

*   **HTML5**: Structurally organized semantic code.
*   **CSS3**: Custom CSS custom variables (`:root`), Grid structures, Flex layouts, and hardware-accelerated cubic bezier transitions.
*   **ES6+ Javascript**: Lightweight Vanilla JS for all state-management, layout updates, and interactive components. No bulky NPM build steps or bundle sizes.

---

## ✦ Directory Architecture

```text
clothing/
├── index.html          # Main entry page containing components and templates
├── css/
│   ├── style.css       # Core stylesheet: resets, typography, layout structures, grid models
│   ├── components.css  # Component overlays, drawers, search drawers, toasts, cart cards
│   └── animations.css  # Custom timing paths, keyframe behaviors, slide reveals, parallax offsets
├── js/
│   └── main.js         # Interactive modules: cart, scroll triggers, custom cursor, tilt actions
└── assets/
    └── images/         # Premium model catalog photos
```

---

## ✦ Global Design System (Tokens)

All styles are configured in `css/style.css` using standard CSS variables inside `:root`. To customize the site styling:

*   **Warm Off-White Background**: `--col-bg` (`#F0EDE8`)
*   **Primary Deep Dark Tone**: `--col-dark` (`#0C0C0C`)
*   **Brand Accent**: `--col-sand` (`#B8956A`)
*   **Typography**:
    *   Display headers: `Barlow Condensed`
    *   Body text: `Inter`
    *   Interactive UI elements: `DM Sans`

---

## ✦ Running the Project Locally

Because VORN utilizes interactive search drawers, templates, and script modules, it is best ran through a local web server to avoid CORS/permission errors. Choose one of the following methods:

### Method A: Python HTTP Server (Recommended)
Python is pre-installed on most environments. Run this in your terminal inside the project folder:
```bash
python -m http.server 7890
```
Then open: **`http://localhost:7890`**

### Method B: Node.js (npx)
If Node.js is installed, you can spin up a quick server without globally installing any libraries:
```bash
npx http-server -p 7890
```
Then open: **`http://localhost:7890`**

### Method C: VS Code Live Server Extension
1. Open the project folder in VS Code.
2. If you don't have it, install the extension **"Live Server"** by Ritwick Dey.
3. Click the **"Go Live"** button in the status bar at the bottom right corner of VS Code.

### Method D: Double-Click index.html (Static)
You can directly double-click the `index.html` file to open it in your browser. Note that some advanced browser security policies might restrict custom drawer overlays or local file reading over the `file://` protocol.
