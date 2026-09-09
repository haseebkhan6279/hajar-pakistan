import Link from "next/link";
import { LogoMark } from "@/components/Brand";
import { Newsletter } from "@/components/Newsletter";
import { childCollections, HOUSES } from "@/lib/data";
import { categoryPath } from "@/lib/paths";
import { POLICIES } from "@/lib/policies";
import { SITE } from "@/lib/seo";

const INFORMATION = [
  ...POLICIES.map((policy) => ({
    href: `/policies/${policy.slug}`,
    label: policy.navLabel,
  })),
  { href: "/privacy", label: "Privacy policy" },
];

const CUSTOMER_CARE = [
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact us" },
  { href: "/size-guide", label: "Size guide" },
  { href: "/journal", label: "Journal" },
];

const MARQUEE = [
  "Hand embellished",
  "Made in Lahore",
  "Worldwide shipping",
  "Made to order couture",
  "Two expressions. One vision.",
  "ZOUQ 1 · ZOUQ 2 · HAJAR BY NAZISH ALI",
];

const SOCIAL = [
  {
    href: SITE.social.instagram,
    label: "Instagram",
    path: "M4 2.6h12A1.4 1.4 0 0 1 17.4 4v12a1.4 1.4 0 0 1-1.4 1.4H4A1.4 1.4 0 0 1 2.6 16V4A1.4 1.4 0 0 1 4 2.6Zm6 4.6a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.3-1.5a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Z",
  },
  {
    href: SITE.social.facebook,
    label: "Facebook",
    path: "M11.2 17.4v-6.2h2.1l.3-2.4h-2.4V7.2c0-.7.2-1.2 1.2-1.2h1.3V3.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.1-3.2 3.2v1.8H6.4v2.4h2.2v6.2h2.6Z",
  },
];

const CONTACT = [
  { term: "Atelier", value: `${SITE.city}, ${SITE.country}`, href: null },
  {
    term: "WhatsApp",
    value: SITE.whatsappDisplay,
    href: `https://wa.me/${SITE.whatsapp}`,
  },
  { term: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
];

/** Column heading — eyebrow caps over the short gold hairline. */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.22em] text-hj-ink">
      {children}
      <span className="rule-gold mt-3 block h-px w-8" />
    </h2>
  );
}

const LINK =
  "text-[13px] text-hj-muted transition-colors hover:text-hj-gold-deep";

export function SiteFooter() {
  return (
    <footer className="border-t border-hj-border bg-white">
      {/* --------------------------------------------------------- Marquee */}
      <div className="overflow-hidden border-b border-hj-border bg-hj-cream py-3.5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE.map((t) => (
                <span
                  key={`${dup}-${t}`}
                  className="flex items-center whitespace-nowrap px-6 text-[10px] uppercase tracking-[0.22em] text-hj-muted"
                >
                  {t}
                  <span className="ml-6 h-1 w-1 rotate-45 bg-hj-gold" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/*
        Masthead — the lockup and the newsletter share one band.

        The brand block used to be the square logo file dropped on white, which
        read as a pasted sticker: the asset carries its own black ground and
        mandala frame. This is the header lockup instead — the roundel cropped
        to a circle beside the wordmark — so the footer opens on the same mark
        the page opened on.
      */}
      <div className="border-b border-hj-border bg-hj-cream">
        <div className="mx-auto grid max-w-[1500px] gap-x-20 gap-y-10 px-4 py-14 md:px-8 lg:grid-cols-[1fr_minmax(0,480px)] lg:py-16">
          <div>
            <Link
              href="/"
              aria-label="HAJAR — home"
              className="inline-flex items-center gap-3.5"
            >
              <LogoMark size={44} />
              <span className="font-display text-[30px] font-medium leading-none tracking-brand text-hj-ink">
                HAJAR
              </span>
            </Link>

            <p className="mt-6 max-w-[38ch] font-display text-xl leading-snug text-hj-ink-soft">
              Pakistani heritage, interpreted for the modern woman.
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-hj-muted">
              Crafted in {SITE.country}. Created for today.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-hj-gold-deep transition-colors hover:text-hj-ink"
            >
              Book an appointment
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-hj-muted">
              The house letter
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-hj-muted">
              New collections and atelier notes, once a week.
            </p>
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Four even columns — no column carries a panel, so none of them ends
          short and leaves the row lopsided. */}
      <div className="mx-auto max-w-[1500px] px-4 md:px-8">
        <div className="grid gap-x-8 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          <nav aria-label="Collections">
            <ColumnHeading>Collections</ColumnHeading>
            <ul className="mt-6 space-y-4">
              {HOUSES.map((house) => {
                const children = childCollections(house.slug);
                return (
                  <li key={house.slug}>
                    <Link
                      href={categoryPath(house.slug)}
                      className="text-[11px] uppercase tracking-[0.16em] text-hj-ink transition-colors hover:text-hj-gold-deep"
                    >
                      {house.name}
                    </Link>
                    {children.length > 0 && (
                      <ul className="mt-2.5 space-y-2 border-l border-hj-border pl-3.5">
                        {children.map((child) => (
                          <li key={child.slug}>
                            <Link
                              href={categoryPath(child.slug)}
                              className={LINK}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li>
                <Link
                  href="/products"
                  className="text-[11px] uppercase tracking-[0.16em] text-hj-gold-deep transition-colors hover:text-hj-ink"
                >
                  All pieces
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Information">
            <ColumnHeading>Information</ColumnHeading>
            <ul className="mt-6 space-y-3">
              {INFORMATION.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer care">
            <ColumnHeading>Customer care</ColumnHeading>
            <ul className="mt-6 space-y-3">
              {CUSTOMER_CARE.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>Contact</ColumnHeading>
            <dl className="mt-6 space-y-4">
              {CONTACT.map((row) => (
                <div key={row.term}>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
                    {row.term}
                  </dt>
                  <dd className="mt-1.5 text-[13px] leading-relaxed text-hj-ink-soft">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="transition-colors hover:text-hj-gold-deep"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-7 flex gap-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center border border-hj-border text-hj-ink-soft transition-colors hover:border-hj-gold hover:bg-hj-gold-wash hover:text-hj-gold-deep"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
                      <path d={s.path} fill="currentColor" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar. The tall bottom padding keeps the last line of type clear
            of the fixed WhatsApp and back-to-top floats at the page foot. */}
        <div className="flex flex-col gap-3 border-t border-hj-border pb-24 pt-7 text-[11px] text-hj-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.18em]">
            {SITE.currency} · Ships worldwide ·{" "}
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-hj-gold-deep"
            >
              {SITE.instagramHandle}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
