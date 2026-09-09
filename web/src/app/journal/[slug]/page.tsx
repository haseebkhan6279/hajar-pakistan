import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { getPost, JOURNAL } from "@/lib/data";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return JOURNAL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Note not found" };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${post.slug}`,
  });
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = JOURNAL.filter((p) => p.slug !== post.slug);

  const trail = [
    { name: "Home", href: "/" },
    { name: "Journal", href: "/journal" },
    { name: post.title, href: `/journal/${post.slug}` },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={[articleSchema(post), breadcrumbSchema(trail)]} />
      <Breadcrumbs trail={trail} />

      <article className="mx-auto mt-10 max-w-2xl">
        <p className="eyebrow">
          {post.category} · {post.readTime}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-hj-ink md:text-5xl">
          {post.title}
        </h1>
        <div className="rule-gold mt-6 h-px w-24" />
        <time
          dateTime={post.date}
          className="mt-6 block text-[11px] uppercase tracking-[0.14em] text-hj-muted"
        >
          {new Date(post.date).toLocaleDateString("en-PK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>

        <div className="mt-10 space-y-6">
          {post.body.map((para, i) => (
            <p key={i} className="text-[16px] leading-[1.85] text-hj-ink-soft">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-14 border-t border-hj-border pt-8">
          <ButtonLink href="/products" variant="outline">
            Shop the collections
          </ButtonLink>
        </div>
      </article>

      {others.length > 0 && (
        <section className="mx-auto mt-20 max-w-2xl border-t border-hj-border pt-10">
          <p className="eyebrow">Keep reading</p>
          <ul className="mt-6 space-y-5">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/journal/${p.slug}`}
                  className="group block"
                >
                  <p className="font-display text-xl text-hj-ink transition-colors group-hover:text-hj-gold-deep">
                    {p.title}
                  </p>
                  <p className="mt-1 text-sm text-hj-muted">{p.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
