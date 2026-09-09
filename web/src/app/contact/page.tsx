import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/app/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & appointments",
  description:
    "Message the HAJAR atelier in Lahore about sizing, made-to-order couture or a bridal fitting appointment.",
  path: "/contact",
});

export default function ContactPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs trail={trail} />

      <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 font-display text-5xl leading-tight text-hj-ink md:text-6xl">
            Talk to the atelier
          </h1>
          <div className="rule-gold mt-5 h-px w-24" />
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-hj-muted">
            Sizing questions, made-to-order enquiries, bridal appointments — the
            fastest answer is always WhatsApp, but the form works just as well.
          </p>

          <dl className="mt-12 space-y-8 border-t border-hj-border pt-10">
            <div>
              <dt className="eyebrow">WhatsApp</dt>
              <dd className="mt-2">
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-display text-2xl text-hj-ink transition-colors hover:text-hj-gold-deep"
                >
                  +{SITE.whatsapp}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-display text-2xl text-hj-ink transition-colors hover:text-hj-gold-deep"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Atelier</dt>
              <dd className="mt-2 text-sm leading-relaxed text-hj-ink-soft">
                {SITE.city}, {SITE.country}
                <br />
                Monday to Saturday, by appointment
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-hj-border bg-hj-cream p-6 md:p-9">
          <h2 className="font-display text-2xl text-hj-ink">Send a message</h2>
          <div className="rule-gold mt-3 h-px w-14" />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
