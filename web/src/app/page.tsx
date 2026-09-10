import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CampaignVideo } from "@/components/home/CampaignVideo";
import { Atelier } from "@/components/home/Atelier";
import { BrandStory } from "@/components/home/BrandStory";
import { CollectionTabs } from "@/components/home/CollectionTabs";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import {
  getCategories,
  getInstagramPosts,
  getProducts,
  PLACEHOLDER_IMAGE,
} from "@/lib/catalog";
import {
  childCollections,
  COLLECTIONS,
  collectionFamily,
  FEATURED_SLUGS,
  HERO_SLIDES,
  HOUSES,
  JOURNAL,
} from "@/lib/data";
import { SITE } from "@/lib/seo";

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, instagram] = await Promise.all([
    getProducts(),
    getCategories(),
    getInstagramPosts(12),
  ]);

  /*
    The edit, one tab per collection: ZOUQ 1, ZOUQ 2 and the couture line.
    "Edits" are the leaves of the collection tree — a house that has children
    is a heading, not something you can shop directly.
  */
  const rank = new Map<string, number>(
    FEATURED_SLUGS.map((slug, i) => [slug, i])
  );
  const editTabs = COLLECTIONS.filter(
    (c) => childCollections(c.slug).length === 0
  )
    .map((c) => {
      const inCollection = products.filter((p) => p.categorySlug === c.slug);
      return {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        blurb: c.blurb,
        href: `/category/${c.slug}`,
        total: inCollection.length,
        // Hand-picked pieces lead, the rest follow in catalogue order
        products: [...inCollection]
          .sort(
            (a, b) =>
              (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
              (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
          )
          .slice(0, 8),
      };
    })
    .filter((tab) => tab.products.length > 0);

  /*
    Atelier plate: the couture line is the most involved work, so it stands in
    for the section. The detail crop comes from a different piece, and only if
    one has a second image to crop — otherwise the plate stands alone.
  */
  const withImages = products.filter((p) => p.images.length > 0);
  const atelierPlate =
    withImages.find((p) => p.categorySlug === "hajar-by-nazish-ali") ??
    withImages[1] ??
    withImages[0];
  const atelierDetail = withImages.find(
    (p) => p.id !== atelierPlate?.id && p.images.length > 1
  );

  /** The two houses, each with its edits listed beneath. */
  const houseCards = HOUSES.map((house) => {
    const kids = childCollections(house.slug);
    const family = collectionFamily(house.slug);
    const remote = categories.find((cat) => cat.slug === house.slug);
    const cover =
      remote?.image ||
      products.find((p) => family.includes(p.categorySlug))?.images[0] ||
      PLACEHOLDER_IMAGE;
    return {
      ...house,
      cover,
      children: kids,
      count: products.filter((p) => family.includes(p.categorySlug)).length,
    };
  });

  return (
    <>
      {/* ------------------------------------------------ Full-bleed hero */}
      {HERO_SLIDES.length > 0 ? (
        <HeroSlider slides={HERO_SLIDES} />
      ) : (
        <section className="relative flex h-[62vh] min-h-[420px] items-center justify-center bg-hj-cream">
          <div className="px-6 text-center">
            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-tight text-hj-ink">
              Hand embellished,
              <br />
              <span className="italic text-hj-gold-deep">made to be kept.</span>
            </h1>
            <div className="rule-gold mx-auto mt-6 h-px w-24" />
            <ButtonLink href="/products" size="lg" className="mt-9">
              Shop the collections
            </ButtonLink>
          </div>
        </section>
      )}

      {/* ------------------------------------------------- The brand story */}
      <BrandStory />

      {/* -------------------------------------------------------- Two houses */}
      <section className="py-14 md:py-20">
        <header className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] uppercase tracking-[0.16em] text-hj-ink">
            The houses
          </h2>
          <p className="mt-2.5 text-[15px] text-hj-muted">
            Shop either expression.
          </p>
        </header>

        {/*
          Split card: the photography is portrait, so it gets a portrait column
          rather than being squashed into a wide strip. Fixed heights keep the
          pair inside one frame at any width.
        */}
        <div className="mx-auto mt-9 grid max-w-[1500px] gap-4 px-4 md:grid-cols-2 md:px-8">
          {houseCards.map((c) => (
            <article
              key={c.slug}
              className="group grid h-[240px] grid-cols-[minmax(0,42%)_minmax(0,58%)] overflow-hidden border border-hj-border bg-white transition-colors hover:border-hj-gold-soft sm:h-[300px] lg:h-[340px]"
            >
              <Link
                href={`/category/${c.slug}`}
                className="relative block overflow-hidden bg-hj-sand"
                aria-label={`${c.name} — ${c.count} pieces`}
              >
                <Image
                  src={c.cover}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 42vw, 21vw"
                  /* Top-anchored: head-to-hip always fits, whatever the source ratio */
                  className="card-img object-cover object-top"
                />
              </Link>

              <div className="flex flex-col justify-center px-5 py-6 md:px-7">
                <Link href={`/category/${c.slug}`} className="block">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-hj-gold-deep">
                    {c.count} {c.count === 1 ? "piece" : "pieces"}
                  </p>
                  <h3 className="mt-2.5 font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-tight text-hj-ink transition-colors group-hover:text-hj-gold-deep">
                    {c.name}
                  </h3>
                  <div className="rule-gold mt-3 h-px w-12" />
                  <p className="mt-3 text-[13px] leading-relaxed text-hj-muted">
                    {c.tagline}
                  </p>
                </Link>

                {c.children.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {c.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/category/${child.slug}`}
                          className="inline-flex border border-hj-border px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] text-hj-ink-soft transition-colors hover:border-hj-ink hover:bg-hj-ink hover:text-hj-gold-soft"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link
                    href={`/category/${c.slug}`}
                    className="mt-5 inline-flex w-fit border border-hj-border px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] text-hj-ink-soft transition-colors hover:border-hj-ink hover:bg-hj-ink hover:text-hj-gold-soft"
                  >
                    Explore
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- The edit */}
      {editTabs.length > 0 && (
        <section className="border-t border-hj-border bg-hj-cream py-14 md:py-20">
          <CollectionTabs tabs={editTabs} />
        </section>
      )}

      {/* ----------------------------------------------------------- Atelier */}
      <Atelier
        image={atelierPlate?.images[0] ?? PLACEHOLDER_IMAGE}
        imageAlt={
          atelierPlate
            ? `${atelierPlate.name}, hand-embellished in the HAJAR atelier`
            : "Hand-embellished couture by HAJAR"
        }
        detailImage={atelierDetail?.images.at(-1)}
        detailAlt={
          atelierDetail ? `Embellishment detail — ${atelierDetail.name}` : ""
        }
      />

      {/* ----------------------------------------------------------- Journal */}
      <section className="border-t border-hj-border bg-hj-cream py-16 md:py-24">
        <header className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] uppercase tracking-[0.16em] text-hj-ink">
            Journal
          </h2>
          <p className="mt-3 text-[15px] text-hj-muted">Notes from the atelier.</p>
        </header>

        {/*
          Journal entries carry no imagery, so the card has to be built out of
          type alone: the rule above it is the frame, and the meta line is
          pinned to the bottom with mt-auto so three excerpts of different
          lengths still end level with each other.
        */}
        <div className="mx-auto mt-14 grid max-w-[1400px] gap-x-10 gap-y-12 px-4 [&>a:nth-child(n+3)]:hidden md:grid-cols-3 md:px-8 md:[&>a:nth-child(n+3)]:flex">
          {JOURNAL.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group flex h-full flex-col border-t border-hj-border-strong pt-6 transition-colors hover:border-hj-gold"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-hj-gold-deep">
                {post.category}
              </p>

              <h3 className="mt-4 font-display text-[26px] leading-[1.2] text-hj-ink transition-colors group-hover:text-hj-gold-deep">
                {post.title}
              </h3>

              <p className="mt-3.5 hidden text-sm leading-relaxed text-hj-muted md:block">
                {post.excerpt}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-hj-border pt-4 text-[10px] uppercase tracking-[0.18em] text-hj-muted">
                <span>{post.readTime} read</span>
                <span className="flex items-center gap-2 text-hj-ink transition-colors group-hover:text-hj-gold-deep">
                  Read
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ButtonLink href="/journal" variant="outline">
            All journal entries
          </ButtonLink>
        </div>
      </section>

      {/* ----------------------------------------------------- Campaign film */}
      <CampaignVideo />

      {/* ------------------------------------------------------- Appointment */}
      {/* Warm sand rather than ink: the storefront is a white-ground house with
          gold accents, and a full black band read as a different site. Sand
          keeps it distinct from the cream journal band above and the cream
          footer masthead below without inverting the page. */}
      {/*
        Left-aligned editorial, not another centred stack. Every band above it
        centres its heading, and a third centred block read as filler — this is
        the one section asking for something, so it sits on the page like the
        atelier band: type on the left under a gold rule, the practical detail
        ruled off beside it.
      */}
      <section className="border-t border-hj-border bg-hj-sand">
        <div className="mx-auto grid max-w-[1400px] items-start gap-x-20 gap-y-12 px-4 py-20 md:px-8 lg:grid-cols-[1.15fr_minmax(0,400px)] lg:py-24">
          <div>
            <p className="eyebrow">By appointment</p>

            <h2 className="mt-4 font-display text-[clamp(2.25rem,4.4vw,3.375rem)] leading-[1.06] text-hj-ink">
              Visiting Lahore?
              <span className="mt-1 block italic text-hj-gold-deep">
                Come and see the work.
              </span>
            </h2>

            <div className="rule-gold mt-7 h-px w-24" />

            <p className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-hj-muted">
              Bridal and couture pieces are made to measure after a fitting.
              Message us on WhatsApp and we will find a time.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg">
                Book an appointment
              </ButtonLink>
              <ButtonLink
                href="/category/hajar-by-nazish-ali"
                variant="outline"
                size="lg"
              >
                See the couture line
              </ButtonLink>
            </div>
          </div>

          {/* Stacked rather than a three-up: the lead times ran to two lines in
              a third of the width and left the row ragged. */}
          <dl className="border-t border-hj-border-strong lg:mt-3">
            {[
              {
                term: "Atelier",
                value: `${SITE.city} — Monday to Saturday`,
              },
              {
                term: "Made to order",
                value: "5–6 weeks in Pakistan · 6–7 international",
              },
              {
                term: "WhatsApp",
                value: SITE.whatsappDisplay,
                href: `https://wa.me/${SITE.whatsapp}`,
              },
            ].map((item) => (
              <div
                key={item.term}
                className="border-b border-hj-border-strong py-5"
              >
                <dt className="text-[10px] uppercase tracking-[0.22em] text-hj-gold-deep">
                  {item.term}
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-hj-ink-soft">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="transition-colors hover:text-hj-gold-deep"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* --------------------------------------------------------- Instagram */}
      {/* Last band on the page, sitting straight above the footer — the grid
          is a contact sheet, not a section that needs anything after it. */}
      <InstagramGrid posts={instagram} />
    </>
  );
}
