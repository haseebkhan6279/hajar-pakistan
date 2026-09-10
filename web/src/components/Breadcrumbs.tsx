import Link from "next/link";

export function Breadcrumbs({
  trail,
}: {
  trail: { name: string; href: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-hj-muted">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span className="text-hj-ink-soft">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="tap-target transition-colors hover:text-hj-gold-deep"
                >
                  {item.name}
                </Link>
              )}
              {!last && <span aria-hidden className="text-hj-border-strong">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
