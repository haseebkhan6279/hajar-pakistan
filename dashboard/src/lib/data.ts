export type ProductStatus = "draft" | "published";

export type ProductColor = { name: string; hex: string };

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  thumb: string;
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
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  sortOrder: number;
  /** Slug of the parent collection; empty for a top-level house. */
  parentSlug: string;
  productCount: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  notes: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  image: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  paymentMethod: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};

/** Suit sizing offered across the catalogue. */
export const SIZE_PRESET = ["XS", "S", "M", "L", "XL", "XXL"];

export const PIECE_PRESET = [
  "1 Piece",
  "2 Piece",
  "3 Piece",
  "Unstitched",
  "Made to order",
];

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-PK").format(n);
}

export function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Combining diacritical marks, stripped after an NFD normalise. */
const DIACRITICS = /[̀-ͯ]/g;

/** Must stay in step with api/src/common/slug.ts. */
export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/['‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A curated tile in the storefront Instagram grid. */
export type AdminInstagramPost = {
  id: string;
  image: string;
  /** Cloudinary URL of a reel; empty for a still tile */
  video: string;
  caption: string;
  postUrl: string;
  sortOrder: number;
  published: boolean;
};

export type InquiryStatus = "new" | "read" | "replied" | "closed";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "new",
  "read",
  "replied",
  "closed",
];

export type AdminInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  source: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Digits only, with the leading 0 of a local Pakistani number swapped for the
 * country code — wa.me rejects anything else.
 */
export function whatsappHref(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const international = digits.startsWith("0")
    ? `92${digits.slice(1)}`
    : digits;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${international}${query}`;
}
