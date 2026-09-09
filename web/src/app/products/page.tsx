import { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { filterProducts, getProducts, sortProducts } from "@/lib/catalog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "All pieces",
  description:
    "Every piece currently available from HAJAR — hand-embellished formals, festive wear and made-to-order couture across ZOUQ 1, ZOUQ 2 and BY NAZISH ALI.",
  path: "/products",
});

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sort?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category, sort } = await searchParams;
  const all = await getProducts();
  const products = sortProducts(filterProducts(all, { q, category }), sort);

  const trail = [
    { name: "Home", href: "/" },
    { name: "All pieces", href: "/products" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs trail={trail} />

      <header className="mx-auto mt-10 max-w-2xl text-center">
        <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] uppercase tracking-[0.16em] text-hj-ink">
          Shop
        </h1>
        <p className="mt-3 text-[15px] text-hj-muted">
          Discover our ready to wear and made-to-order lines.
        </p>
        {q && (
          <p className="mt-4 text-sm text-hj-muted">
            Showing results for{" "}
            <span className="text-hj-ink">&ldquo;{q}&rdquo;</span>
          </p>
        )}
      </header>

      <div className="mt-8">
        <Suspense
          fallback={<div className="h-[76px] border-y border-hj-border" />}
        >
          <CatalogFilters total={products.length} />
        </Suspense>
      </div>

      <div className="mt-12">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            title="Nothing matched"
            description={
              all.length === 0
                ? "The catalogue is still being prepared. Check back shortly, or message us on WhatsApp about a made-to-order piece."
                : "Try a different search or clear the filters to see everything."
            }
            action={
              <ButtonLink href="/products" variant="outline">
                Clear filters
              </ButtonLink>
            }
          />
        )}
      </div>
    </div>
  );
}
