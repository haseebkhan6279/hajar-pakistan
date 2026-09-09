"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/currency/Price";
import { productPath } from "@/lib/paths";

export function CartDrawer() {
  const {
    lines,
    subtotal,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    lineKey,
    count,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <button
        type="button"
        aria-label="Close bag"
        className="absolute inset-0 bg-hj-ink/40"
        onClick={closeCart}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white">
        <header className="flex items-center justify-between border-b border-hj-border px-6 py-5">
          <div>
            <h2 className="font-display text-2xl text-hj-ink">Your bag</h2>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-hj-muted">
              {count} {count === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close bag"
            onClick={closeCart}
            className="text-2xl leading-none text-hj-muted transition-colors hover:text-hj-ink"
          >
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-2xl text-hj-ink">
              Your bag is empty
            </p>
            <p className="mt-2 text-sm text-hj-muted">
              Nothing has been added yet.
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-8 inline-flex h-12 items-center bg-hj-ink px-7 text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
            >
              Browse the collections
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-hj-border bg-hj-cream px-6 py-3.5">
              <p className="text-[11px] leading-relaxed text-hj-ink-soft">
                Most pieces are made to order — approximately 5–6 weeks within
                Pakistan.
              </p>
            </div>

            <ul className="flex-1 divide-y divide-hj-border overflow-y-auto px-6">
              {lines.map((line) => {
                const key = lineKey(line);
                return (
                  <li key={key} className="flex gap-4 py-5">
                    <Link
                      href={productPath(line.product.slug)}
                      onClick={closeCart}
                      className="relative h-28 w-20 shrink-0 overflow-hidden bg-hj-sand"
                    >
                      <Image
                        src={line.product.images[0]}
                        alt={line.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={productPath(line.product.slug)}
                        onClick={closeCart}
                        className="font-display text-lg leading-snug text-hj-ink hover:text-hj-gold-deep"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-hj-muted">
                        {[line.size, line.color].filter(Boolean).join(" · ")}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-hj-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(key, line.qty - 1)}
                            className="h-8 w-8 text-hj-muted transition-colors hover:text-hj-ink"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(key, line.qty + 1)}
                            className="h-8 w-8 text-hj-muted transition-colors hover:text-hj-ink"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-hj-ink">
                          <Price amount={line.product.price * line.qty} />
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="mt-2 self-start text-[10px] uppercase tracking-[0.14em] text-hj-muted transition-colors hover:text-hj-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-hj-border px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-hj-muted">
                  Subtotal
                </span>
                <span className="font-display text-2xl text-hj-ink">
                  <Price amount={subtotal} />
                </span>
              </div>
              <p className="mt-1 text-[11px] text-hj-muted">
                Delivery and payment confirmed by our team
              </p>
              <div className="mt-5 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex h-12 items-center justify-center bg-hj-ink text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex h-12 items-center justify-center border border-hj-border text-[11px] uppercase tracking-[0.18em] text-hj-ink-soft transition-colors hover:border-hj-gold-deep hover:text-hj-gold-deep"
                >
                  View bag
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
