import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CampaignVideo } from "@/components/home/CampaignVideo";
import { CollectionTabs } from "@/components/home/CollectionTabs";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import {
  getCategories,
  getInstagramPosts,
  getProducts,
  PLACEHOLDER_IMAGE,
} from "@/lib/catalog";
import {
  HOUSES,
  collectionFamily,
  FEATURED_SLUGS,
  HERO_SLIDES,
  LOOKBOOK_COVERS,
} from "@/lib/data";
import { SITE } from "@/lib/seo";

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, instagram] = await Promise.all([
    getProducts(),
    getCategories(),
    getInstagramPosts(12),
  ]);

  const rank = new Map<string, number>(
    FEATURED_SLUGS.map((slug, i) => [slug, i])
  );
  const editTabs = HOUSES.map((house) => {
    const family = collectionFamily(house.slug);
    const inCollection = products.filter((p) =>
      family.includes(p.categorySlug)
    );
    return {
      slug: house.slug,
      name: house.name,
      tagline: house.tagline,
      blurb: house.blurb,
      href: `/category/${house.slug}`,
      total: inCollection.length,
      products: [...inCollection]
        .sort(
          (a, b) =>
            (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
            (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
        )
        .slice(0, 4),
    };
  }).filter((tab) => tab.products.length > 0);

  const lookbook = HOUSES.map((house) => {
    const family = collectionFamily(house.slug);
    const remote = categories.find((cat) => cat.slug === house.slug);
    const choice = LOOKBOOK_COVERS[house.slug];
    const picked = products.find((p) => p.slug === choice?.product);
    const cover =
      picked?.images[choice?.image ?? 0] ||
      picked?.images[0] ||
      remote?.image ||
      products.find((p) => family.includes(p.categorySlug))?.images[0] ||
      PLACEHOLDER_IMAGE;
    return { ...house, cover };
  });

  return (
    <>
      {HERO_SLIDES.length > 0 ? (
        <HeroSlider slides={HERO_SLIDES} />
      ) : (
        <section className="flex h-[70vh] items-center justify-center">
          <h1 className="text-center">
            <span className="block font-display text-5xl font-light tracking-[0.35em]">
              HAJAR
            </span>
            <span className="mt-3 block text-[11px] uppercase tracking-[0.32em] text-hj-gold-deep">
              by Nazish Ali
            </span>
          </h1>
        </section>
      )}

      {editTabs.length > 0 && (
        <section className="py-16 md:py-24">
          <CollectionTabs tabs={editTabs} />
        </section>
      )}

      {lookbook.length > 0 && (
        <section className="px-4 py-12 md:px-8 md:py-20">
          {/*
            Portrait tiles, as the photography is shot. From md up each tile's
            width is the smallest of: half the row, the width a 3:4 tile can
            have while fitting the screen height, and 560px — so both sit side
            by side in one frame without cropping the looks to a letterbox.
          */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-8">
            {lookbook.map((tile) => (
              <Link
                key={tile.slug}
                href={`/category/${tile.slug}`}
                className="group relative block w-full max-w-[520px] overflow-hidden bg-hj-sand md:w-[min(44vw,calc((100vh-9rem)*0.75),560px)] md:max-w-none"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={tile.cover}
                    alt={tile.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    quality={90}
                    className="object-cover object-[center_20%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-white/95 px-5 py-3 backdrop-blur-sm md:bottom-6 md:left-6 md:px-6 md:py-3.5">
                  <p className="font-display text-[12px] uppercase tracking-[0.26em] text-hj-ink md:text-[13px]">
                    {tile.name}
                  </p>
                  <p className="mt-1 font-display text-[12px] italic text-hj-gold-deep md:text-[13px]">
                    {tile.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CampaignVideo />

      <section className="border-t border-hj-border">
        <div className="mx-auto max-w-[720px] px-4 py-20 text-center md:py-24">
          <p className="text-[11px] uppercase tracking-[0.28em] text-hj-muted">
            By appointment
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-light uppercase tracking-[0.18em] text-hj-ink">
            Visiting Lahore?
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[15px] leading-relaxed text-hj-muted">
            Bridal and couture pieces are made to measure after a fitting.
            {SITE.street}, {SITE.city} — Monday to Saturday.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block text-[11px] uppercase tracking-[0.22em] text-hj-ink underline underline-offset-8"
          >
            Book an appointment
          </Link>
        </div>
      </section>

      <InstagramGrid posts={instagram} />
    </>
  );
}
