"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import { LogoMark } from "@/components/Brand";
import { childCollections, HOUSES } from "@/lib/data";
import { cn } from "@/lib/clsx";

const NAV = [
  ...HOUSES.map((house) => {
    const kids = childCollections(house.slug);
    return {
      href: `/category/${house.slug}`,
      label: house.name,
      match: `/category/${house.slug}`,
      children: kids.map((k) => ({
        href: `/category/${k.slug}`,
        label: k.name,
      })),
    };
  }),
  { href: "/products?sort=newest", label: "New arrivals", match: "/products", children: [] },
  { href: "/journal", label: "Journal", match: "/journal", children: [] },
  { href: "/about", label: "Our story", match: "/about", children: [] },
];

const iconBtn =
  "flex h-10 w-10 items-center justify-center text-hj-ink transition-colors hover:text-hj-gold-deep";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Desktop folds the logo row away once the page is scrolled. The two
  // thresholds differ because collapsing the sticky row shortens the page,
  // and a single cut-off would flicker back and forth around it.
  useEffect(() => {
    const onScroll = () =>
      setScrolled((was) => (was ? window.scrollY > 20 : window.scrollY > 120));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div
          className={cn(
            "flex h-[72px] items-center justify-between transition-[height,opacity] duration-300 md:h-[80px]",
            scrolled && "lg:pointer-events-none lg:h-0 lg:overflow-hidden lg:opacity-0"
          )}
        >
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className="block h-px w-5 bg-hj-ink" />
            <span className="block h-px w-5 bg-hj-ink" />
            <span className="block h-px w-3.5 bg-hj-ink" />
          </button>

          <Link
            href="/"
            aria-label="HAJAR by Nazish Ali — home"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 md:gap-3"
          >
            <LogoMark size={40} />
            {/* Phones show the mark alone */}
            <span className="hidden flex-col leading-none lg:flex">
              <span className="font-display text-[20px] font-light tracking-[0.36em] text-hj-ink md:text-[24px]">
                HAJAR
              </span>
              <span className="hj-byline mt-1.5">
                by Nazish Ali
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center">
            <CurrencySwitcher className="mr-1" />
            <Link href="/contact" aria-label="Account" className={`${iconBtn} hidden md:flex`}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <circle cx="10" cy="6.5" r="3.2" stroke="currentColor" strokeWidth="1.1" />
                <path
                  d="M3.8 17c0-3.2 2.8-5.2 6.2-5.2s6.2 2 6.2 5.2"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className={iconBtn}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <circle cx="9" cy="9" r="5.8" stroke="currentColor" strokeWidth="1.1" />
                <path
                  d="M13.4 13.4 17.2 17.2"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
              onClick={openCart}
              className={cn(iconBtn, "relative")}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M3.6 6.4h12.8L15.4 17H4.6L3.6 6.4Z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.4 6.4a2.6 2.6 0 0 1 5.2 0"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hj-gold px-1 text-[10px] font-medium text-hj-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav
          className={cn(
            "hidden justify-center pb-4 transition-[padding] duration-300 lg:flex",
            scrolled && "pt-4"
          )}
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {NAV.map((item) => {
              const childActive = item.children.some((c) =>
                pathname.startsWith(c.href)
              );
              const active =
                pathname === item.match ||
                pathname.startsWith(`${item.match}/`) ||
                childActive;
              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-1 text-[11px] uppercase tracking-[0.16em] transition-colors",
                      active
                        ? "text-hj-gold-deep"
                        : "text-hj-ink hover:text-hj-gold-deep"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {searchOpen && (
        <div className="border-t border-hj-border bg-hj-cream">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-4 md:px-8"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="h-11 flex-1 border-b border-hj-border-strong bg-transparent px-1 text-sm placeholder:text-hj-muted focus:border-hj-gold focus:outline-none"
            />
            <button
              type="submit"
              className="h-11 bg-hj-ink px-7 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
            >
              Search
            </button>
          </form>
        </div>
      )}

      <div
        className={cn(
          "fixed inset-0 z-50 bg-hj-ink text-hj-gold-soft transition-[visibility,opacity] duration-300 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <span className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-[0.32em]">HAJAR</span>
              <span className="hj-byline mt-1">
                by Nazish Ali
              </span>
            </span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="m2 2 12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto px-6 pb-16">
          <ul>
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-white/10">
                <Link
                  href={item.href}
                  className="flex items-center py-4 text-[13px] uppercase tracking-[0.18em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
