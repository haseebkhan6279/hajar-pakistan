/** Single source of truth for brand-level API defaults. */
export const BRAND_NAME = 'HAJAR';
export const ORDER_PREFIX = 'HJ';
export const UPLOAD_FOLDER = 'hajar/products';

/**
 * Extras a customer can tick on a product, by id, with the PKR amount each
 * adds to the unit price. The order total is worked out from this table rather
 * than the figure the browser sends. Mirrors COLLECTION_ADDONS in
 * web/src/lib/data.ts.
 */
export const ADDONS: Record<string, { label: string; price: number }> = {
  dupatta: { label: 'Add Dupatta', price: 0 },
  sleeves: { label: 'Add Sleeves', price: 10000 },
};

/**
 * Two houses. HAJAR carries the ZOUQ 1 and ZOUQ 2 lines; HAJAR BY NAZISH ALI
 * is the couture line and stands alone. Products are filed against a leaf —
 * ZOUQ 1, ZOUQ 2 or HAJAR BY NAZISH ALI — never against the HAJAR parent.
 */
export const DEFAULT_CATEGORIES = [
  {
    name: 'HAJAR',
    slug: 'hajar',
    tagline: 'Modern formals, made more accessible.',
    parentSlug: '',
    sortOrder: 1,
  },
  {
    name: 'ZOUQ 1',
    slug: 'zouq-1',
    tagline: 'The founding edit.',
    parentSlug: 'hajar',
    sortOrder: 2,
  },
  {
    name: 'ZOUQ 2',
    slug: 'zouq-2',
    tagline: 'The second edit.',
    parentSlug: 'hajar',
    sortOrder: 3,
  },
  {
    name: 'HAJAR BY NAZISH ALI',
    slug: 'hajar-by-nazish-ali',
    tagline: 'Where craftsmanship becomes couture.',
    parentSlug: '',
    sortOrder: 4,
  },
] as const;
