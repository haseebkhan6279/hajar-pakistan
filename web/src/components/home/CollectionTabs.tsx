import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/data";

export type CollectionTab = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  href: string;
  products: Product[];
  total: number;
};

export function CollectionTabs({ tabs }: { tabs: CollectionTab[] }) {
  if (tabs.length === 0) return null;

  return (
    <div className="space-y-20 md:space-y-28">
      {tabs.map((tab) => (
        <section key={tab.slug}>
          <header className="mb-10 text-center md:mb-14">
            <Link
              href={tab.href}
              className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-light uppercase tracking-[0.28em] text-hj-ink"
            >
              {tab.name}
            </Link>
            {tab.tagline && (
              <p className="mt-3 font-display text-[clamp(1rem,1.6vw,1.2rem)] italic text-hj-gold-deep">
                {tab.tagline}
              </p>
            )}
          </header>
          <div className="mx-auto max-w-[1600px] px-3 md:px-8">
            <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
              {tab.products.slice(0, 4).map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 2}
                />
              ))}
            </div>
            {tab.total > 4 && (
              <div className="mt-10 text-center">
                <Link
                  href={tab.href}
                  className="text-[11px] uppercase tracking-[0.22em] text-hj-ink/70 transition-colors hover:text-hj-ink"
                >
                  View all
                </Link>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
