"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/Brand";
import { useCart } from "@/components/cart/CartProvider";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import { childCollections, HOUSES } from "@/lib/data";
import { cn } from "@/lib/clsx";

type NavItem = {
  href: string;
  label: string;
  match: string;
  children?: { href: string; label: string }[];
};

const NAV: NavItem[] = [
  { href: "/products?sort=newest", label: "New arrivals", match: "/products" },
  ...HOUSES.map((house) => {
    const kids = childCollections(house.slug);
    return {
      href: `/category/${house.slug}`,
      label: house.name,
      match: `/category/${house.slug}`,
      children: kids.length
        ? kids.map((k) => ({ href: `/category/${k.slug}`, label: k.name }))
        : undefined,
    };
  }),
  { href: "/journal", label: "Journal", match: "/journal" },
  { href: "/about", label: "Our story", match: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  /**
   * Two thresholds: the hairline and shadow appear as soon as the page moves,
   * but the lockup row only folds away past 96px. Collapsing at the same 8px
   * would flicker the whole header on a trackpad nudge.
   */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setCollapsed(window.scrollY > 96);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
    setSearchOpen(false);
  }

  const iconBtn =
    "flex h-9 w-9 items-center justify-center text-hj-ink transition-colors hover:text-hj-gold-deep";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white transition-shadow duration-300",
        scrolled
          ? "border-hj-border shadow-[0_1px_16px_rgb(18_16_12/0.04)]"
          : "border-transparent"
      )}
    >
      <div className="relative mx-auto max-w-[1500px] px-4 md:px-8">
        {/* Row 1 — centred lockup. Folds away on scroll from `lg`, where the
            nav row can carry the header on its own; below that it is the only
            row there is, so it stays. */}
        <div
          className={cn(
            "flex h-[64px] items-center justify-center overflow-hidden transition-[height,opacity,visibility] duration-300 md:h-[76px]",
            collapsed && "lg:invisible lg:h-0 lg:opacity-0"
          )}
        >
          <Link
            href="/"
            aria-label="HAJAR — home"
            className="flex items-center gap-3 md:gap-4"
          >
            <LogoMark size={42} />
            <span className="font-display text-[26px] font-medium leading-none tracking-brand text-hj-ink md:text-[34px]">
              HAJAR
            </span>
          </Link>
        </div>

        {/* Row 2 — nav, centred. Takes its own top padding once row 1 folds. */}
        <nav
          className={cn(
            "hidden justify-center pb-4 transition-[padding] duration-300 lg:flex",
            collapsed && "lg:pt-[14px]"
          )}
        >
          <ul className="flex items-center gap-9">
            {NAV.map((item) => {
              const childActive = item.children?.some((c) =>
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
                      "relative block py-1 text-[12px] uppercase tracking-[0.14em] transition-colors",
                      active
                        ? "text-hj-gold-deep"
                        : "text-hj-ink hover:text-hj-gold-deep"
                    )}
                  >
                    {item.label}
                  </Link>

                  {item.children && (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="min-w-[180px] border border-hj-border bg-white py-2 shadow-[0_12px_32px_rgb(10_10_10/0.07)]">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors",
                                pathname.startsWith(child.href)
                                  ? "text-hj-gold-deep"
                                  : "text-hj-ink-soft hover:text-hj-gold-deep"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Utilities — pinned right, centred on the lockup row until it folds,
            then centred on the slim bar that is left. */}
        <div
          className={cn(
            /* top values centre the 36px controls on the lockup row: (64-36)/2
               and (76-36)/2 */
            "absolute right-4 top-3.5 flex items-center gap-1 transition-[top,transform] duration-300 md:right-8 md:top-5",
            collapsed && "lg:top-1/2 lg:-translate-y-1/2"
          )}
        >
          <CurrencySwitcher className="mr-1 hidden md:block" />

          <Link href="/contact" aria-label="Account" className={iconBtn}>
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden>
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
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden>
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
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden>
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

        {/* Menu trigger — pinned left on small screens */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="absolute left-4 top-3.5 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:top-5 lg:hidden"
        >
          <span className="block h-px w-5 bg-hj-ink" />
          <span className="block h-px w-5 bg-hj-ink" />
          <span className="block h-px w-3.5 bg-hj-ink" />
        </button>
      </div>

      {/* Search drawer */}
      {searchOpen && (
        <div className="border-t border-hj-border bg-hj-cream">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-4 md:px-8"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for a piece, a collection, a fabric…"
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

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-hj-ink/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white">
            <div className="flex h-[64px] items-center justify-between border-b border-hj-border px-5">
              <span className="font-display text-2xl tracking-brand text-hj-ink">
                HAJAR
              </span>
              <button
                type="button"
                aria-label="Close menu"
                className="text-2xl leading-none text-hj-muted"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="flex items-center justify-between border-b border-hj-border px-5 py-3">
              <span className="text-[11px] uppercase tracking-[0.16em] text-hj-muted">
                Currency
              </span>
              <CurrencySwitcher />
            </div>

            <nav className="flex flex-col overflow-y-auto px-5 py-4">
              <Link
                href="/products"
                className="border-b border-hj-border py-4 text-[13px] uppercase tracking-[0.14em] text-hj-ink"
              >
                Shop all
              </Link>
              {NAV.map((item) => (
                <div key={item.href} className="border-b border-hj-border">
                  <Link
                    href={item.href}
                    className="block py-4 text-[13px] uppercase tracking-[0.14em] text-hj-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="-mt-1 pb-3 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-2 text-[12px] uppercase tracking-[0.14em] text-hj-muted"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-auto border-t border-hj-border px-5 py-5">
              <p className="eyebrow">Made in Lahore</p>
              <p className="mt-2 text-sm text-hj-muted">
                Made to order · worldwide shipping.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
