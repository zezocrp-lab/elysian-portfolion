import { useMemo, useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/ui";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/data/catalog";
import { cx } from "@/lib/format";

export function Collection({
  onQuickView,
}: {
  onQuickView: (product: Product, colorIndex: number) => void;
}) {
  const [filter, setFilter] = useState<Category | "All">("All");

  const products = useMemo(
    () => (filter === "All" ? PRODUCTS : PRODUCTS.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <section id="collection" className="mx-auto max-w-[100rem] px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="Collection 004"
        title={
          <>
            Twelve pieces,
            <br />
            <span className="italic">no filler.</span>
          </>
        }
        aside="Everything here is in stock and ships within two working days. Sizes run generously — when between, take the smaller."
      />

      <div className="mt-14 flex flex-col gap-6 border-b hairline pb-6 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((category) => {
            const active = category === filter;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(category)}
                className={cx(
                  "label h-10 shrink-0 border px-5 transition-[background-color,color,border-color] duration-300",
                  active
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/15 text-smoke hover:border-ink/45 hover:text-ink",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p className="label shrink-0 text-ash" aria-live="polite">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          // Keying on filter forces a fresh reveal animation per filter change.
          <ProductCard
            key={`${filter}-${product.id}`}
            product={product}
            index={index}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}

export default Collection;
