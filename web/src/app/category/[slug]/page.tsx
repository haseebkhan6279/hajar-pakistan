import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getCategories,
  getProductsByCategory,
  PLACEHOLDER_IMAGE,
  sortProducts,
} from "@/lib/catalog";
import { childCollections, COLLECTIONS, collectionBySlug } from "@/lib/data";
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
  const blurb = local?.blurb ?? remote?.tagline ?? "";

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

  const cover = remote?.image || products[0]?.images[0] || PLACEHOLDER_IMAGE;

  // A house shows its edits as filters; an edit links back up to its house
  const children = childCollections(slug);
  const parent = local?.parentSlug
    ? collectionBySlug(local.parentSlug)
    : undefined;
  const siblings = COLLECTIONS.filter(
    (c) => c.slug !== slug && c.slug !== parent?.slug
  );

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

      {/* Collection hero — full bleed, type centred over the image */}
      <section className="relative h-[52vh] min-h-[380px] bg-hj-sand">
        <Image
          src={cover}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-hj-ink/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-hj-gold-soft">
            Collection
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4.25rem)] font-light uppercase leading-[0.98] tracking-[0.14em] text-white drop-shadow-[0_2px_18px_rgba(18,16,12,0.35)]">
            {name}
          </h1>
          {blurb && (
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80">
              {blurb}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <Breadcrumbs trail={trail} />

        {/* A house offers its edits as a sub-nav */}
        {children.length > 0 && (
          <nav className="mt-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center border border-hj-ink bg-hj-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-hj-gold-soft">
              All {name}
            </span>
            {children.map((child) => (
              <Link
                key={child.slug}
                href={categoryPath(child.slug)}
                className="inline-flex items-center border border-hj-border px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-hj-ink-soft transition-colors hover:border-hj-gold hover:text-hj-gold-deep"
              >
                {child.name}
              </Link>
            ))}
          </nav>
        )}

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
                className="justify-between"
              >
                <span>{c.name}</span>
                <span aria-hidden>→</span>
              </ButtonLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
