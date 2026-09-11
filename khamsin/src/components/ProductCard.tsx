import { useState } from "react";

import { Media } from "@/components/Media";
import type { Product } from "@/data/catalog";
import { cx, formatPrice } from "@/lib/format";

export function ProductCard({
  product,
  index,
  onQuickView,
}: {
  product: Product;
  index: number;
  onQuickView: (product: Product, colorIndex: number) => void;
}) {
  const [colorIndex, setColorIndex] = useState(0);
  const color = product.colors[colorIndex]!;

  return (
    <article
      data-reveal=""
      style={{ ["--i" as string]: index % 3 }}
      className="group flex flex-col"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => onQuickView(product, colorIndex)}
          className="block w-full cursor-pointer overflow-hidden bg-sand text-left"
          aria-label={`Quick view — ${product.name}, ${color.name}`}
        >
          <div className="relative transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
            <Media
              seed={product.id}
              tint={color.tint}
              silhouette={product.silhouette}
              ratio="portrait"
            />
            {/* Second angle, cross-faded on hover. */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <Media
                seed={product.id}
                tint={color.tint}
                silhouette={product.silhouette}
                ratio="portrait"
                variant={1}
              />
            </div>
          </div>

          {product.tag ? (
            <span className="label absolute left-4 top-4 bg-bone/90 px-3 py-2 text-ink backdrop-blur-sm">
              {product.tag}
            </span>
          ) : null}

          <span
            className={cx(
              "label absolute inset-x-4 bottom-4 flex h-11 items-center justify-center bg-ink/90 text-bone backdrop-blur-sm",
              "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100",
            )}
          >
            Quick view
          </span>
        </button>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-base font-medium text-ink">{product.name}</h3>
        <p className="text-base text-ink tabular-nums">{formatPrice(product.price)}</p>
      </div>

      <p className="label mt-2 text-ash">{product.fabric}</p>

      <div className="mt-4 flex items-center gap-2" role="group" aria-label={`${product.name} colours`}>
        {product.colors.map((option, optionIndex) => {
          const active = optionIndex === colorIndex;
          return (
            <button
              key={option.name}
              type="button"
              onClick={() => setColorIndex(optionIndex)}
              aria-pressed={active}
              aria-label={option.name}
              title={option.name}
              className={cx(
                "h-5 w-5 rounded-full border transition-[box-shadow,border-color] duration-300",
                active ? "border-ink/50 shadow-[0_0_0_2px_var(--color-bone),0_0_0_3px_var(--color-ink)]" : "border-ink/15 hover:border-ink/40",
              )}
              style={{ backgroundColor: option.chip }}
            />
          );
        })}
        <span className="label ml-1 text-ash">{color.name}</span>
      </div>
    </article>
  );
}

export default ProductCard;
