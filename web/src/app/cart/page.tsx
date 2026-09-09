"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/currency/Price";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { productPath } from "@/lib/paths";

export default function CartPage() {
  const {
    lines,
    subtotal,
    total,
    updateQty,
    removeItem,
    lineKey,
    hydrated,
  } = useCart();

  const trail = [
    { name: "Home", href: "/" },
    { name: "Bag", href: "/cart" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <Breadcrumbs trail={trail} />

      <header className="mt-8">
        <h1 className="font-display text-5xl leading-tight text-hj-ink">
          Your bag
        </h1>
        <div className="rule-gold mt-5 h-px w-24" />
      </header>

      {!hydrated ? (
        <p className="mt-12 text-sm text-hj-muted">Loading your bag…</p>
      ) : lines.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Your bag is empty"
            description="Nothing has been added yet. Browse the three collections and start with a piece you would actually keep."
            action={
              <ButtonLink href="/products">Browse the collections</ButtonLink>
            }
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <ul className="divide-y divide-hj-border border-y border-hj-border">
            {lines.map((line) => {
              const key = lineKey(line);
              return (
                <li key={key} className="flex gap-5 py-6">
                  <Link
                    href={productPath(line.product.slug)}
                    className="relative h-40 w-28 shrink-0 overflow-hidden bg-hj-sand sm:h-48 sm:w-36"
                  >
                    <Image
                      src={line.product.images[0]}
                      alt={line.product.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="eyebrow">{line.product.category}</p>
                    <Link
                      href={productPath(line.product.slug)}
                      className="mt-1.5 font-display text-2xl leading-snug text-hj-ink hover:text-hj-gold-deep"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-hj-muted">
                      {[line.size, line.color].filter(Boolean).join(" · ")}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                      <div className="flex items-center border border-hj-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQty(key, line.qty - 1)}
                          className="h-11 w-11 text-hj-muted transition-colors hover:text-hj-ink"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQty(key, line.qty + 1)}
                          className="h-11 w-11 text-hj-muted transition-colors hover:text-hj-ink"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-base text-hj-ink">
                          <Price amount={line.product.price * line.qty} />
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="mt-1 text-[10px] uppercase tracking-[0.14em] text-hj-muted transition-colors hover:text-hj-danger"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit border border-hj-border bg-hj-cream p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl text-hj-ink">Summary</h2>
            <div className="rule-gold mt-3 h-px w-14" />

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-hj-muted">Subtotal</dt>
                <dd><Price amount={subtotal} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-hj-muted">Delivery</dt>
                <dd className="text-right text-[13px] text-hj-muted">
                  Confirmed on order
                </dd>
              </div>
              <div className="flex justify-between border-t border-hj-border pt-3 text-base">
                <dt className="text-hj-ink">Total</dt>
                <dd className="font-display text-2xl text-hj-ink">
                  <Price amount={total} />
                </dd>
              </div>
            </dl>

            <ButtonLink href="/checkout" size="lg" className="mt-7 w-full">
              Proceed to checkout
            </ButtonLink>
            <Link
              href="/products"
              className="mt-4 block text-center text-[11px] uppercase tracking-[0.14em] text-hj-muted hover:text-hj-gold-deep"
            >
              Continue shopping
            </Link>

            <p className="mt-6 border-t border-hj-border pt-5 text-[11px] leading-relaxed text-hj-muted">
              Placing an order sends us a request. Our team confirms it and arranges payment before anything is dispatched.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
