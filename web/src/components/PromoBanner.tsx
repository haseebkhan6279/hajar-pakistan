"use client";

import { useEffect, useState } from "react";

const KEY = "hj-promo-dismissed";

export function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-hj-ink px-10 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] text-hj-gold-soft">
        Made to order in Lahore · Worldwide shipping · 50% advance to begin
        production
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setVisible(false);
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            // non-persistent dismissal is fine
          }
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-hj-gold-soft/70 transition-colors hover:text-hj-gold-soft"
      >
        ×
      </button>
    </div>
  );
}
