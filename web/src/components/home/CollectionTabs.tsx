"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuickAdd } from "@/components/QuickAdd";
import { Price } from "@/components/currency/Price";
import { savePercent, type Product } from "@/lib/data";
import { productPath } from "@/lib/paths";
import { cn } from "@/lib/clsx";

export type CollectionTab = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  href: string;
  products: Product[];
  total: number;
};

/**
 * The edit, split by collection.
 *
 * One mixed rail said nothing about where a piece came from. Tabbing by
 * collection is self-explanatory, and lets someone reach ZOUQ 1, ZOUQ 2 or the
 * couture line without leaving the home page. It stays a rail rather than a
 * grid — the catalogue already has a 4-up grid, and repeating it here reads as
 * filler and runs very tall.
 */
export function CollectionTabs({ tabs }: { tabs: CollectionTab[] }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function sync() {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    // The scroll box rounds, so the end is never exactly equal
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  // The panel is remounted on every switch, so re-measure once it lands
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [active]);

  function nudge(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    // Move by roughly one card so the snap lands cleanly
    const card = el.querySelector("li");
    const step = card ? card.clientWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  /** Left/right arrows move between tabs, as expected of a tablist. */
  function onTabKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  if (tabs.length === 0) return null;
  const current = tabs[active];

  const arrow =
    "flex h-10 w-10 items-center justify-center border border-hj-border bg-white text-hj-ink-soft transition-colors hover:border-hj-ink disabled:cursor-not-allowed disabled:border-hj-border disabled:bg-transparent disabled:text-hj-border-strong";

  return (
    <div>
      {/* ------------------------------------------------------ Section head */}
      <header className="mx-auto max-w-2xl px-4 text-center">
        <p className="eyebrow">Hajar</p>
        <h2 className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] uppercase tracking-[0.16em] text-hj-ink">
          Shop the collections
        </h2>
        <div className="rule-gold mx-auto mt-4 h-px w-20" />
      </header>

      {/* ------------------------------------------------------------- Tabs */}
      <div
        role="tablist"
        aria-label="Collections"
        className="mx-auto mt-9 flex max-w-[1500px] flex-wrap items-end justify-center gap-x-9 gap-y-3 border-b border-hj-border px-4 md:gap-x-14 md:px-8"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.slug}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.slug}`}
            aria-selected={i === active}
            aria-controls={`panel-${tab.slug}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={cn(
              "relative -mb-px whitespace-nowrap pb-3.5 text-[11px] uppercase tracking-[0.18em] transition-colors md:text-[12px]",
              i === active ? "text-hj-ink" : "text-hj-muted hover:text-hj-ink"
            )}
          >
            {tab.name}
            <sup className="ml-1.5 text-[9px] tracking-normal text-hj-muted/70">
              {tab.total}
            </sup>
            {i === active && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-hj-gold" />
            )}
          </button>
        ))}
      </div>

      {/* ------------------------- Context for the tab, and the rail controls */}
      <div className="mx-auto mt-6 flex max-w-[1500px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 md:px-8">
        <p
          key={current.slug}
          className="animate-fade max-w-xl text-[15px] leading-relaxed text-hj-muted"
        >
          <span className="font-display text-lg italic text-hj-gold-deep">
            {current.tagline}
          </span>{" "}
          {current.blurb}
        </p>

        <div className="flex items-center gap-4">
          <Link
            href={current.href}
            className="tap-target text-[11px] uppercase tracking-[0.16em] text-hj-gold-deep transition-colors hover:text-hj-ink"
          >
            View all {current.total} &rarr;
          </Link>
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Scroll left"
              className={arrow}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Scroll right"
              className={arrow}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- Panel */}
      {/*
        Keyed on the collection: React remounts the rail on a switch, which
        resets the scroll position and replays the fade in one step.
      */}
      <ul
        key={current.slug}
        ref={scroller}
        onScroll={sync}
        role="tabpanel"
        id={`panel-${current.slug}`}
        aria-labelledby={`tab-${current.slug}`}
        className="scrollbar-none animate-fade mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:gap-5 md:px-8"
      >
        {current.products.map((product) => {
          const save = savePercent(product.price, product.compareAtPrice);
          const soldOut = product.stock === 0;
          const href = productPath(product.slug);

          return (
            <li
              key={product.id}
              className="group w-[240px] shrink-0 snap-start sm:w-[270px] lg:w-[300px]"
            >
              {/* The bag button is a sibling of the link, never nested inside it */}
              <div className="relative overflow-hidden bg-hj-sand">
                <Link href={href} tabIndex={-1} aria-hidden className="block">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 240px, 300px"
                      className="card-img object-cover object-top"
                    />
                    {product.images[1] && (
                      <Image
                        src={product.images[1]}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 240px, 300px"
                        className="object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                  </div>
                </Link>

                {product.madeToMeasure && (
                  <span className="absolute left-3 top-3 z-10 bg-hj-ink px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-hj-gold-soft">
                    Made to measure
                  </span>
                )}
                {save !== null && !soldOut && !product.madeToMeasure && (
                  <span className="absolute left-3 top-3 z-10 bg-hj-gold px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-hj-ink">
                    &minus;{save}%
                  </span>
                )}

                {soldOut ? (
                  <span className="absolute inset-x-0 bottom-0 z-10 bg-white/92 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-hj-ink-soft">
                    Sold out
                  </span>
                ) : (
                  <QuickAdd product={product} />
                )}
              </div>

              <Link href={href} className="mt-4 block">
                <h3 className="font-display text-xl leading-snug text-hj-ink transition-colors group-hover:text-hj-gold-deep">
                  {product.name}
                </h3>
                <p className="mt-1 flex items-baseline gap-2 text-sm">
                  <span
                    className={cn(
                      save !== null ? "text-hj-danger" : "text-hj-ink-soft"
                    )}
                  >
                    <Price amount={product.price} />
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-hj-muted line-through">
                      <Price amount={product.compareAtPrice} />
                    </span>
                  )}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
