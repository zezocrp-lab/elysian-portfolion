import { useEffect, useRef, useState } from "react";

import { Media } from "@/components/Media";
import { Button } from "@/components/ui";
import type { Product } from "@/data/catalog";
import { cx, formatPrice } from "@/lib/format";
import { useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { useCart } from "@/store/cart";

export function QuickView({
  product,
  initialColorIndex,
  onClose,
}: {
  product: Product | null;
  initialColorIndex: number;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const open = product !== null;

  const [colorIndex, setColorIndex] = useState(initialColorIndex);
  const [size, setSize] = useState<string | null>(null);

  useLockBodyScroll(open);
  useFocusTrap(open, panel, onClose);

  // Reset selections whenever a different product opens.
  useEffect(() => {
    if (!product) return;
    setColorIndex(initialColorIndex);
    const firstAvailable = product.sizes.find((option) => option.inStock);
    setSize(product.sizes.length === 1 ? (firstAvailable?.label ?? null) : null);
  }, [product, initialColorIndex]);

  const { add } = useCart();

  if (!product) return null;

  const color = product.colors[Math.min(colorIndex, product.colors.length - 1)]!;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="anim-scrim absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-sm"
      />

      <div
        ref={panel}
        tabIndex={-1}
        className="anim-pop-in relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden bg-paper shadow-[0_50px_120px_-50px_rgba(23,20,15,0.7)] md:max-h-[86vh] md:flex-row"
      >
        <div className="relative shrink-0 md:w-[46%]">
          <Media
            seed={product.id}
            tint={color.tint}
            silhouette={product.silhouette}
            ratio="square"
            className="md:aspect-auto md:h-full"
          />
          <button
            type="button"
            onClick={onClose}
            className="label absolute right-4 top-4 h-10 bg-bone/90 px-4 text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-bone md:hidden"
          >
            Close
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-7 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="label text-ash">{product.category}</p>
              <h2 id="quickview-title" className="display mt-3 text-4xl md:text-5xl">
                {product.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="label hidden shrink-0 text-smoke transition-colors hover:text-ink md:block"
            >
              Close
            </button>
          </div>

          <p className="mt-4 text-xl tabular-nums text-ink">{formatPrice(product.price)}</p>

          <p className="mt-6 leading-relaxed text-smoke">{product.description}</p>

          <div className="mt-8">
            <p className="label text-ash">
              Colour — <span className="text-ink">{color.name}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((option, index) => {
                const active = index === colorIndex;
                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColorIndex(index)}
                    aria-pressed={active}
                    className={cx(
                      "flex items-center gap-2 border px-3 py-2 text-xs transition-colors duration-300",
                      active ? "border-ink text-ink" : "border-ink/15 text-smoke hover:border-ink/40",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full border border-ink/10"
                      style={{ backgroundColor: option.chip }}
                    />
                    {option.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <p className="label text-ash">Size</p>
              <button type="button" className="link-underline label text-smoke hover:text-ink">
                Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => {
                const active = size === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    disabled={!option.inStock}
                    onClick={() => setSize(option.label)}
                    aria-pressed={active}
                    className={cx(
                      "label h-11 min-w-14 border px-4 transition-colors duration-300",
                      !option.inStock &&
                        "cursor-not-allowed border-ink/10 text-ash line-through decoration-ash/60",
                      option.inStock && active && "border-ink bg-ink text-bone",
                      option.inStock && !active && "border-ink/20 text-ink hover:border-ink",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              full
              variant={size ? "solid" : "outline"}
              disabled={!size}
              onClick={() => {
                if (!size) return;
                add({ productId: product.id, color: color.name, size, quantity: 1 });
                onClose();
              }}
            >
              {size ? "Add to bag" : "Select a size"}
            </Button>
            <p className="mt-3 text-center text-xs text-ash">
              Free shipping over $250 · 30-day returns · Three-year seam repairs
            </p>
          </div>

          <dl className="mt-9 border-t hairline pt-6 text-sm">
            <div className="flex justify-between gap-6 py-2">
              <dt className="text-ash">Fabric</dt>
              <dd className="text-right text-ink">{product.fabric}</dd>
            </div>
            <div className="flex justify-between gap-6 py-2">
              <dt className="text-ash">Weight</dt>
              <dd className="text-right text-ink">{product.weight}</dd>
            </div>
            <div className="flex justify-between gap-6 py-2">
              <dt className="text-ash">Origin</dt>
              <dd className="text-right text-ink">{product.origin}</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-2">
            {product.notes.map((note) => (
              <li key={note} className="flex gap-3 text-sm text-smoke">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-clay" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QuickView;
