import Link from "next/link";
import { LogoMark } from "@/components/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { HOUSES } from "@/lib/data";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-28 text-center md:py-36">
      <LogoMark size={52} className="mx-auto" />
      <p className="mt-10 font-display text-7xl text-hj-border-strong">404</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-hj-ink">
        This piece has moved on.
      </h1>
      <div className="rule-gold mx-auto mt-6 h-px w-24" />
      <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-hj-muted">
        The page you were looking for is not here. It may have sold out, or the
        link may be out of date.
      </p>

      <div className="mt-10">
        <ButtonLink href="/products">Browse the collections</ButtonLink>
      </div>

      <nav className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-hj-border pt-8">
        {HOUSES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="text-[11px] uppercase tracking-[0.14em] text-hj-muted transition-colors hover:text-hj-gold-deep"
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
