import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getCategories,
  getProductsByCategory,
  sortProducts,
} from "@/lib/catalog";
import { COLLECTIONS, HOUSES, collectionBySlug } from "@/lib/data";
import { categoryPath } from "@/lib/paths";
import {
  breadcrumbSchema,
  collectionSchema,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ q?: string; sort?: string }>;

/**
 * Only real collections get a page. Params come from the API as well as the
 * local list, so a collection added in the dashboard still builds a route —
 * and with `dynamicParams` off, anything else is a genuine 404 rather than an
 * empty page returned with a 200.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const remote = await getCategories().catch(() => []);
  const slugs = new Set([
    ...COLLECTIONS.map((c) => c.slug),
    ...remote.map((c) => c.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const local = collectionBySlug(slug);
  const remote = (await getCategories()).find((c) => c.slug === slug);
  const name = local?.name ?? remote?.name;
  if (!name) return { title: "Collection not found" };

  return pageMetadata({
    title: name,
    description:
      local?.blurb ||
      remote?.tagline ||
      `Shop the ${name} collection from HAJAR — hand-embellished Pakistani formals made in Lahore.`,
    path: categoryPath(slug),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { q, sort } = await searchParams;

  const categories = await getCategories();
  const local = collectionBySlug(slug);
  const remote = categories.find((c) => c.slug === slug);
  if (!local && !remote) notFound();

  const name = local?.name ?? remote!.name;
  const tagline = local?.tagline ?? remote?.tagline ?? "";
  const blurb = local?.blurb ?? "";

  let products = await getProductsByCategory(slug);
  if (q) {
    const needle = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
    );
  }
  products = sortProducts(products, sort);

  const parent = local?.parentSlug
    ? collectionBySlug(local.parentSlug)
    : undefined;
  const houseSlug = parent?.slug ?? slug;
  const siblings = HOUSES.filter((h) => h.slug !== houseSlug);

  const trail = [
    { name: "Home", href: "/" },
    ...(parent ? [{ name: parent.name, href: categoryPath(parent.slug) }] : []),
    { name, href: categoryPath(slug) },
  ];

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          ...(remote ? [collectionSchema(remote, products)] : []),
        ]}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 md:py-16">
        <Breadcrumbs trail={trail} />

        <header className="mx-auto mt-10 max-w-3xl text-center">
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-light uppercase tracking-[0.28em] text-hj-ink">
            {name}
          </h1>
          {tagline && (
            <p className="mt-3 font-display text-[clamp(1rem,1.6vw,1.25rem)] italic text-hj-gold-deep">
              {tagline}
            </p>
          )}
          {blurb && (
            <p className="mt-4 text-[14px] leading-relaxed text-hj-muted">
              {blurb}
            </p>
          )}
        </header>

        <div className="mt-8">
          <Suspense
            fallback={<div className="h-[76px] border-y border-hj-border" />}
          >
            <CatalogFilters showCategory={false} total={products.length} />
          </Suspense>
        </div>

        <div className="mt-12">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              title="Nothing here yet"
              description={`Pieces for ${name} are still being photographed. In the meantime, browse the rest of the atelier.`}
              action={
                <ButtonLink href="/products" variant="outline">
                  See all pieces
                </ButtonLink>
              }
            />
          )}
        </div>

        {/* Sister collections */}
        <nav className="mt-24 border-t border-hj-border pt-10">
          <p className="eyebrow">Other collections</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {siblings.map((c) => (
              <ButtonLink
                key={c.slug}
                href={categoryPath(c.slug)}
                variant="ghost"
                size="lg"
                className="h-auto! justify-between py-4"
              >
                <span className="text-left">
                  <span className="block">{c.name}</span>
                  <span className="mt-1 block font-display text-[14px] normal-case tracking-normal italic text-hj-gold-deep">
                    {c.tagline}
                  </span>
                </span>
                <span aria-hidden>→</span>
              </ButtonLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
