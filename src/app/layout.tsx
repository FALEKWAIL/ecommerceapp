import type { Metadata } from "next";
import { Barlow_Condensed, Inter, DM_Sans } from "next/font/google";
import "./css/style.css";
import "./css/components.css";
import "./css/animations.css";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import { Header, MobileMenu, SearchOverlay, CartDrawer, Toast, CursorGlow, Footer, OrderModal, WishlistDrawer } from "./components/UIComponents";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable} ${dmSans.variable}`}>
      <body>
        <AppProvider>
          <Header />
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />
          <WishlistDrawer />
          <OrderModal />
          {children}
          <Footer />
          <Toast />
          <CursorGlow />
        </AppProvider>
      </body>
    </html>
  );
}
