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
import type { Product } from "@/lib/data";

export type CartLine = {
  product: Product;
  size: string;
  color: string;
  qty: number;
};

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
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  lineKey: (line: CartLine) => string;
};

const CartContext = createContext<CartContextValue | null>(null);

function keyOf(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore the basket once on mount so a refresh does not lose it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
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

  const lineKey = useCallback(
    (line: CartLine) => keyOf(line.product.id, line.size, line.color),
    []
  );

  const addItem = useCallback(
    (product: Product, size: string, color: string, qty = 1) => {
      setLines((prev) => {
        const k = keyOf(product.id, size, color);
        const existing = prev.find(
          (l) => keyOf(l.product.id, l.size, l.color) === k
        );
        if (existing) {
          return prev.map((l) =>
            keyOf(l.product.id, l.size, l.color) === k
              ? { ...l, qty: l.qty + qty }
              : l
          );
        }
        return [...prev, { product, size, color, qty }];
      });
      setIsOpen(true);
    },
    []
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          keyOf(l.product.id, l.size, l.color) === key ? { ...l, qty } : l
        )
        .filter((l) => l.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((prev) =>
      prev.filter((l) => keyOf(l.product.id, l.size, l.color) !== key)
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
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
