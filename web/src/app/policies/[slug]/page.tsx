import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPolicy, POLICIES } from "@/lib/policies";
import { breadcrumbSchema, pageMetadata, SITE } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICIES.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Policy not found" };
  return pageMetadata({
    title: policy.title,
    description: policy.metaDescription,
    path: `/policies/${policy.slug}`,
  });
}

export default async function PolicyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const policy = getPolicy(slug)!;
  const others = POLICIES.filter((x) => x.slug !== policy.slug);

  const trail = [
    { name: "Home", href: "/" },
    { name: policy.title, href: `/policies/${policy.slug}` },
  ];

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs trail={trail} />

      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <article className="max-w-2xl">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-hj-ink">
            {policy.title}
          </h1>
          <div className="rule-gold mt-5 h-px w-24" />
          <p className="mt-7 text-[15px] leading-relaxed text-hj-ink-soft">
            {policy.intro}
          </p>

          <div className="mt-12 space-y-11">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-hj-gold-deep">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.blocks.map((block, i) =>
                    block.kind === "p" ? (
                      <p
                        key={i}
                        className="text-[15px] leading-[1.8] text-hj-ink-soft"
                      >
                        {block.text}
                      </p>
                    ) : (
                      <ul key={i} className="space-y-2.5">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-[15px] leading-[1.8] text-hj-ink-soft"
                          >
                            <span
                              aria-hidden
                              className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-hj-gold"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Contact block — every source document carries one */}
          <section className="mt-14 border-t border-hj-border pt-8">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-hj-gold-deep">
              Contact us
            </h2>
            <address className="mt-4 space-y-2 text-[15px] not-italic leading-relaxed text-hj-ink-soft">
              <p className="text-hj-ink">{SITE.legalName}</p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-hj-gold-deep underline underline-offset-2"
                >
                  {SITE.email}
                </a>
              </p>
              <p>
                Instagram:{" "}
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-hj-gold-deep underline underline-offset-2"
                >
                  {SITE.instagramHandle}
                </a>
              </p>
              <p>
                WhatsApp / Contact:{" "}
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-hj-gold-deep underline underline-offset-2"
                >
                  {SITE.whatsappDisplay}
                </a>
              </p>
            </address>
          </section>

          {policy.acknowledgement && (
            <p className="mt-10 border border-hj-border bg-hj-cream px-5 py-4 text-[13px] leading-relaxed text-hj-ink-soft">
              {policy.acknowledgement}
            </p>
          )}
        </article>

        {/* Sibling policies */}
        <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Policies</p>
          <ul className="mt-5 space-y-3 border-t border-hj-border pt-5">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/policies/${other.slug}`}
                  className="text-sm text-hj-muted transition-colors hover:text-hj-gold-deep"
                >
                  {other.navLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/privacy"
                className="text-sm text-hj-muted transition-colors hover:text-hj-gold-deep"
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="/size-guide"
                className="text-sm text-hj-muted transition-colors hover:text-hj-gold-deep"
              >
                Size guide
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
