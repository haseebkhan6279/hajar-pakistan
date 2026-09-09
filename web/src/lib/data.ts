import { slugifyPath } from "./paths";

export type ProductColor = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  badge?: "New" | "Limited" | "Bridal";
  colors: ProductColor[];
  /** Empty when the piece is cut to the customer's own measurements */
  sizes: string[];
  madeToMeasure: boolean;
  images: string[];
  description: string;
  highlights: string[];
  fabric: string;
  pieces: string;
  specs: Record<string, string>;
  sku: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  sortOrder: number;
  productCount: number;
};

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  readTime: string;
  category: string;
};

export type Collection = {
  name: string;
  slug: string;
  tagline: string;
  blurb: string;
  /** Empty for a top-level house */
  parentSlug: string;
};

/**
 * Two houses. HAJAR carries the ZOUQ 1 and ZOUQ 2 edits; HAJAR BY NAZISH ALI is
 * the couture line and stands alone. Products are filed against a leaf, so the
 * HAJAR page aggregates its children. Mirrors api/src/common/brand.ts.
 */
export const COLLECTIONS: Collection[] = [
  {
    name: "HAJAR",
    slug: "hajar",
    tagline: "Modern formals, made more accessible.",
    blurb:
      "Beautifully designed formal wear at an approachable price point — refined cuts, beautiful fabrics and carefully considered details, across two edits.",
    parentSlug: "",
  },
  {
    name: "ZOUQ 1",
    slug: "zouq-1",
    tagline: "The founding edit.",
    blurb:
      "Where the house began — raw silk, velvet and organza, cut clean and worked by hand, for celebrations and intimate gatherings.",
    parentSlug: "hajar",
  },
  {
    name: "ZOUQ 2",
    slug: "zouq-2",
    tagline: "The second edit.",
    blurb:
      "Lighter, easier shapes for the long season of weddings, mehndis and dinners.",
    parentSlug: "hajar",
  },
  {
    name: "HAJAR BY NAZISH ALI",
    slug: "hajar-by-nazish-ali",
    tagline: "Where craftsmanship becomes couture.",
    blurb:
      "Our exclusive signature line — kora, dabka, beads, crystals, pearls, cut dana and threadwork, set by hand on luxurious fabrics.",
    parentSlug: "",
  },
];

/** Top-level houses, in nav order. */
export const HOUSES = COLLECTIONS.filter((c) => !c.parentSlug);

export function childCollections(slug: string) {
  return COLLECTIONS.filter((c) => c.parentSlug === slug);
}

/** Every collection whose products belong under `slug` — itself plus children. */
export function collectionFamily(slug: string): string[] {
  const children = childCollections(slug).map((c) => c.slug);
  return children.length ? children : [slug];
}

/**
 * The brand story, as written by the house.
 *
 * One source for the two places it is told: the short version on the home page
 * and the full version at /about. The wording is the client's — edit it here
 * rather than in the components, so the two never drift apart.
 */
export const BRAND_STORY = {
  eyebrow: "Our story",
  heading: "Two expressions.",
  headingItalic: "One vision.",
  lede: "Born from a love for Pakistani craftsmanship and modern femininity, HAJAR reimagines formal wear for the woman of today.",
  expressions: [
    {
      name: "HAJAR",
      slug: "hajar",
      tagline: "Modern formals, made more accessible.",
      body: "Refined, contemporary formals at an accessible price point — thoughtfully designed for celebrations and moments that deserve something special.",
    },
    {
      name: "HAJAR BY NAZISH ALI",
      slug: "hajar-by-nazish-ali",
      tagline: "Where craftsmanship becomes couture.",
      body: "Our exclusive signature line, where intricate handwork, luxurious fabrics and artisanal detailing come together to create pieces of distinction.",
    },
  ],
  closer:
    "Two expressions, connected by one philosophy — a celebration of heritage, craftsmanship and timeless elegance.",
  signoff: "Crafted in Pakistan. Created for today.",
} as const;

