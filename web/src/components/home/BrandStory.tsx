import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND_STORY } from "@/lib/data";

/**
 * The brand story, short form — the band that follows the hero.
 *
 * It is type only, deliberately: the hero above it and the house cards below
 * are both photographic, and a third image band here left the top of the page
 * with no pause in it. The two expressions sit side by side under one heading
 * so the split reads as one house rather than two brands.
 */
export function BrandStory() {
  return (
    <section className="border-b border-hj-border bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{BRAND_STORY.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] text-hj-ink">
            {BRAND_STORY.heading}{" "}
            <span className="italic text-hj-gold-deep">
              {BRAND_STORY.headingItalic}
            </span>
          </h2>
          <div className="rule-gold mx-auto mt-7 h-px w-24" />
          <p className="mx-auto mt-7 hidden max-w-[52ch] text-[17px] leading-relaxed text-hj-ink-soft md:block">
            {BRAND_STORY.lede}
          </p>
        </header>

        {/*
          Two columns on a shared top rule, with a hairline between them on
          desktop — the divider is what carries "one house, two lines". It is
          drawn on the second column so it never hangs off the end of the row.
        */}
        <div className="mx-auto mt-14 grid max-w-[1100px] gap-x-16 gap-y-12 md:grid-cols-2">
          {BRAND_STORY.expressions.map((expression, i) => (
            <div
              key={expression.slug}
              className={
                i === 1
                  ? "border-t border-hj-border-strong pt-8 md:border-l md:border-t-0 md:pl-16 md:pt-0"
                  : "border-t border-hj-border-strong pt-8"
              }
            >
              <Link href={`/category/${expression.slug}`} className="group block">
                <h3 className="font-display text-[clamp(1.25rem,2vw,1.625rem)] uppercase leading-tight tracking-[0.14em] text-hj-ink transition-colors group-hover:text-hj-gold-deep">
                  {expression.name}
                </h3>
                <p className="mt-3 font-display text-lg italic text-hj-gold-deep">
                  {expression.tagline}
                </p>
                {/* The full description lives on /about. On a phone this
                    band was three screens of prose before the first product;
                    the name and tagline are enough to choose a house. */}
                <p className="mt-4 hidden text-[15px] leading-relaxed text-hj-muted md:block">
                  {expression.body}
                </p>
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-[62ch] border-t border-hj-border pt-10 text-center">
          <p className="hidden text-[15px] leading-relaxed text-hj-muted md:block">
            {BRAND_STORY.closer}
          </p>
          <p className="mt-6 font-display text-xl italic text-hj-ink">
            {BRAND_STORY.signoff}
          </p>
          <ButtonLink href="/about" variant="outline" className="mt-9">
            Read our story
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
