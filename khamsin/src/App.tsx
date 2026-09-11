import { useCallback, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { Collection } from "@/components/Collection";
import { Craft } from "@/components/Craft";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Lookbook } from "@/components/Lookbook";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Newsletter } from "@/components/Newsletter";
import { QuickView } from "@/components/QuickView";
import type { Product } from "@/data/catalog";
import { useRevealObserver } from "@/lib/hooks";
import { CartProvider } from "@/store/cart";

function Storefront() {
  useRevealObserver();

  const [quickView, setQuickView] = useState<{ product: Product; colorIndex: number } | null>(null);

  const openQuickView = useCallback((product: Product, colorIndex: number) => {
    setQuickView({ product, colorIndex });
  }, []);

  const closeQuickView = useCallback(() => setQuickView(null), []);

  return (
    <>
      <a
        href="#main"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-bone"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <Manifesto />
        <Collection onQuickView={openQuickView} />
        <Craft />
        <Lookbook />
        <Journal />
        <Newsletter />
      </main>

      <Footer />

      <QuickView
        product={quickView?.product ?? null}
        initialColorIndex={quickView?.colorIndex ?? 0}
        onClose={closeQuickView}
      />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}
