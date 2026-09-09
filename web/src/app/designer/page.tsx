import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GoldFret, LogoMark } from "@/components/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { DESIGNER } from "@/lib/data";
import { breadcrumbSchema, designerSchema, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Meet the designer — Nazish Ali",
  description:
    "Nazish Ali is the founder and creative force behind HAJAR and HAJAR BY NAZISH ALI — Pakistani craftsmanship reinterpreted for the modern woman.",
  path: "/designer",
});

const TRAIL = [
  { name: "Home", href: "/" },
  { name: "Our story", href: "/about" },
  { name: "Meet the designer", href: "/designer" },
];

/**
 * The designer's portrait.
 *
 * Until a photograph of Nazish is supplied there is nothing honest to put
 * here — the campaign photography is of models, and running one of those
 * shots under her name would caption the wrong person. So the slot draws a
 * monogram plate instead: it holds the same space and reads as a deliberate
 * frame rather than a missing image. Setting DESIGNER.portrait swaps it out.
 */
function Portrait({ src, name }: { src?: string; name: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full border border-hj-gold-soft sm:block"
      />
      <div className="relative z-10 aspect-[4/5] overflow-hidden bg-hj-sand">
        {src ? (
          <Image
            src={src}
            alt={"Portrait of " + name + ", founder and creative director of HAJAR"}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            quality={90}
            priority
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 bg-hj-cream px-8 text-center">
            <LogoMark size={72} />
            <div>
              <p className="font-display text-[clamp(1.5rem,3vw,2rem)] uppercase leading-tight tracking-[0.2em] text-hj-ink">
                {name}
              </p>
              <div className="rule-gold mx-auto mt-4 h-px w-16" />
            </div>
            <GoldFret className="max-w-[120px]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DesignerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={[designerSchema(), breadcrumbSchema(TRAIL)]} />
      <Breadcrumbs trail={TRAIL} />

      {/* ---------------------------------------------------------- Opening */}
      <header className="mt-12 grid items-center gap-x-16 gap-y-12 md:mt-16 lg:grid-cols-2">
        <Portrait src={DESIGNER.portrait} name={DESIGNER.name} />

        <div>
          <p className="eyebrow">{DESIGNER.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] uppercase leading-[1.06] tracking-[0.12em] text-hj-ink">
            {DESIGNER.name}
          </h1>
          <p className="mt-4 font-display text-xl italic text-hj-gold-deep">
            {DESIGNER.standfirst}
          </p>
          <div className="rule-gold mt-7 h-px w-24" />

          <div className="mt-8 space-y-5">
            {DESIGNER.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="max-w-[58ch] text-[16px] leading-[1.8] text-hj-ink-soft"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-8 max-w-[46ch] border-l border-hj-gold-soft pl-6 font-display text-[clamp(1.25rem,2.2vw,1.5rem)] italic leading-snug text-hj-ink">
            {DESIGNER.bridge}
          </p>

          <div className="mt-8 space-y-5">
            {DESIGNER.introAfter.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="max-w-[58ch] text-[16px] leading-[1.8] text-hj-ink-soft"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </header>

      {/*
        The two prose sections. These are long — five paragraphs and four —
        so they run as a single measured column rather than the alternating
        image rows used on /about, where each section is shorter and has a
        garment of its own to show.
      */}
      <div className="mx-auto mt-20 max-w-[62ch] space-y-16 md:mt-28 md:space-y-20">
        {DESIGNER.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] uppercase leading-tight tracking-[0.14em] text-hj-ink">
              {section.title}
            </h2>
            <div className="rule-gold mt-5 h-px w-20" />
            <div className="mt-7 space-y-5">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-[15px] leading-[1.85] text-hj-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ------------------------------------------------------ In her words */}
      <section className="mt-20 border-y border-hj-border bg-hj-cream md:mt-28">
        <figure className="mx-auto max-w-[64ch] px-4 py-16 text-center md:py-20">
          <p className="eyebrow">{DESIGNER.quote.eyebrow}</p>
          <div className="rule-gold mx-auto mt-6 h-px w-16" />

          <blockquote className="mt-8">
            <p className="font-display text-[clamp(1.375rem,3vw,1.875rem)] italic leading-[1.5] text-hj-ink">
              &ldquo;{DESIGNER.quote.text}&rdquo;
            </p>
          </blockquote>

          <figcaption className="mt-10">
            <p className="font-display text-xl tracking-[0.1em] text-hj-ink">
              {DESIGNER.name}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-hj-muted">
              {DESIGNER.role}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-hj-gold-deep">
              {DESIGNER.quote.houses}
            </p>
          </figcaption>
        </figure>
      </section>

      {/*
        Campaign photography, not a portrait — the alt text says so, because
        the two women in it are models rather than the designer.
      */}
      <section className="mt-20 md:mt-28">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-hj-sand">
          <Image
            src="/media/hero-courtyard.jpg"
            alt="Two models in a sandstone courtyard, wearing hand-embellished HAJAR formals"
            fill
            sizes="(max-width: 1400px) 100vw, 1400px"
            quality={85}
            className="object-cover"
            style={{ objectPosition: "center 30%" }}
          />
        </div>

        <div className="mx-auto mt-12 max-w-[62ch] text-center">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] uppercase leading-tight tracking-[0.14em] text-hj-ink">
            One house. Two expressions.
          </h2>
          <div className="rule-gold mx-auto mt-6 h-px w-20" />
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/category/hajar" size="lg">
              Explore HAJAR
            </ButtonLink>
            <ButtonLink
              href="/category/hajar-by-nazish-ali"
              variant="outline"
              size="lg"
            >
              The signature line
            </ButtonLink>
          </div>
          <p className="mt-8 text-[13px] text-hj-muted">
            Read more about the house in{" "}
            <Link
              href="/about"
              className="text-hj-gold-deep underline-offset-4 hover:underline"
            >
              our story
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
