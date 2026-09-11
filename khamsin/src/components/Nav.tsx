import { useEffect, useRef, useState } from "react";

import { cx } from "@/lib/format";
import { useFocusTrap, useLockBodyScroll, useScrollPosition } from "@/lib/hooks";
import { useCart } from "@/store/cart";

const LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#craft", label: "Craft" },
  { href: "#lookbook", label: "Lookbook" },
  { href: "#journal", label: "Journal" },
];

function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      className={cx(
        "display text-2xl leading-none tracking-[0.14em] transition-colors duration-500",
        className,
      )}
      aria-label="KHAMSIN — back to top"
    >
      KHAMSIN
    </a>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useFocusTrap(open, panel, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="anim-scrim absolute inset-0 bg-ink/40" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className="anim-fade-up absolute inset-x-0 top-0 bg-bone px-6 pb-12 pt-6 shadow-[0_30px_80px_-40px_rgba(23,20,15,0.6)]"
      >
        <div className="flex items-center justify-between">
          <Wordmark className="text-ink" />
          <button
            type="button"
            onClick={onClose}
            className="label -mr-2 p-2 text-smoke transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>

        <nav className="mt-10 flex flex-col">
          {LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{ animationDelay: `${80 + index * 60}ms` }}
              className="anim-fade-up display border-b hairline py-5 text-4xl text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="mt-10 text-sm leading-relaxed text-smoke">
          Small-run essentials, cut in Cairo. Free shipping over $250, three-year seam repairs on
          everything we make.
        </p>
      </div>
    </div>
  );
}

export function Nav() {
  const scrollY = useScrollPosition();
  const { count, openBag, lastAddedAt } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [progress, setProgress] = useState(0);

  const condensed = scrollY > 80;

  useEffect(() => {
    if (!lastAddedAt) return;
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(timer);
  }, [lastAddedAt]);

  useEffect(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? Math.min(1, scrollY / max) : 0);
  }, [scrollY]);

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          condensed
            ? "border-b hairline bg-bone/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cx(
            "mx-auto flex max-w-[100rem] items-center justify-between px-6 transition-[height] duration-500 md:px-10",
            condensed ? "h-16" : "h-24",
          )}
        >
          <Wordmark className={condensed ? "text-ink" : "text-bone"} />

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cx(
                  "link-underline label transition-colors duration-500",
                  condensed ? "text-ink/70 hover:text-ink" : "text-bone/70 hover:text-bone",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={openBag}
              className={cx(
                "label group relative flex items-center gap-2 transition-colors duration-500",
                condensed ? "text-ink" : "text-bone",
              )}
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <span className="hidden sm:inline">Bag</span>
              <svg
                aria-hidden="true"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="sm:hidden"
              >
                <path
                  d="M3.5 5.5h10l-.8 9.5H4.3l-.8-9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path d="M6 6V4.4a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span
                className={cx(
                  "grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[0.6875rem] leading-none transition-[transform,background-color] duration-500",
                  condensed ? "bg-ink text-bone" : "bg-bone text-ink",
                  pulse && "scale-125",
                )}
              >
                {count}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cx(
                "label md:hidden",
                condensed ? "text-ink" : "text-bone",
              )}
              aria-label="Open menu"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Reading progress — a single hairline, no chrome. */}
        <div
          aria-hidden="true"
          className="h-px origin-left bg-clay transition-transform duration-150 ease-linear"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Nav;
