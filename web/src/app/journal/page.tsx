import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { JOURNAL } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Journal",
  description:
    "Notes from the HAJAR atelier — how pieces are made, how to wear them through the wedding season, and how to care for hand embellishment.",
  path: "/journal",
});

export default function JournalPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Journal", href: "/journal" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs trail={trail} />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Journal</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-hj-ink md:text-6xl">
          Notes from the atelier
        </h1>
        <div className="rule-gold mt-5 h-px w-24" />
        <p className="mt-6 text-[15px] leading-relaxed text-hj-muted">
          Craft, styling and care — written by the people who make the clothes.
        </p>
      </header>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {JOURNAL.map((post) => (
          <article key={post.slug} className="border-t border-hj-border pt-6">
            <p className="eyebrow">
              {post.category} · {post.readTime}
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-hj-ink">
              <Link
                href={`/journal/${post.slug}`}
                className="transition-colors hover:text-hj-gold-deep"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-hj-muted">
              {post.excerpt}
            </p>
            <time
              dateTime={post.date}
              className="mt-4 block text-[11px] uppercase tracking-[0.14em] text-hj-muted"
            >
              {new Date(post.date).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
}
