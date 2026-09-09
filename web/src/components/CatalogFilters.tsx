"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COLLECTIONS } from "@/lib/data";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "name", label: "Alphabetical" },
];

export function CatalogFilters({
  showCategory = true,
  total,
}: {
  showCategory?: boolean;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const current = params.get("q") ?? "";
    if (q === current) return;
    const t = setTimeout(() => update("q", q), 350);
    return () => clearTimeout(t);
    // `update` is stable enough for this debounce; re-running on params churns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const control =
    "h-11 border border-hj-border bg-white px-3 text-sm text-hj-ink transition-colors focus:border-hj-gold focus:outline-none";

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-hj-border py-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search pieces"
        aria-label="Search pieces"
        className={`${control} min-w-[200px] flex-1`}
      />

      {showCategory && (
        <select
          aria-label="Filter by collection"
          value={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className={control}
        >
          <option value="">All collections</option>
          {COLLECTIONS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.parentSlug ? `  ${c.name}` : c.name}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Sort"
        value={params.get("sort") ?? "newest"}
        onChange={(e) => update("sort", e.target.value)}
        className={control}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <p className="ml-auto text-[11px] uppercase tracking-[0.14em] text-hj-muted">
        {total} {total === 1 ? "piece" : "pieces"}
      </p>
    </div>
  );
}
