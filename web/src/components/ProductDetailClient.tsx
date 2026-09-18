"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/currency/Price";
import { addonsFor, savePercent, type Product } from "@/lib/data";
import { catalogImageProps } from "@/lib/catalog";
import { cn } from "@/lib/clsx";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [openPanel, setOpenPanel] = useState<string | null>("details");

  const addons = addonsFor(product.categorySlug, product.slug);
  const [picked, setPicked] = useState<string[]>(
    addons.filter((a) => a.defaultOn).map((a) => a.id)
  );
  const chosen = addons.filter((a) => picked.includes(a.id));
  const unit = product.price + chosen.reduce((sum, a) => sum + a.price, 0);

  function toggleAddon(id: string) {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const save = savePercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;
  const specRows = Object.entries(product.specs);

  // Descriptions arrive as blank-line separated paragraphs
  const paragraphs = product.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const panels = [
    {
      id: "details",
      title: "Details & fabric",
      content: (
        <div className="space-y-4">
          {product.fabric && (
            <p className="text-sm leading-relaxed text-hj-ink-soft">
              {product.fabric}
            </p>
          )}
          {specRows.length > 0 && (
            <dl className="divide-y divide-hj-border border-y border-hj-border">
              {specRows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-hj-muted">
                    {k}
                  </dt>
                  <dd className="text-right text-sm text-hj-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="font-mono text-[11px] text-hj-muted">
            SKU {product.sku}
          </p>
        </div>
      ),
    },
    {
      id: "delivery",
      title: "Delivery & returns",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-hj-ink-soft">
          <ul className="space-y-2.5">
            <li>
              Made to order — approximately 5–6 weeks within Pakistan, 6–7 weeks
              internationally, from order confirmation.
            </li>
            <li>
              Ready-to-wear pieces may be dispatched sooner; we confirm the
              timeframe when you order.
            </li>
            <li>
              Made-to-order and customized pieces cannot be returned, exchanged
              or refunded once confirmed.
            </li>
          </ul>
          <p className="text-[13px]">
            Full terms:{" "}
            <Link
              href="/policies/shipping-delivery"
              className="text-hj-gold-deep underline underline-offset-2"
            >
              Shipping &amp; delivery
            </Link>{" "}
            ·{" "}
            <Link
              href="/policies/returns-exchange"
              className="text-hj-gold-deep underline underline-offset-2"
            >
              Returns &amp; exchange
            </Link>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      {/* min-w-0: a grid item defaults to min-width:auto, so without this the
          thumbnail rail below sets the column to its min-content width and the
          whole page scrolls sideways instead of the rail scrolling. */}
      <div className="min-w-0">
        <div className="relative overflow-hidden bg-hj-sand">
          <Image
            src={product.images[active]}
            alt={`${product.name} — view ${active + 1}`}
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-auto w-full"
            {...catalogImageProps(product.images[active])}
          />
          {product.badge && (
            <span className="absolute left-4 top-4 bg-hj-ink px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-hj-gold-soft">
              {product.badge}
            </span>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="scrollbar-none mt-3 flex gap-3 overflow-x-auto">
            {product.images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-hj-sand transition-opacity",
                  i === active
                    ? "ring-1 ring-hj-gold"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                  {...catalogImageProps(src)}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buy column */}
      <div className="lg:pt-4">
        <p className="eyebrow">{product.category}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-hj-ink md:text-5xl">
          {product.name}
        </h1>

        <div className="mt-5 flex flex-wrap items-baseline gap-3">
          <span
            className={cn(
              "text-2xl",
              save !== null ? "text-hj-danger" : "text-hj-ink"
            )}
          >
            <Price amount={product.price} />
          </span>
          {product.compareAtPrice && (
            <>
              <span className="text-base text-hj-muted line-through">
                <Price amount={product.compareAtPrice} />
              </span>
              <span className="bg-hj-gold-wash px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-hj-gold-deep">
                Save {save}%
              </span>
            </>
          )}
        </div>

        {product.pieces && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-hj-muted">
            {product.pieces}
          </p>
        )}

        {paragraphs.length > 0 && (
          <div className="mt-6 max-w-prose space-y-3.5">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={cn(
                  "text-sm leading-relaxed",
                  // The opening line is the house line for the piece
                  i === 0 && paragraphs.length > 1
                    ? "italic text-hj-gold-deep"
                    : "text-hj-ink-soft"
                )}
              >
                {para}
              </p>
            ))}
          </div>
        )}

        {product.highlights.length > 0 && (
          <ul className="mt-6 space-y-2">
            {product.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 text-sm leading-relaxed text-hj-ink-soft"
              >
                <span
                  aria-hidden
                  className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-hj-gold"
                />
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* Colour */}
        {product.colors.length > 1 && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
              Colour · <span className="text-hj-ink-soft">{color}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "h-9 w-9 rounded-full border transition-all",
                    color === c.name
                      ? "border-hj-gold ring-1 ring-hj-gold ring-offset-2"
                      : "border-hj-border hover:border-hj-border-strong"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add-ons — extras that change the price */}
        {addons.length > 0 && (
          <fieldset className="mt-7">
            <legend className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
              Options
            </legend>
            <div className="mt-3 divide-y divide-hj-border border-y border-hj-border">
              {addons.map((a) => {
                const on = picked.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className="flex min-h-12 cursor-pointer items-center gap-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleAddon(a.id)}
                      className="h-4 w-4 shrink-0 accent-hj-gold-deep"
                    />
                    <span className="flex-1 text-sm text-hj-ink-soft">
                      {a.label}
                    </span>
                    <span className="text-[13px] text-hj-muted">
                      {a.price > 0 ? (
                        <>
                          + <Price amount={a.price} />
                        </>
                      ) : (
                        "Included in price"
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            {unit !== product.price && (
              <p className="mt-3 flex items-baseline justify-between text-sm">
                <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Total
                </span>
                <span className="text-lg text-hj-ink">
                  <Price amount={unit * qty} />
                </span>
              </p>
            )}
          </fieldset>
        )}

        {/* Quantity + add */}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex h-14 items-center border border-hj-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              className="h-full w-12 text-hj-muted transition-colors hover:text-hj-ink"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((n) => n + 1)}
              className="h-full w-12 text-hj-muted transition-colors hover:text-hj-ink"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={soldOut}
            onClick={() => addItem(product, color, chosen, qty)}
            className="h-14 flex-1 bg-hj-ink px-8 text-xs uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink disabled:cursor-not-allowed disabled:bg-hj-sand-2 disabled:text-hj-muted"
          >
            {soldOut ? "Sold out" : "Add to bag"}
          </button>
        </div>

        <p className="mt-4 text-[11px] text-hj-muted">
          {soldOut
            ? "Enquire on WhatsApp about a made-to-order piece."
            : product.stock <= 3
              ? `Only ${product.stock} left in this colourway.`
              : "Made to order · approximately 5–6 weeks within Pakistan."}
        </p>

        <Link
          href="/contact"
          className="tap-target mt-2 inline-block text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
        >
          Ask about this piece →
        </Link>

        {/* Accordions */}
        <div className="mt-10 border-t border-hj-border">
          {panels.map((panel) => {
            const open = openPanel === panel.id;
            return (
              <div key={panel.id} className="border-b border-hj-border">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenPanel(open ? null : panel.id)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-[11px] uppercase tracking-[0.16em] text-hj-ink">
                    {panel.title}
                  </span>
                  <span className="text-lg leading-none text-hj-muted">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open && <div className="pb-6">{panel.content}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
