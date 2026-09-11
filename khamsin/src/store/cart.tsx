import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { PRODUCTS, type Product } from "@/data/catalog";

export const FREE_SHIPPING_THRESHOLD = 25000; // cents

export type CartLine = {
  /** productId + colour + size — the actual SKU identity. */
  key: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

type CartAction =
  | { type: "add"; line: Omit<CartLine, "key">; }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const STORAGE_KEY = "khamsin.bag.v1";

function lineKey(line: Omit<CartLine, "key">): string {
  return `${line.productId}::${line.color}::${line.size}`;
}

function reducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;

    case "add": {
      const key = lineKey(action.line);
      const existing = state.find((line) => line.key === key);
      if (existing) {
        return state.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(9, line.quantity + action.line.quantity) }
            : line,
        );
      }
      return [...state, { ...action.line, key }];
    }

    case "setQuantity": {
      if (action.quantity <= 0) return state.filter((line) => line.key !== action.key);
      return state.map((line) =>
        line.key === action.key ? { ...line, quantity: Math.min(9, action.quantity) } : line,
      );
    }

    case "remove":
      return state.filter((line) => line.key !== action.key);

    case "clear":
      return [];

    default:
      return state;
  }
}

export type ResolvedLine = CartLine & { product: Product; lineTotal: number };

type CartValue = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  /** 0 → 1 progress toward free shipping. */
  shippingProgress: number;
  remainingForFreeShipping: number;
  isOpen: boolean;
  /** Bumps on every add so the nav badge can pulse. */
  lastAddedAt: number;
  openBag: () => void;
  closeBag: () => void;
  add: (line: Omit<CartLine, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).productId === "string" &&
        PRODUCTS.some((product) => product.id === (line as CartLine).productId),
    );
  } catch {
    // Private mode, disabled storage, corrupt payload — an empty bag is fine.
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  // Hydrate after mount so the first paint never depends on storage.
  useEffect(() => {
    const stored = readStoredLines();
    if (stored.length > 0) dispatch({ type: "hydrate", lines: stored });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* Storage is a convenience, never a requirement. */
    }
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    dispatch({ type: "add", line });
    setLastAddedAt(Date.now());
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: "setQuantity", key, quantity });
  }, []);

  const remove = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartValue>(() => {
    const resolved: ResolvedLine[] = lines.flatMap((line) => {
      const product = PRODUCTS.find((candidate) => candidate.id === line.productId);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.quantity }];
    });

    const subtotal = resolved.reduce((total, line) => total + line.lineTotal, 0);
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return {
      lines: resolved,
      count: resolved.reduce((total, line) => total + line.quantity, 0),
      subtotal,
      shippingProgress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
      remainingForFreeShipping: remaining,
      isOpen,
      lastAddedAt,
      openBag,
      closeBag,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, isOpen, lastAddedAt, openBag, closeBag, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
