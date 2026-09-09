"use client";

import { useState, type FormEvent } from "react";

/**
 * The signup form alone — the footer supplies the label and standfirst around
 * it, so the two read as one block rather than a form with its own heading
 * stacked inside another heading.
 */
export function Newsletter() {
  const [done, setDone] = useState(false);

  /**
   * No mailing-list provider is wired up yet — the address is held locally so
   * the form is honest about what it does rather than pretending to subscribe.
   */
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    try {
      localStorage.setItem("hj-newsletter", email);
    } catch {
      // storage blocked — nothing to keep
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="mt-5 border-t border-hj-border pt-5 text-sm text-hj-gold-deep">
        Thank you — we will be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex gap-2.5">
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="h-12 w-full border border-hj-border bg-white px-3.5 text-sm text-hj-ink placeholder:text-hj-muted transition-colors focus:border-hj-gold focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="h-12 shrink-0 bg-hj-ink px-7 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
      >
        Subscribe
      </button>
    </form>
  );
}
