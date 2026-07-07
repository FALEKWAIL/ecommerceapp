import type { Metadata } from "next";
import { Barlow_Condensed, Inter, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./css/style.css";
import "./css/components.css";
import "./css/animations.css";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import {
  Header, MobileMenu, SearchOverlay, CartDrawer,
  Toast, CursorGlow, Footer, OrderModal, WishlistDrawer,
  ProductDetailDrawer,
} from "./components/UIComponents";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display-google",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body-google",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-ui-google",
});

export const metadata: Metadata = {
  title: "VORN — Men's Contemporary Fashion",
  description: "VORN is a e-commerce menswear brand.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the x-is-admin header injected by next.config.ts for /admin/* routes.
  // This avoids needing proxy/middleware files entirely.
  const headersList = await headers();
  const isAdmin = headersList.get("x-is-admin") === "1";

  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable} ${dmSans.variable}`}>
      <body>
        {isAdmin ? (
          // Admin routes: clean slate — no storefront chrome
          children
        ) : (
          // Store routes: full storefront shell
          <AppProvider>
            <Header />
            <MobileMenu />
            <SearchOverlay />
            <CartDrawer />
            <WishlistDrawer />
            <OrderModal />
            <ProductDetailDrawer />
            {children}
            <Footer />
            <Toast />
            <CursorGlow />
          </AppProvider>
        )}
      </body>
    </html>
  );
}
