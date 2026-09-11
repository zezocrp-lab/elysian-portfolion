import { useRef } from "react";

import { Media } from "@/components/Media";
import { Button } from "@/components/ui";
import { cx, formatPrice } from "@/lib/format";
import { useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { useCart } from "@/store/cart";

function Stepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center border hairline">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="grid h-8 w-8 place-items-center text-smoke transition-colors hover:text-ink"
        aria-label={`Decrease quantity of ${label}`}
      >
        <span aria-hidden="true">–</span>
      </button>
      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 9}
        className="grid h-8 w-8 place-items-center text-smoke transition-colors hover:text-ink disabled:opacity-30"
        aria-label={`Increase quantity of ${label}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export function CartDrawer() {
  const panel = useRef<HTMLDivElement>(null);
  const {
    isOpen,
    closeBag,
    lines,
    count,
    subtotal,
    shippingProgress,
    remainingForFreeShipping,
    setQuantity,
    remove,
  } = useCart();

  useLockBodyScroll(isOpen);
  useFocusTrap(isOpen, panel, closeBag);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        onClick={closeBag}
        aria-label="Close bag"
        className="anim-scrim absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-sm"
      />

      <div
        ref={panel}
        tabIndex={-1}
        className="anim-slide-in absolute inset-y-0 right-0 flex w-full max-w-[27rem] flex-col bg-bone shadow-[-30px_0_80px_-40px_rgba(23,20,15,0.65)]"
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <h2 className="label text-ink">
            Your bag <span className="text-ash">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeBag}
            className="label text-smoke transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>

        {lines.length > 0 ? (
          <div className="border-b hairline px-6 py-4">
            <p className="text-xs text-smoke">
              {remainingForFreeShipping > 0 ? (
                <>
                  <span className="text-ink">{formatPrice(remainingForFreeShipping)}</span> away from
                  free shipping
                </>
              ) : (
                <span className="text-ink">Free shipping unlocked</span>
              )}
            </p>
            <div className="mt-2 h-px w-full bg-ink/10">
              <div
                className="h-px origin-left bg-clay transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `scaleX(${shippingProgress})` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 py-20 text-center">
              <p className="display text-3xl text-ink">Nothing in here yet.</p>
              <p className="max-w-[26ch] text-sm text-smoke">
                Twelve pieces, all in stock. Start with the Field Overshirt — it is the one we build
                every season around.
              </p>
              <Button variant="outline" onClick={closeBag}>
                Browse the collection
              </Button>
            </div>
          ) : (
            <ul className="divide-y hairline">
              {lines.map((line) => {
                const swatch =
                  line.product.colors.find((option) => option.name === line.color) ??
                  line.product.colors[0]!;
                return (
                  <li key={line.key} className="flex gap-4 py-5">
                    <div className="w-20 shrink-0">
                      <Media
                        seed={line.product.id}
                        tint={swatch.tint}
                        silhouette={line.product.silhouette}
                        ratio="portrait"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate text-sm font-medium text-ink">{line.product.name}</p>
                        <p className="shrink-0 text-sm tabular-nums text-ink">
                          {formatPrice(line.lineTotal)}
                        </p>
                      </div>
                      <p className="label mt-1.5 text-ash">
                        {line.color} / {line.size}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <Stepper
                          value={line.quantity}
                          label={line.product.name}
                          onChange={(next) => setQuantity(line.key, next)}
                        />
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          className="link-underline text-xs text-ash transition-colors hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={cx(
            "border-t hairline px-6 py-6 transition-opacity",
            lines.length === 0 && "pointer-events-none opacity-40",
          )}
        >
          <div className="flex items-baseline justify-between">
            <span className="label text-ash">Subtotal</span>
            <span className="text-xl tabular-nums text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-ash">Taxes and duties calculated at checkout.</p>
          <Button size="lg" full className="mt-5" disabled={lines.length === 0}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
