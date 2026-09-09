"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { CURRENCIES } from "@/lib/currency";
import { cn } from "@/lib/clsx";

/**
 * The display-currency control.
 *
 * Click to open rather than hover: the nav dropdowns above it open on hover
 * because passing over a nav item is a navigation intent, whereas passing over
 * the utilities on the way to the bag is not.
 */
export function CurrencySwitcher({ className }: { className?: string }) {
  const { code, setCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Display currency, ${code}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 px-1 text-[12px] tracking-[0.12em] text-hj-ink transition-colors hover:text-hj-gold-deep"
      >
        {code}
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={cn("transition-transform duration-200", open && "rotate-180")}
        >
          <path d="m1.5 3.5 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Display currency"
          className="absolute right-0 top-full z-50 mt-1 min-w-[218px] border border-hj-border bg-white py-1.5 shadow-[0_12px_32px_rgb(10_10_10/0.07)]"
        >
          {CURRENCIES.map((currency) => {
            const active = currency.code === code;
            return (
              <li key={currency.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setCode(currency.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-baseline gap-3 px-4 py-2 text-left transition-colors hover:bg-hj-cream",
                    active ? "text-hj-gold-deep" : "text-hj-ink"
                  )}
                >
                  <span className="w-9 shrink-0 text-[12px] tracking-[0.12em]">
                    {currency.code}
                  </span>
                  <span className="text-[12px] text-hj-muted">{currency.name}</span>
                </button>
              </li>
            );
          })}

          <li className="mt-1 border-t border-hj-border px-4 pb-1 pt-2.5">
            <p className="text-[11px] leading-snug text-hj-muted">
              Orders are placed and settled in PKR. Other currencies are
              indicative only.
            </p>
          </li>
        </ul>
      )}
    </div>
  );
}
