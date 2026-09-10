import type { Category, Product, ProductColor } from "./data";
import { collectionFamily, FALLBACK_PRODUCTS } from "./data";
import { slugifyPath } from "./paths";

/** Shape returned by the Nest catalog endpoints. */
export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: "draft" | "published";
  tags: string[];
  description: string;
  highlights: string[];
  sizes: string[];
  colors: ProductColor[];
  fabric: string;
  pieces: string;
  specifications: { key: string; value: string }[];
  images: string[];
  seoTitle: string;
  seoDescription: string;
  thumb?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000/api";

/**
 * Neutral stand-in so a piece without imagery never breaks a grid.
 *
 * Served from /public rather than a placeholder service. The previous one was
 * placehold.co, which answers with image/svg+xml — and next/image refuses SVG
 * unless dangerouslyAllowSVG is set, so every fallback image on the site came
 * back as 400 INVALID_IMAGE_OPTIMIZE_REQUEST and rendered as a broken icon.
 * A local JPEG also removes a third-party host from the render path.
 */
export const PLACEHOLDER_IMAGE = "/media/placeholder.jpg";

/**
 * Short display reference built from the slug. Cuts on a word boundary so it
 * never reads as a truncated word — "PEARL-HALTER", not "PEARL-HALTER-K".
 */
function skuCode(slug: string, max = 16): string {
  const parts = slug.split("-").filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    const next = out.length ? `${out.join("-")}-${part}` : part;
    if (next.length > max) break;
    out.push(part);
  }
  return (out.length ? out.join("-") : parts[0] ?? slug).toUpperCase();
}

export function mapCatalogProduct(p: CatalogProduct): Product {
  const specs: Record<string, string> = {};
  for (const row of p.specifications ?? []) {
    if (row.key) specs[row.key] = row.value;
  }

  const tags = (p.tags ?? []).map((t) => t.toLowerCase());
  let badge: Product["badge"];
  if (tags.includes("bridal")) badge = "Bridal";
  else if (tags.includes("limited")) badge = "Limited";
  else if (tags.includes("new")) badge = "New";

  const images =
    p.images?.length > 0
      ? p.images
      : p.thumb
        ? [p.thumb]
        : [PLACEHOLDER_IMAGE];

  const slug = slugifyPath(p.slug || p.name);

  return {
    id: p.id,
    slug,
    name: p.name,
    brand: p.brand || "HAJAR",
    category: p.category,
    categorySlug: slugifyPath(p.category),
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    badge,
    colors:
      p.colors?.length > 0
        ? p.colors
        : [{ name: "As pictured", hex: "#EFE7D8" }],
    // No size list means the piece is cut to the customer's measurements
    sizes: p.sizes ?? [],
    madeToMeasure: !(p.sizes?.length > 0),
    images,
    description: p.description || "",
    highlights: p.highlights ?? [],
    fabric: p.fabric ?? "",
    pieces: p.pieces ?? "",
    specs,
    sku: `HJ-${skuCode(slug)}`,
    seoTitle: p.seoTitle || undefined,
    seoDescription: p.seoDescription || undefined,
  };
}

async function fetchJson<T>(
  path: string
): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { ok: false };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false };
  }
}

/** Published products, falling back to the static catalogue if the API is down. */
export async function getProducts(): Promise<Product[]> {
  const remote = await fetchJson<CatalogProduct[]>("/catalog/products");
  if (remote.ok) return remote.data.map(mapCatalogProduct);
  return FALLBACK_PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const normalized = slugifyPath(decodeURIComponent(slug));
  const remote = await fetchJson<CatalogProduct>(
    `/catalog/products/by-slug/${encodeURIComponent(normalized)}`
  );
  if (remote.ok) return mapCatalogProduct(remote.data);

  // Fall back to the full list in case slug encoding differs
  const list = await fetchJson<CatalogProduct[]>("/catalog/products");
  if (list.ok) {
    const hit = list.data.find(
      (p) => slugifyPath(p.slug || p.name) === normalized
    );
    if (hit) return mapCatalogProduct(hit);
  }

  return FALLBACK_PRODUCTS.find((p) => p.slug === normalized) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  const remote = await fetchJson<Category[]>("/catalog/categories");
  if (remote.ok) return remote.data;
  return [];
}

/**
 * Products for a collection. A parent (HAJAR) has none of its own, so its
 * children's products are aggregated instead.
 */
export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const all = await getProducts();
  const family = collectionFamily(slugifyPath(categorySlug));
  return all.filter((p) => family.includes(p.categorySlug));
}

export async function getRelated(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts();
  const sameCollection = all.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  );
  if (sameCollection.length >= limit) return sameCollection.slice(0, limit);
  const others = all.filter(
    (p) =>
      p.id !== product.id && !sameCollection.some((s) => s.id === p.id)
  );
  return [...sameCollection, ...others].slice(0, limit);
}

/** Sorting shared by /products and /category/[slug]. */
export function sortProducts(list: Product[], sort?: string): Product[] {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "name":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return out;
  }
}

export function filterProducts(
  list: Product[],
  { q, category }: { q?: string; category?: string }
): Product[] {
  let out = list;
  if (category) {
    const family = collectionFamily(slugifyPath(category));
    out = out.filter((p) => family.includes(p.categorySlug));
  }
  if (q) {
    const needle = q.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
    );
  }
  return out;
}

/** A curated Instagram tile, as served by the API. */
export type InstagramPost = {
  id: string;
  image: string;
  /** Cloudinary URL of a reel; the tile loops it with image as the poster */
  video?: string;
  caption: string;
  postUrl: string;
};

/**
 * The Instagram grid. Curated in the dashboard rather than pulled from
 * Instagram — see the note on the API schema. An empty list hides the section,
 * so the storefront degrades quietly if the API is unreachable.
 */
export async function getInstagramPosts(limit = 12): Promise<InstagramPost[]> {
  const remote = await fetchJson<InstagramPost[]>(
    `/instagram/feed?limit=${limit}`
  );
  return remote.ok ? remote.data.filter((p) => Boolean(p.image)) : [];
}
