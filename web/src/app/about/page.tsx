import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { STORY } from "@/lib/data";
import { pageMetadata, SITE } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Our story",
  description:
    "Rooted in tradition, designed for today. HAJAR was founded by designer Nazish Ali — two expressions of Pakistani formal wear, from accessible modern formals to the hand-embellished signature line.",
  path: "/about",
});

export default function AboutPage() {
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
        <p className="text-[11px] uppercase tracking-[0.28em] text-hj-muted">
          About us
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-light uppercase leading-[1.08] tracking-[0.12em] text-hj-ink">
          Rooted in tradition.
          <span className="mt-1 block font-light normal-case tracking-normal italic">
            Designed for today.
          </span>
        </h1>
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

      {/* The two lines — told in words only, no model photography */}
      <div className="mt-20 space-y-16 md:mt-28 md:space-y-24">
        {STORY.sections.map((section) => (
          <section
            key={section.title}
            className="mx-auto max-w-3xl border-t border-hj-border pt-16 text-center md:pt-24"
          >
            <p className="eyebrow">{section.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] uppercase leading-tight tracking-[0.14em] text-hj-ink">
              {section.title}
            </h2>
            <p className="mt-4 font-display text-xl italic text-hj-gold-deep">
              {section.standfirst}
            </p>
            <div className="rule-gold mx-auto mt-6 h-px w-20" />

            <div className="mt-7 space-y-5 text-left md:text-center">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mx-auto max-w-[62ch] text-[15px] leading-[1.8] text-hj-muted"
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
            {SITE.legalName} — {SITE.street}, {SITE.city}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/products" size="lg">
              Shop the collections
            </ButtonLink>
            <ButtonLink href="/designer" variant="outline" size="lg">
              Meet the designer
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
