import { Breadcrumbs } from "@/components/Breadcrumbs";

export type LegalSection = { heading: string; body: string[] };

/** Shared shell for privacy, cookies, terms, shipping and size-guide copy. */
export function LegalPage({
  title,
  intro,
  updated,
  href,
  sections,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  href: string;
  sections?: LegalSection[];
  children?: React.ReactNode;
}) {
  const trail = [
    { name: "Home", href: "/" },
    { name: title, href },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <Breadcrumbs trail={trail} />

      <article className="mx-auto mt-10 max-w-2xl">
        <h1 className="font-display text-5xl leading-tight text-hj-ink">
          {title}
        </h1>
        <div className="rule-gold mt-5 h-px w-24" />
        <p className="mt-6 text-[15px] leading-relaxed text-hj-muted">
          {intro}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-hj-muted">
          Last updated {updated}
        </p>

        {children && <div className="mt-12">{children}</div>}

        {sections && (
          <div className="mt-12 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-2xl text-hj-ink">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((p, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-[1.8] text-hj-ink-soft"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
