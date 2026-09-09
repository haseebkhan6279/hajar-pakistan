"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/currency/Price";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatPrice } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

const PK_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

/** We ship worldwide; these are simply the most common destinations. */
const COUNTRIES = [
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Other",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000/api";

const field =
  "h-12 w-full border border-hj-border bg-white px-3.5 text-sm text-hj-ink transition-colors focus:border-hj-gold focus:outline-none";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, total, clearCart, hydrated } = useCart();
  const { converted, code } = useCurrency();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const isPakistan = country === "Pakistan";

  const trail = [
    { name: "Home", href: "/" },
    { name: "Bag", href: "/cart" },
    { name: "Checkout", href: "/checkout" },
  ];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      customer: {
        fullName: String(fd.get("fullName") ?? "").trim(),
        phone: String(fd.get("phone") ?? "").trim(),
        email: String(fd.get("email") ?? "").trim(),
        address: String(fd.get("address") ?? "").trim(),
        city: String(fd.get("city") ?? "").trim(),
        province: String(fd.get("province") ?? "").trim(),
        postalCode: String(fd.get("postalCode") ?? "").trim(),
        country:
          country === "Other"
            ? String(fd.get("countryOther") ?? "").trim()
            : country,
        notes: String(fd.get("notes") ?? "").trim(),
      },
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        slug: l.product.slug,
        price: l.product.price,
        qty: l.qty,
        size: l.size,
        color: l.color,
        image: l.product.images[0] ?? "",
      })),
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      const order = (await res.json()) as { orderNumber: string };
      clearCart();
      router.push(
        `/order/confirmation?order=${encodeURIComponent(order.orderNumber)}`
      );
    } catch {
      setError(
        "We could not place that order. Check your connection and try again, or message us on WhatsApp."
      );
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <Breadcrumbs trail={trail} />
        <div className="mt-12">
          <EmptyState
            title="Nothing to check out"
            description="Your bag is empty. Add a piece and come back."
            action={<ButtonLink href="/products">Browse the collections</ButtonLink>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <Breadcrumbs trail={trail} />

      <header className="mt-8">
        <p className="eyebrow">Order request</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-hj-ink">
          Checkout
        </h1>
        <div className="rule-gold mt-5 h-px w-24" />
      </header>

      <form
        onSubmit={onSubmit}
        className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]"
      >
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl text-hj-ink">
              Who is it for?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="eyebrow">Full name</span>
                <input name="fullName" required className={`${field} mt-2`} />
              </label>
              <label className="block">
                <span className="eyebrow">Phone</span>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="03xx xxxxxxx"
                  className={`${field} mt-2`}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Email (optional)</span>
                <input name="email" type="email" className={`${field} mt-2`} />
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-hj-ink">Where to?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="eyebrow">Address</span>
                <input
                  name="address"
                  required
                  placeholder="House, street, area"
                  className={`${field} mt-2`}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Country</span>
                <select
                  name="country"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`${field} mt-2`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              {country === "Other" && (
                <label className="block">
                  <span className="eyebrow">Which country?</span>
                  <input
                    name="countryOther"
                    required
                    className={`${field} mt-2`}
                  />
                </label>
              )}
              <label className="block">
                <span className="eyebrow">City</span>
                <input name="city" required className={`${field} mt-2`} />
              </label>
              <label className="block">
                <span className="eyebrow">
                  {isPakistan ? "Province" : "State / region"}
                </span>
                {isPakistan ? (
                  <select
                    name="province"
                    required
                    defaultValue="Punjab"
                    className={`${field} mt-2`}
                  >
                    {PK_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input name="province" required className={`${field} mt-2`} />
                )}
              </label>
              <label className="block">
                <span className="eyebrow">
                  Postal code {isPakistan ? "(optional)" : ""}
                </span>
                <input
                  name="postalCode"
                  required={!isPakistan}
                  className={`${field} mt-2`}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="eyebrow">Delivery notes (optional)</span>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Landmark, preferred delivery time, anything else"
                  className="mt-2 w-full border border-hj-border bg-white px-3.5 py-3 text-sm text-hj-ink transition-colors focus:border-hj-gold focus:outline-none"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-hj-ink">Payment</h2>
            <div className="mt-6 flex items-start gap-4 border border-hj-gold bg-hj-gold-wash p-5">
              <span className="mt-1 h-2 w-2 shrink-0 rotate-45 bg-hj-gold" />
              <div>
                <p className="text-sm text-hj-ink">
                  We will contact you to confirm and arrange payment
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-hj-muted">
                  No payment is taken on this page. Our team will be in touch
                  with the available payment options. Made-to-order pieces are
                  confirmed with a 50% advance, with the balance due before
                  dispatch; production begins once that advance is received.
                </p>
                <p className="mt-2.5 text-[13px] leading-relaxed text-hj-muted">
                  See the{" "}
                  <Link
                    href="/policies/payment"
                    className="text-hj-gold-deep underline underline-offset-2"
                  >
                    payment policy
                  </Link>{" "}
                  for full terms.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-hj-border bg-hj-cream p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl text-hj-ink">Your order</h2>
          <div className="rule-gold mt-3 h-px w-14" />

          <ul className="mt-6 space-y-4 border-b border-hj-border pb-6">
            {lines.map((l, i) => (
              <li key={`${l.product.id}-${i}`} className="flex gap-3.5">
                <div className="relative h-20 w-14 shrink-0 overflow-hidden bg-hj-sand">
                  <Image
                    src={l.product.images[0]}
                    alt={l.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-hj-ink">
                    {l.product.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-hj-muted">
                    {[l.size, l.color].filter(Boolean).join(" · ")} · ×{l.qty}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-hj-ink">
                  <Price amount={l.product.price * l.qty} />
                </span>
              </li>
            ))}
          </ul>

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
            {!isPakistan && (
              <p className="text-[12px] leading-relaxed text-hj-muted">
                Customs duties, import taxes and clearance fees in the
                destination country are the customer&apos;s responsibility.
              </p>
            )}
            <div className="flex justify-between border-t border-hj-border pt-3">
              <dt className="text-hj-ink">Estimated total</dt>
              <dd className="font-display text-2xl text-hj-ink">
                <Price amount={total} />
              </dd>
            </div>
          </dl>

          {/*
            The basket converts for readability, but the order is raised in
            rupees and that is the figure the team will quote. Saying so here,
            against the total, is the last point at which it can be misread.
          */}
          {converted && (
            <p className="mt-4 border-t border-hj-border pt-4 text-[12px] leading-relaxed text-hj-muted">
              {code} figures are indicative, converted at today&apos;s rate.
              Your order is placed and settled in{" "}
              <span className="text-hj-ink">{formatPrice(total)}</span>.
            </p>
          )}

          {error && (
            <p className="mt-5 border border-hj-danger/30 bg-hj-danger/5 px-4 py-3 text-[13px] leading-relaxed text-hj-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 flex h-14 w-full items-center justify-center bg-hj-ink text-xs uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink disabled:opacity-50"
          >
            {submitting ? "Sending request…" : "Place order request"}
          </button>

          <Link
            href="/cart"
            className="mt-4 block text-center text-[11px] uppercase tracking-[0.14em] text-hj-muted hover:text-hj-gold-deep"
          >
            Back to bag
          </Link>
        </aside>
      </form>
    </div>
  );
}
