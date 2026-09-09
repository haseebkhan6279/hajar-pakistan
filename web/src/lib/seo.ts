import type { Metadata } from "next";
import type { Category, Product } from "./data";
import { productPath } from "./paths";

export const SITE = {
  name: "HAJAR",
  legalName: "Hajar by Nazish Ali",
  tagline: "Hand-embellished Pakistani formals",
  description:
    "HAJAR is a Pakistani formal-wear house founded by designer Nazish Ali — two expressions of one vision. HAJAR for refined, accessible modern formals; HAJAR BY NAZISH ALI for the hand-embellished signature line. Crafted in Pakistan, created for today.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(
    /\/$/,
    ""
  ),
  locale: "en_PK",
  currency: "PKR",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "923288883222",
  whatsappDisplay: "+92 328 8883222",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hajarpakistan@gmail.com",
  instagramHandle: "@hajarbynazishali",
  city: "Lahore",
  country: "Pakistan",
  social: {
    instagram: "https://instagram.com/hajarbynazishali",
    facebook: "https://facebook.com/hajarbynazishali",
  },
};

export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} — ${SITE.tagline}`,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.name,
    keywords: [
      "Pakistani couture",
      "hand embellished formals",
      "bridal Pakistan",
      "ZOUQ",
      "Nazish Ali",
      "luxury pret Lahore",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url: SITE.url,
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function productMetadata(product: Product): Metadata {
  const title = product.seoTitle || `${product.name} — ${product.category}`;
  const description =
    product.seoDescription ||
    product.description.slice(0, 155) ||
    `${product.name} from the ${product.category} collection by ${SITE.name}.`;

  return {
    title,
    description,
    alternates: { canonical: productPath(product.slug) },
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(productPath(product.slug)),
      images: product.images.slice(0, 3).map((url) => ({ url })),
    },
  };
}

/* ---------------------------------------------------------------- JSON-LD */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: "PK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.email,
      telephone: `+${SITE.whatsapp}`,
      areaServed: "PK",
      availableLanguage: ["en", "ur"],
    },
    founder: { "@id": SITE.url + "/#designer" },
    sameAs: [SITE.social.instagram, SITE.social.facebook],
  };
}

/**
 * Nazish Ali as a Person, for /designer.
 *
 * Kept as its own node rather than inlined into the Organization so the two
 * can reference each other: the house names her as founder, she names the
 * house as her employer, and search engines resolve them to one entity
 * instead of two unrelated mentions of the same name.
 */
export function designerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": SITE.url + "/#designer",
    name: "Nazish Ali",
    jobTitle: "Founder & Creative Director",
    description:
      "Founder and creative force behind HAJAR and HAJAR BY NAZISH ALI, reinterpreting Pakistani craftsmanship for the modern woman.",
    url: absoluteUrl("/designer"),
    worksFor: { "@id": SITE.url + "/#organization" },
    knowsAbout: [
      "Pakistani formal wear",
      "Hand embellishment",
      "Couture design",
    ],
    sameAs: [SITE.social.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    sku: product.sku,
    brand: { "@type": "Brand", name: SITE.name },
    category: product.category,
    image: product.images,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productPath(product.slug)),
      priceCurrency: SITE.currency,
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE.url}/#organization` },
    },
  };
}

export function collectionSchema(category: Category, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.tagline || `${category.name} by ${SITE.name}`,
    url: absoluteUrl(`/category/${category.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(productPath(p.slug)),
        name: p.name,
      })),
    },
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`),
  };
}
