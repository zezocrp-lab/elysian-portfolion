import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/* ==========================================================================
   prefers-reduced-motion
   Every motion hook below no-ops when this is true. The CSS does the same,
   so the two layers agree.
   ========================================================================== */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/* ==========================================================================
   Scroll reveal
   One observer for the whole document. Anything with [data-reveal] gets
   [data-shown="true"] the first time it enters the viewport — including
   nodes mounted later, which is what makes the filtered product grid work.
   ========================================================================== */
export function useRevealObserver(): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return; // CSS already pins these elements to their end state.

    let frame = 0;

    /**
     * Deliberately a geometry check rather than an IntersectionObserver.
     * An observer only fires on threshold crossings, so a fast flick or an
     * anchor jump can carry an element from below the fold to above it
     * without ever reporting an intersection — and that element then stays
     * invisible forever. Testing "has this element's top passed the fold"
     * cannot miss, and the candidate list shrinks to nothing as the page is
     * read.
     */
    const sweep = () => {
      frame = 0;
      const fold = window.innerHeight * 0.92;
      document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((node) => {
        if (node.getBoundingClientRect().top < fold) node.setAttribute("data-shown", "true");
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(sweep);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Catches nodes mounted later — the filtered product grid, mostly.
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mutations.disconnect();
    };
  }, [reduced]);
}

/* ==========================================================================
   Parallax
   Translates an element against the scroll, measured from viewport centre so
   the offset is zero when the element is dead centre. rAF-throttled and
   passive; it writes a transform and nothing else.
   ========================================================================== */
export function useParallax<T extends HTMLElement>(strength = 0.1) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < -viewport || rect.top > viewport * 2) return;
      const distance = rect.top + rect.height / 2 - viewport / 2;
      node.style.transform = `translate3d(0, ${(-distance * strength).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      node.style.transform = "";
    };
  }, [strength, reduced]);

  return ref;
}

/** Raw scroll position, rAF-throttled. Used for the nav state and progress. */
export function useScrollPosition(): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return y;
}

/* ==========================================================================
   Overlay plumbing — scroll lock, focus trap, escape to close.
   ========================================================================== */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gutter = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [active]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab inside `container` while `active`, restores focus to whatever was
 * focused before the overlay opened, and calls `onClose` on Escape.
 */
export function useFocusTrap(
  active: boolean,
  container: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = container.current;

    /**
     * Only elements that are actually rendered. Responsive overlays keep a
     * hidden duplicate close button for the other breakpoint; focusing one of
     * those silently fails and the trap never engages.
     */
    const getTargets = () =>
      node
        ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (element) => element.offsetParent !== null || element === document.activeElement,
          )
        : [];

    const frame = requestAnimationFrame(() => {
      const targets = getTargets();
      (targets[0] ?? node)?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !node) return;

      const targets = getTargets();
      if (targets.length === 0) return;

      const first = targets[0]!;
      const last = targets[targets.length - 1]!;
      const active = document.activeElement;

      // Focus escaped the overlay entirely — pull it back to the near edge.
      if (!active || !node.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [active, container, onClose]);
}

/* ==========================================================================
   Horizontal rail control for the lookbook.
   ========================================================================== */
export function useHorizontalRail<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const ratio = max > 0 ? node.scrollLeft / max : 0;
    setProgress(ratio);
    setAtStart(node.scrollLeft <= 2);
    setAtEnd(max - node.scrollLeft <= 2);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    measure();
    node.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      node.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const scrollByCards = useCallback((direction: 1 | -1) => {
    const node = ref.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-rail-item]");
    const step = card ? card.offsetWidth + 24 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return { ref, progress, atStart, atEnd, scrollByCards };
}
