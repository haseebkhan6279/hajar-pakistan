"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="font-display text-4xl leading-tight text-hj-ink">
        Something went wrong.
      </h1>
      <div className="rule-gold mx-auto mt-6 h-px w-20" />
      <p className="mt-6 text-sm leading-relaxed text-hj-muted">
        The page could not be loaded. Try again — if it keeps happening, message
        us and we will sort it out.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-9 inline-flex h-12 items-center bg-hj-ink px-7 text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
      >
        Try again
      </button>
    </div>
  );
}
