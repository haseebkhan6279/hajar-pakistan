"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, ProductAddon } from "@/lib/data";

export type CartLine = {
  product: Product;
  color: string;
  /** Extras ticked on the product page, e.g. sleeves */
  addons: ProductAddon[];
  qty: number;
};

/** Price of one piece with its extras. */
export function unitPrice(line: CartLine) {
  return (
    line.product.price +
    (line.addons ?? []).reduce((sum, a) => sum + a.price, 0)
  );
}

/** "Colour · Add Sleeves" — the line's choices, for the bag and checkout. */
export function lineOptions(line: CartLine) {
  return [line.color, ...(line.addons ?? []).map((a) => a.label)]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Shipping is not quoted on the site. Per the published shipping policy,
 * charges vary by destination, package size and courier, and are confirmed
 * before the order is. The basket therefore shows the subtotal only.
 */
const STORAGE_KEY = "hj-cart";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  total: number;
  isOpen: boolean;
  hydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    product: Product,
    color: string,
    addons?: ProductAddon[],
    qty?: number
  ) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  lineKey: (line: CartLine) => string;
};

const CartContext = createContext<CartContextValue | null>(null);

function keyOf(productId: string, color: string, addons: ProductAddon[] = []) {
  const extras = addons
    .map((a) => a.id)
    .sort()
    .join("+");
  return `${productId}::${color}::${extras}`;
}

const lineKeyOf = (l: CartLine) => keyOf(l.product.id, l.color, l.addons);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore the basket once on mount so a refresh does not lose it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Bags saved before add-ons existed carry a size and no addons
        const saved = JSON.parse(raw) as CartLine[];
        setLines(
          saved.map((l) => ({
            product: l.product,
            color: l.color ?? "",
            addons: l.addons ?? [],
            qty: l.qty,
          }))
        );
      }
    } catch {
      // corrupted or unavailable storage — start empty
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full or blocked — the basket still works for this session
    }
  }, [lines, hydrated]);

  const lineKey = useCallback(lineKeyOf, []);

  const addItem = useCallback(
    (product: Product, color: string, addons: ProductAddon[] = [], qty = 1) => {
      setLines((prev) => {
        const k = keyOf(product.id, color, addons);
        const existing = prev.find((l) => lineKeyOf(l) === k);
        if (existing) {
          return prev.map((l) =>
            lineKeyOf(l) === k ? { ...l, qty: l.qty + qty } : l
          );
        }
        return [...prev, { product, color, addons, qty }];
      });
      setIsOpen(true);
    },
    []
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (lineKeyOf(l) === key ? { ...l, qty } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKeyOf(l) !== key));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + unitPrice(l) * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      total: subtotal,
      isOpen,
      hydrated,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQty,
      removeItem,
      clearCart,
      lineKey,
    };
  }, [lines, isOpen, hydrated, addItem, updateQty, removeItem, clearCart, lineKey]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
