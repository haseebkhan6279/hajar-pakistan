"use client";

import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/data";

/**
 * The bag button that sits over a product image in the grid.
 * Adds the first size / colourway; the PDP is where real choices are made.
 */
export function QuickAdd({ product }: { product: Product }) {
  const { addItem } = useCart();

  if (product.stock === 0) return null;

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to bag`}
      onClick={() =>
        addItem(
          product,
          product.sizes[0] ??
            (product.madeToMeasure ? "Made to measure" : "One size"),
          product.colors[0]?.name ?? "",
          1
        )
      }
      className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center bg-hj-ink text-hj-gold-soft opacity-0 transition-all duration-300 hover:bg-hj-gold hover:text-hj-ink focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M3.6 6.4h12.8L15.4 17H4.6L3.6 6.4Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M7.4 6.4a2.6 2.6 0 0 1 5.2 0"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
