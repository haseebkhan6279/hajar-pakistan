import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { POLICIES } from "@/lib/policies";
import { breadcrumbSchema, pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Hajar by Nazish Ali collects, uses and protects the personal information you share when you place an order or get in touch.",
  path: "/privacy",
});

/**
 * NOTE FOR THE BUSINESS
 * --------------------
 * Unlike the other policies, this one was NOT supplied. It is a draft written
 * to describe what this website actually does — no card data is taken, orders
 * are requests confirmed by the team, and the only third parties are the
 * hosting, image and courier providers. It should be reviewed by whoever
 * advises you on the other policies before you rely on it.
 */
const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "When you submit an order request we collect your name, phone number, delivery address, country and — if you choose to give one — your email address. We also store the pieces you selected, including size or measurement notes, so we can confirm and produce your order.",
      "If you contact us through the website, WhatsApp or email, we keep that correspondence so we can answer you and keep a record of what was agreed.",
      "If you subscribe to our newsletter, we keep the email address you provide until you ask us to remove it.",
    ],
  },
  {
    heading: "What we do not collect",
    body: [
      "No card or bank details are taken on this website. Payment is arranged directly with our team after your order is confirmed, as described in our Payment Policy.",
      "We do not ask for identity documents, and we do not knowingly collect information from children.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "Your details are used to confirm your order, take measurements where a piece is made to measure, arrange payment, produce and dispatch the order, and answer any question you raise about it.",
      "We may contact you about that specific order by phone, WhatsApp or email. We do not add you to a marketing list unless you ask us to.",
    ],
  },
  {
    heading: "Who else sees it",
    body: [
      "The courier handling your delivery, and only the details needed to complete it. For international orders, the information customs authorities require in the destination country.",
      "Our website, database and images are hosted by third-party service providers who process this data on our behalf under their own security commitments.",
      "We do not sell your personal information, and we do not share it for anyone else's marketing.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Order records are kept for as long as needed to fulfil the order, handle any exchange or defect claim, and meet our record-keeping obligations. Enquiries that do not become orders are kept only as long as they are useful in answering you.",
    ],
  },
  {
    heading: "Cookies and website data",
    body: [
      "This website stores a small amount of data in your own browser: the contents of your bag, and a record that you have answered the cookie notice or dismissed the announcement bar. This stays on your device and is not sent to us except when you place an order.",
      "If analytics is enabled on this site it records anonymous page views so we can see which collections are viewed. Clearing site data in your browser removes all of the above; your bag will empty and nothing else is affected.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You may ask us what personal information we hold about you, ask us to correct it, or ask us to delete it where we are not required to keep it. You may also ask us to stop contacting you.",
      "Write to us using the details below and we will respond as soon as we reasonably can.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The version displayed on this page at the relevant time is the one that applies.",
    ],
  },
];

export default function PrivacyPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs trail={trail} />

      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <article className="max-w-2xl">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-hj-ink">
            Privacy Policy
          </h1>
          <div className="rule-gold mt-5 h-px w-24" />
          <p className="mt-7 text-[15px] leading-relaxed text-hj-ink-soft">
            At Hajar by Nazish Ali we collect only what we need to confirm your
            order, make your piece, and get it to you. This policy explains what
            that is, how it is used, and who else sees it.
          </p>

          <div className="mt-12 space-y-11">
            {SECTIONS.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-hj-gold-deep">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((para, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-[1.8] text-hj-ink-soft"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

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
        </article>

        <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Policies</p>
          <ul className="mt-5 space-y-3 border-t border-hj-border pt-5">
            {POLICIES.map((policy) => (
              <li key={policy.slug}>
                <Link
                  href={`/policies/${policy.slug}`}
                  className="text-sm text-hj-muted transition-colors hover:text-hj-gold-deep"
                >
                  {policy.navLabel}
                </Link>
              </li>
            ))}
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
