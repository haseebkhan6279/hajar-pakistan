"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/Brand";
import { useCart } from "@/components/cart/CartProvider";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { CURRENCIES } from "@/lib/currency";
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
  const { code: currency, setCode: setCurrency } = useCurrency();
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  /** A tap on any drawer link navigates; the drawer has to follow it shut. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /**
   * While the drawer is open the page behind it must not scroll — on iOS a
   * drag over the overlay otherwise moves the page underneath and the drawer
   * appears stuck. Escape closes it, as with any other modal surface.
   */
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
            <LogoMark size={44} />
            {/* The roundel already carries the name. On a phone the wordmark
                beside it crowds the row against the menu and bag controls, so
                only the mark shows; the link keeps its aria-label. */}
            <span className="hidden font-display text-[26px] font-medium leading-none tracking-brand text-hj-ink md:inline md:text-[34px]">
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

      {/*
        Mobile drawer.

        Always mounted so it can slide rather than appear. `invisible` is what
        keeps it out of the tab order while closed, and because visibility is
        transitioned it flips only after the slide-out finishes.
      */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden",
          menuOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-hj-ink/45 backdrop-blur-[2px] transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <aside
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[88%] max-w-[380px] flex-col bg-hj-canvas shadow-[0_0_60px_rgb(10_10_10/0.25)] transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-hj-border pl-5 pr-2">
            <Link
              href="/"
              aria-label="HAJAR — home"
              className="flex items-center gap-2.5"
            >
              <LogoMark size={32} />
              <span className="font-display text-xl tracking-brand text-hj-ink">
                HAJAR
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-hj-muted transition-colors hover:text-hj-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="m2 2 12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto overscroll-contain">
            <ul className="px-2 py-3">
              {[{ href: "/products", label: "Shop all", match: "/products" }, ...NAV].map(
                (item) => {
                  const children = "children" in item ? item.children : undefined;
                  const active =
                    pathname === item.match ||
                    pathname.startsWith(`${item.match}/`);
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "relative flex items-center px-4 py-3.5 font-display text-[19px] transition-colors",
                          active
                            ? "text-hj-gold-deep"
                            : "text-hj-ink hover:text-hj-gold-deep"
                        )}
                      >
                        {active && (
                          <span className="absolute inset-y-2.5 left-0 w-0.5 bg-hj-gold" />
                        )}
                        {item.label}
                      </Link>

                      {children && (
                        <ul className="flex flex-wrap gap-2 px-4 pb-3.5">
                          {children.map((child) => {
                            const on = pathname.startsWith(child.href);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "flex h-9 items-center border px-3.5 text-[11px] uppercase tracking-[0.14em] transition-colors",
                                    on
                                      ? "border-hj-gold bg-hj-gold-wash text-hj-gold-deep"
                                      : "border-hj-border text-hj-ink-soft hover:border-hj-gold-soft"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }
              )}
            </ul>

            {/*
              Currency as chips, not the header's dropdown. That control opens
              an absolutely positioned panel, which inside a drawer floats over
              the links it is supposed to sit among; six codes fit on two rows
              and every one is a 44px target.
            */}
            <div className="border-t border-hj-border px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
                Currency
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CURRENCIES.map((c) => {
                  const on = c.code === currency;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      aria-pressed={on}
                      className={cn(
                        "h-11 min-w-[62px] border px-3 text-[11px] tracking-[0.12em] transition-colors",
                        on
                          ? "border-hj-gold bg-hj-gold-wash text-hj-gold-deep"
                          : "border-hj-border text-hj-ink-soft hover:border-hj-gold-soft"
                      )}
                    >
                      {c.code}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-hj-muted">
                Orders are placed and settled in PKR. Other currencies are
                indicative only.
              </p>
            </div>
          </nav>

          <div className="shrink-0 border-t border-hj-border bg-hj-cream px-6 py-5">
            <Link
              href="/contact"
              className="flex h-12 w-full items-center justify-center bg-hj-ink text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
            >
              Book an appointment
            </Link>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-hj-muted">
              Made in Lahore
            </p>
            <p className="mt-1.5 text-[13px] text-hj-ink-soft">
              Made to order · worldwide shipping
            </p>
          </div>
        </aside>
      </div>

    </header>
  );
}
