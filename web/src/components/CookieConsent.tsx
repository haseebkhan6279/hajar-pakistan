"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "hj-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(KEY));
    } catch {
      setVisible(false);
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    setVisible(false);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // storage blocked — respect the choice for this session only
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg border border-hj-border bg-white p-5 shadow-[0_16px_48px_rgb(18_16_12/0.12)]">
      <p className="text-sm leading-relaxed text-hj-ink-soft">
        We use a small number of cookies to remember your basket and understand
        how the site is used. Read our{" "}
        <Link href="/privacy" className="text-hj-gold-deep underline">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="h-10 flex-1 bg-hj-ink text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("declined")}
          className="h-10 flex-1 border border-hj-border text-[11px] uppercase tracking-[0.16em] text-hj-ink-soft transition-colors hover:border-hj-border-strong"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
