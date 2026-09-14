import Link from "next/link";
import { LogoMark } from "@/components/Brand";
import { HOUSES } from "@/lib/data";
import { categoryPath } from "@/lib/paths";
import { POLICIES } from "@/lib/policies";
import { atelierMapsUrl, SITE } from "@/lib/seo";

const INFORMATION = [
  ...POLICIES.map((policy) => ({
    href: `/policies/${policy.slug}`,
    label: policy.navLabel,
  })),
  { href: "/privacy", label: "Privacy policy" },
];

const CUSTOMER_CARE = [
  { href: "/about", label: "Our story" },
  { href: "/designer", label: "Meet the designer" },
  { href: "/contact", label: "Contact us" },
  { href: "/journal", label: "Journal" },
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

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <details className="group border-t border-hj-border md:border-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[11px] uppercase tracking-[0.2em] text-hj-ink md:pointer-events-none md:pb-5 md:pt-0">
        {title}
        <span className="text-lg font-light md:hidden">+</span>
      </summary>
      <ul className="space-y-2.5 pb-5 md:pb-0">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13px] text-hj-muted transition-colors hover:text-hj-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteFooter() {
  const collectionLinks = [
    ...HOUSES.map((house) => ({
      href: categoryPath(house.slug),
      label: house.name,
    })),
    { href: "/products", label: "All pieces" },
  ];

  return (
    <footer className="border-t border-hj-border bg-white">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:py-16">
        <div className="text-[13px] leading-relaxed text-hj-muted">
          <Link
            href="/"
            aria-label="HAJAR by Nazish Ali — home"
            className="mb-6 inline-flex items-center gap-2.5"
          >
            <LogoMark size={40} />
            <span className="leading-none">
              <span className="block font-display text-xl tracking-[0.28em] text-hj-ink">
                HAJAR
              </span>
              <span className="mt-1.5 block text-[8px] uppercase tracking-[0.24em] text-hj-gold-deep">
                by Nazish Ali
              </span>
            </span>
          </Link>
          <p>For booking an appointment</p>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 block text-hj-ink transition-opacity hover:opacity-60"
          >
            {SITE.whatsappDisplay}
          </a>
          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-hj-ink">
            Store hours
          </p>
          <p className="mt-2">Monday – Saturday</p>
          <p>By appointment</p>
          <a
            href={atelierMapsUrl()}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 block transition-colors hover:text-hj-ink"
          >
            {SITE.street}
            <br />
            {SITE.city}, {SITE.region}
          </a>
        </div>

        <FooterList title="About HAJAR" links={collectionLinks} />
        <FooterList title="Customer service" links={CUSTOMER_CARE} />
        <FooterList title="Information" links={INFORMATION} />
      </div>

      <div className="border-t border-hj-border">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-5 px-4 py-8 pb-24 md:px-8">
          <p className="text-center text-[12px] text-hj-muted">
            © {new Date().getFullYear()} {SITE.legalName}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-hj-ink">
            Get to know us
          </p>
          <ul className="flex gap-5">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="text-hj-ink transition-opacity hover:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
                    <path d={s.path} fill="currentColor" />
                  </svg>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                className="text-hj-ink transition-opacity hover:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.1-.3c0-.1 0-.3 0-.4s-.5-1.3-.7-1.8-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3s-.7.7-.7 1.8.8 2.1.9 2.2 1.5 2.4 3.7 3.3a12 12 0 0 0 1.2.4 2.8 2.8 0 0 0 1.3.1c.4-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.2-.4-.3Z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="text-hj-ink transition-opacity hover:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
