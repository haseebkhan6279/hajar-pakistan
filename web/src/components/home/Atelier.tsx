import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/** The three passes a piece goes through, in the order the atelier works. */
const STEPS = [
  {
    n: "01",
    title: "Set",
    body: "Pearl clusters go down first, then mirror, then the sequin fill that ties the two together.",
  },
  {
    n: "02",
    title: "Join",
    body: "Panels are only brought together once the embellishment on each one is finished.",
  },
  {
    n: "03",
    title: "Finish",
    body: "Lined in raw silk, pressed, and trimmed by hand after the final fitting.",
  },
];

const FACTS = [
  ["Hand finished", "Every piece"],
  ["Made in", "Lahore"],
  ["Delivery", "Nationwide"],
];

/**
 * The atelier band.
 *
 * A 50/50 split left the copy stranded across half a wide screen, and the
 * single paragraph buried the part that actually sells the work — that it is
 * made in three passes by hand. The plate is now a portrait with an offset
 * detail crop, and the copy sits in a measured column beside it.
 */
export function Atelier({
  image,
  imageAlt,
  detailImage,
  detailAlt,
}: {
  image: string;
  imageAlt: string;
  detailImage?: string;
  detailAlt?: string;
}) {
  return (
    <section className="border-t border-hj-border bg-white">
      <div className="mx-auto grid max-w-[1500px] items-center gap-y-20 px-4 py-16 md:px-8 lg:grid-cols-[minmax(0,var(--plate))_minmax(0,1fr)] lg:justify-center lg:gap-x-20 lg:py-28 [--plate:460px]">
        {/*
          The plate is capped rather than sized off the column. Catalogue
          photography runs as small as 576px wide, and a half-width plate on a
          wide screen upscaled it into mush — 460px is the largest box the
          smallest source fills honestly.
        */}
        <div className="relative mx-auto w-full max-w-[var(--plate)]">
          {/*
            Hairline frame, offset behind the plate. It sits first in the DOM
            and the plate carries the higher layer — a negative z-index would
            drop it behind the section background instead.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 -left-4 hidden h-full w-full border border-hj-gold-soft sm:block"
          />

          <div className="relative z-10 aspect-[4/5] overflow-hidden bg-hj-sand">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 460px) 100vw, 460px"
              quality={90}
              className="object-cover object-top"
            />
          </div>

          {detailImage && (
            <div className="absolute -bottom-10 right-4 z-20 hidden aspect-square w-40 overflow-hidden border-[6px] border-white bg-hj-sand lg:block lg:-right-10 lg:w-52">
              <Image
                src={detailImage}
                alt={detailAlt ?? ""}
                fill
                /* Widest rendered box is 208px; ask for the 2x candidate so
                   the crop stays sharp on a retina screen. */
                sizes="(max-width: 1024px) 160px, 416px"
                quality={90}
                className="object-cover object-center"
              />
            </div>
          )}
        </div>

        {/* ------------------------------------------------------ The copy */}
        <div className="lg:max-w-2xl">
          <p className="eyebrow">The atelier</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-hj-ink md:text-5xl">
            Forty to ninety hours
            <br />
            <span className="italic text-hj-gold-deep">on a single piece.</span>
          </h2>
          <div className="rule-gold mt-6 h-px w-24" />

          {/* The work, in the order it happens */}
          <ol className="mt-9 space-y-6">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-5">
                <span className="mt-0.5 font-display text-lg leading-none text-hj-gold-deep">
                  {step.n}
                </span>
                <div className="border-l border-hj-border pl-5">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] text-hj-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 hidden text-[15px] leading-relaxed text-hj-muted md:block">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <dl className="mt-11 grid grid-cols-3 gap-6 border-t border-hj-border pt-8">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  {k}
                </dt>
                <dd className="mt-2 font-display text-xl text-hj-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <ButtonLink href="/journal" variant="outline" className="mt-10 self-start">
            Read the journal
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