export type StorySection = {
  eyebrow: string;
  title: string;
  standfirst: string;
  body: string[];
  /** Set when the section is one of the two lines, so the page can link to it */
  href?: string;
  cta?: string;
};

/** The long form, told at /about. Follows the same order as BRAND_STORY. */
export const STORY: {
  standfirst: string;
  intro: string[];
  sections: StorySection[];
  closing: { title: string; body: string[]; signoff: string };
} = {
  standfirst: "Rooted in tradition. Designed for today.",
  intro: [
    "HAJAR was born from a love for Pakistani craftsmanship and a desire to bring its beauty into the modern wardrobe. Founded by designer Nazish Ali, the brand celebrates formal wear through thoughtful silhouettes, intricate details, and a contemporary interpretation of our cultural heritage.",
    "At the heart of HAJAR are two distinct expressions — HAJAR and HAJAR BY NAZISH ALI.",
  ],
  sections: [
    {
      eyebrow: "The house line",
      title: "HAJAR",
      standfirst: "Modern formals, made more accessible.",
      body: [
        "HAJAR offers beautifully designed formal wear at a more accessible price point. Created for celebrations, intimate gatherings, festive occasions and moments that call for something special, each piece balances elegance with modern femininity.",
        "The focus is on refined cuts, beautiful fabrics and carefully considered details — allowing you to experience the HAJAR aesthetic at an approachable price without compromising on style.",
      ],
      href: "/category/hajar",
      cta: "Explore HAJAR",
    },
    {
      eyebrow: "The signature line",
      title: "HAJAR BY NAZISH ALI",
      standfirst: "Where craftsmanship becomes couture.",
      body: [
        "HAJAR BY NAZISH ALI is our exclusive signature line — created for those who seek something truly distinctive.",
        "These pieces celebrate the art of hand craftsmanship through intricate kora, dabka, beads, crystals, pearls, cut dana, threadwork and mixed hand embellishments, brought together with luxurious fabrics and carefully developed silhouettes.",
        "With greater attention to handwork, detailing and finishing, every design carries the signature vision of Nazish Ali and is created to feel timeless, personal and exceptional.",
      ],
      href: "/category/hajar-by-nazish-ali",
      cta: "Explore the signature line",
    },
  ],
  closing: {
    title: "One house. Two expressions.",
    body: [
      "Whether you choose the understated elegance of HAJAR or the intricate craftsmanship of HAJAR BY NAZISH ALI, the philosophy remains the same: Pakistani heritage, interpreted for the modern woman.",
      "We believe formal wear should be more than something you simply wear for an occasion. It should make you feel confident, graceful and connected to the craftsmanship behind it.",
    ],
    signoff: "Crafted in Pakistan. Created for today.",
  },
};

/**
 * The designer, told at /designer.
 *
 * Same rule as BRAND_STORY and STORY: the wording is the house's, so it lives
 * here rather than in the page, and the page is only responsible for how it
 * sits on the screen.
 */
