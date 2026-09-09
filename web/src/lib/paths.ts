/** Combining diacritical marks, stripped after an NFD normalise. */
const DIACRITICS = /[̀-ͯ]/g;

/**
 * URL-safe kebab slug for storefront paths.
 * Accents are folded rather than dropped, so "Rosé Lumière" becomes
 * "rose-lumiere" and not "ros-lumire". Must stay in step with
 * api/src/common/slug.ts.
 */
export function slugifyPath(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/['‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productPath(slug: string): string {
  const safe = slugifyPath(slug);
  return `/products/${encodeURIComponent(safe || slug)}`;
}

export function categoryPath(slug: string): string {
  return `/category/${encodeURIComponent(slugifyPath(slug))}`;
}
