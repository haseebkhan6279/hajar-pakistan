/** Combining diacritical marks, stripped after an NFD normalise. */
const DIACRITICS = /[̀-ͯ]/g;

/**
 * URL-safe kebab slug for products and categories.
 * Accents are folded rather than dropped, so "Lilac Éclat" becomes
 * "lilac-eclat" and not "lilac-clat". Must stay in step with
 * web/src/lib/paths.ts.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/['‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