export const DESIGNER = {
  eyebrow: "Meet the designer",
  name: "Nazish Ali",
  role: "Founder & Creative Director",
  standfirst: "A personal vision of heritage, femininity and craftsmanship.",
  /**
   * No portrait has been supplied yet, so the page draws a monogram plate in
   * its place. Put a photograph in /public/media and name it here — the page
   * picks it up with no other change.
   */
  portrait: undefined as string | undefined,
  intro: [
    "Nazish Ali is the founder and creative force behind HAJAR and HAJAR BY NAZISH ALI — a fashion house born from her appreciation for Pakistani craftsmanship and her desire to reinterpret it for the modern woman.",
    "For Nazish, fashion has always been about more than creating beautiful clothes. It is about the way a woman feels when she wears them — confident yet graceful, contemporary while still connected to her heritage.",
  ],
  /* The hinge sentence between the two halves of the opening — set in display
     italic rather than buried as a one-line paragraph. */
  bridge: "Her design language brings these two worlds together.",
  introAfter: [
    "Inspired by the richness of Pakistani formal wear, Nazish works with elegant silhouettes, luxurious fabrics and traditional artisanal techniques, giving them a refined and modern perspective. From delicate details to elaborate hand embellishment, every element is considered with intention.",
  ],
  sections: [
    {
      title: "The vision behind HAJAR",
      body: [
        "Nazish created HAJAR with the belief that beautiful formal wear should exist at different levels of craftsmanship and accessibility without losing its identity.",
        "That vision evolved into two expressions.",
        "HAJAR offers refined contemporary formals at a more accessible price point — elegant pieces designed for celebrations, festive occasions and the modern wardrobe.",
        "HAJAR BY NAZISH ALI represents the designer's more exclusive creative expression. Here, intricate handwork, mixed embellishments, luxurious fabrics and detailed craftsmanship take centre stage, allowing each design to become something more distinctive and enduring.",
        "Though different in their level of detailing and craftsmanship, both are connected by the same design philosophy.",
      ],
    },
    {
      title: "Her design philosophy",
      body: [
        "Nazish believes in creating pieces that feel relevant today without losing the beauty of where they come from.",
        "Rather than simply recreating tradition, she draws from it — combining elements of Pakistani craftsmanship with modern cuts, thoughtful proportions and a softer contemporary sensibility.",
        "Her approach is feminine without being predictable, luxurious without being excessive, and traditional without feeling confined by tradition.",
        "Every collection begins with a feeling, develops through fabric and craftsmanship, and ultimately comes to life on the woman who wears it.",
      ],
    },
  ],
  quote: {
    eyebrow: "In her words",
    text: "I want every HAJAR piece to carry a sense of where we come from while still belonging to the woman of today. For me, true luxury is not simply about how much detail a garment carries — it is about the thought, craftsmanship and feeling behind it.",
    houses: "HAJAR | HAJAR BY NAZISH ALI",
  },
};

export const SIZE_GUIDE = [
  { size: "XS", bust: "32\"", waist: "26\"", hip: "35\"" },
  { size: "S", bust: "34\"", waist: "28\"", hip: "37\"" },
  { size: "M", bust: "36\"", waist: "30\"", hip: "39\"" },
  { size: "L", bust: "38\"", waist: "32\"", hip: "41\"" },
  { size: "XL", bust: "40\"", waist: "34\"", hip: "43\"" },
  { size: "XXL", bust: "42\"", waist: "36\"", hip: "45\"" },
];

export const JOURNAL: JournalPost[] = [
  {
    slug: "how-a-hajar-piece-is-made",
    title: "How a HAJAR piece is made",
    excerpt:
      "From the first sketch to the last pearl — the six weeks behind a single embellished kameez.",
    date: "2026-08-14",
    readTime: "6 min",
    category: "Atelier",
    body: [
      "Every piece begins on paper. The silhouette is drawn flat, then cut in muslin and fitted on a stand before a single thread of the real fabric is touched.",
      "The embellishment is where the time goes. A densely worked kameez carries somewhere between forty and ninety hours of hand work — pearl clusters set first, then mirror, then the sequin fill that ties the two together.",
      "Only once the panels are finished are they joined, lined in raw silk, and pressed. The pearl trim along the neckline and hem is the last thing to go on, always by hand, always after the final fitting.",
    ],
  },
  {
    slug: "dressing-for-the-long-wedding-season",
    title: "Dressing for the long wedding season",
    excerpt:
      "What to wear to a mayun, a mehndi and a valima without repeating yourself.",
    date: "2026-07-30",
    readTime: "4 min",
    category: "Edit",
    body: [
      "The Pakistani wedding season asks a lot of a wardrobe. The trick is not owning more — it is owning pieces that read differently depending on how they are styled.",
      "A ZOUQ 2 organza shirt over a raw silk trouser is a mehndi outfit. The same shirt over a column skirt, with heavier jewellery, is a dinner outfit.",
      "Keep the embellishment on one plane. If the shirt is worked, the trouser stays quiet — and the other way around.",
    ],
  },
  {
    slug: "caring-for-hand-embellished-clothing",
    title: "Caring for hand-embellished clothing",
    excerpt: "Storage, cleaning and travel — how to keep the work intact.",
    date: "2026-07-02",
    readTime: "3 min",
    category: "Care",
    body: [
      "Never wash an embellished piece at home. Water loosens the thread that holds pearl and mirror work, and the damage is rarely visible until the piece is worn again.",
      "Store flat where you can, or on a padded hanger with the weight taken by the shoulder seam rather than the embellishment. Cotton garment bags, never plastic.",
      "For travel, turn the piece inside out and roll it around a length of tissue. Creases fall out; broken thread does not.",
    ],
  },
];

