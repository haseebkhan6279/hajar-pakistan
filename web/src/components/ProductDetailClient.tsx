"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, savePercent, SIZE_GUIDE, type Product } from "@/lib/data";
import { cn } from "@/lib/clsx";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(
    product.sizes[0] ?? (product.madeToMeasure ? "Made to measure" : "One size")
  );
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [openPanel, setOpenPanel] = useState<string | null>("details");

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
    // A made-to-measure piece has no standard sizes, so the chart is noise
    ...(product.madeToMeasure ? [] : [{
      id: "size",
      title: "Size guide",
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-hj-border text-[10px] uppercase tracking-[0.14em] text-hj-muted">
                <th className="py-2.5 font-medium">Size</th>
                <th className="py-2.5 font-medium">Bust</th>
                <th className="py-2.5 font-medium">Waist</th>
                <th className="py-2.5 font-medium">Hip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hj-border text-hj-ink-soft">
              {SIZE_GUIDE.map((r) => (
                <tr key={r.size}>
                  <td className="py-2.5">{r.size}</td>
                  <td className="py-2.5">{r.bust}</td>
                  <td className="py-2.5">{r.waist}</td>
                  <td className="py-2.5">{r.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs leading-relaxed text-hj-muted">
            Measurements are body measurements, not garment measurements. For
            made-to-order pieces we fit to your own measurements — get in touch
            on WhatsApp.
          </p>
        </div>
      ),
    }]),
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
              Ready-to-wear size exchanges: contact us within 48 hours of
              delivery, unworn and with tags intact.
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
      <div>
        <div className="relative aspect-[3/4] overflow-hidden bg-hj-sand">
          <Image
            src={product.images[active]}
            alt={`${product.name} — view ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
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
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
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
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <>
              <span className="text-base text-hj-muted line-through">
                {formatPrice(product.compareAtPrice)}
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

        {/* Size — or a made-to-measure note where there is no size list */}
        {product.madeToMeasure ? (
          <div className="mt-7 border border-hj-gold bg-hj-gold-wash p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-hj-gold-deep">
              Made to measure
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-hj-ink-soft">
              This piece is cut to your own measurements — there are no standard
              sizes. Our team will take you through measurements after your
              order is confirmed, or you can book a fitting at the atelier.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
            >
              Book a fitting →
            </Link>
          </div>
        ) : (
          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Size
              </p>
              <button
                type="button"
                onClick={() => setOpenPanel("size")}
                className="text-[10px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
              >
                Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-11 min-w-[56px] border px-4 text-xs uppercase tracking-[0.12em] transition-colors",
                    size === s
                      ? "border-hj-ink bg-hj-ink text-hj-gold-soft"
                      : "border-hj-border text-hj-ink-soft hover:border-hj-ink"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
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
            onClick={() => addItem(product, size, color, qty)}
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
          className="mt-2 inline-block text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
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
