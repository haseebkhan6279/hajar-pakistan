import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { getProducts, PLACEHOLDER_IMAGE } from "@/lib/catalog";
import { collectionFamily, STORY } from "@/lib/data";
import { pageMetadata, SITE } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Our story",
  description:
    "Rooted in tradition, designed for today. HAJAR was founded by designer Nazish Ali — two expressions of Pakistani formal wear, from accessible modern formals to the hand-embellished signature line.",
  path: "/about",
});

export default async function AboutPage() {
  /*
    Each of the two lines is illustrated by a piece from its own catalogue,
    so the page stays in step with what is actually in stock. With the API
    down both fall back to the placeholder and the page still reads.
  */
  const products = await getProducts();
  const plateFor = (slug: string) =>
    products.find(
      (p) => collectionFamily(slug).includes(p.categorySlug) && p.images.length > 0
    )?.images[0] ?? PLACEHOLDER_IMAGE;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <Breadcrumbs
        trail={[
          { name: "Home", href: "/" },
          { name: "Our story", href: "/about" },
        ]}
      />

      {/* ------------------------------------------------------------ Opening */}
      <header className="mx-auto mt-12 max-w-3xl text-center md:mt-16">
        <p className="eyebrow">About us</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.06] text-hj-ink">
          Rooted in tradition.
          <span className="mt-1 block italic text-hj-gold-deep">
            Designed for today.
          </span>
        </h1>
        <div className="rule-gold mx-auto mt-7 h-px w-24" />
        <div className="mt-8 space-y-5 text-left md:text-center">
          {STORY.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-[17px] leading-[1.75] text-hj-ink-soft"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      {/*
        The two lines, alternating. The plate is portrait — catalogue
        photography is shot full length — and the columns swap on the second
        section so the page does not read as two identical rows.
      */}
      <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
        {STORY.sections.map((section, i) => (
          <section
            key={section.title}
            className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-2"
          >
            <div
              className={
                i % 2 === 1
                  ? "relative mx-auto w-full max-w-[440px] lg:order-2"
                  : "relative mx-auto w-full max-w-[440px]"
              }
            >
              <div
                aria-hidden
                className={
                  i % 2 === 1
                    ? "pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full border border-hj-gold-soft sm:block"
                    : "pointer-events-none absolute -bottom-4 -left-4 hidden h-full w-full border border-hj-gold-soft sm:block"
                }
              />
              <div className="relative z-10 aspect-[4/5] overflow-hidden bg-hj-sand">
                <Image
                  src={plateFor(section.href?.split("/").pop() ?? "")}
                  alt={`${section.title} by HAJAR`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  quality={90}
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] uppercase leading-tight tracking-[0.14em] text-hj-ink">
                {section.title}
              </h2>
              <p className="mt-4 font-display text-xl italic text-hj-gold-deep">
                {section.standfirst}
              </p>
              <div className="rule-gold mt-6 h-px w-20" />

              <div className="mt-7 space-y-5">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="max-w-[54ch] text-[15px] leading-[1.8] text-hj-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.href && section.cta && (
                <ButtonLink href={section.href} className="mt-9">
                  {section.cta}
                </ButtonLink>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ------------------------------------------------------------ Closing */}
      <section className="mt-20 border-t border-hj-border bg-hj-cream md:mt-28">
        <div className="mx-auto max-w-[62ch] px-4 py-16 text-center md:py-20">
          <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] uppercase leading-tight tracking-[0.14em] text-hj-ink">
            One house. Two expressions.
          </h2>
          <div className="rule-gold mx-auto mt-6 h-px w-24" />

          <div className="mt-8 space-y-5">
            {STORY.closing.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-[15px] leading-[1.8] text-hj-ink-soft"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-10 font-display text-2xl italic text-hj-ink">
            {STORY.closing.signoff}
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-hj-muted">
            {SITE.legalName} — {SITE.city}, {SITE.country}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/products" size="lg">
              Shop the collections
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Book an appointment
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