export type HeroSlide = {
  image: string;
  alt: string;
  eyebrow: string;
  headline: string;
  /** The sentence under the headline. Optional — a slide can run on type alone. */
  standfirst?: string;
  kicker: string;
  href: string;
  cta: string;
  /**
   * Where to anchor the crop, as a CSS `object-position`.
   *
   * The hero band is far wider than any of these shots, so 30–45% of each
   * image's height is cut. Anchoring decides which end goes: a tightly framed
   * shot with the head near the top edge needs `center top`, a wide one with
   * headroom can afford the default.
   */
  focal?: string;
};

/** Used when a slide does not name its own. Keeps faces in shot on most crops. */
export const HERO_FOCAL_DEFAULT = "center 22%";

/**
 * Campaign slides for the home-page hero. These are 16:9 landscape shots made
 * for a full-bleed frame, so they run edge to edge with the type overlaid.
 * Replace the files, or edit the copy here, to change the hero.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/media/hero-balcony.jpg",
    alt: "Two models on a palace balcony at sunset, in Blush Hour and Moonlight Pearl",
    eyebrow: "Two expressions. One vision.",
    headline: "Heritage, reimagined.",
    standfirst: "Pakistani craftsmanship shaped through a modern lens.",
    kicker: "HAJAR BY NAZISH ALI — Exclusive handcrafted formals",
    href: "/category/hajar-by-nazish-ali",
    cta: "Discover the signature line",
    // 2752x1536 (1.79:1). Shot wide with headroom above both models, so it is
    // the one that survives the band's crop — hence it leads.
    focal: "center 20%",
  },
  {
    image: "/media/hero-garden.jpg",
    alt: "Model in a lilac hand-embellished cape and gharara, in a garden courtyard",
    eyebrow: "Two expressions. One vision.",
    headline: "Heritage, reimagined.",
    standfirst: "Pakistani craftsmanship shaped through a modern lens.",
    kicker: "HAJAR — Refined formals",
    href: "/category/hajar",
    cta: "Explore HAJAR",
    // 1600x1067 (1.50:1). A full-length fashion portrait: head at 5%, hem at
    // 95%. The band only ever shows ~58% of its height, so the whole look
    // cannot fit — `top` keeps the face and the bodice embroidery, which is
    // the part worth showing, and gives up the gharara hem.
    focal: "center top",
  },
];

/**
 * The home-page edit — pieces promoted by hand, in order. This is a curated
 * row, not "newest": name the slugs you want to lead with. Anything missing
 * from the catalogue is skipped, and if none match the row falls back to the
 * most recently updated pieces so it is never empty.
 */
export const FEATURED_SLUGS = [
  "moonlight-pearl",
  "lilac-eclat",
  "blush-hour",
  "ivory-regalia",
  "frost-silhouette",
  "subh-e-feroza",
  "rose-lumiere",
  "black-mist",
] as const;

/** Fallback catalogue — used only when the API is unreachable. */
export const FALLBACK_PRODUCTS: Product[] = [];

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function savePercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function getPost(slug: string) {
  return JOURNAL.find((p) => p.slug === slug);
}

export function collectionBySlug(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slugifyPath(slug));
}
