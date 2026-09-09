import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Wordmark } from "../components/Logo";

const NAV = [
  { to: "/", label: "Overview", end: true },
  { to: "/orders", label: "Orders" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Collections" },
  { to: "/instagram", label: "Instagram" },
  { to: "/analytics", label: "Analytics" },
];

export function AdminLayout() {
  const { signOut, email } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-hj-cream text-hj-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-hj-border bg-white transition-transform md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-hj-border px-5">
          <Wordmark subtitle="Atelier admin" />
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `relative rounded-sm px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-hj-gold-wash text-hj-ink"
                    : "text-hj-muted hover:bg-hj-cream hover:text-hj-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-1.5 left-0 w-0.5 bg-hj-gold" />
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-hj-border p-3">
          <p className="truncate px-3 text-[11px] text-hj-muted">
            {email ?? "Signed in"}
          </p>
          <button
            type="button"
            className="mt-1 w-full rounded-sm px-3 py-2 text-left text-sm text-hj-muted transition-colors hover:text-hj-danger"
            onClick={() => {
              signOut();
              navigate("/sign-in");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-hj-ink/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-hj-border bg-white px-4 md:px-8">
          <button
            type="button"
            className="text-sm text-hj-muted md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            Menu
          </button>
          <p className="hidden text-[10px] uppercase tracking-[0.18em] text-hj-muted md:block">
            HAJAR · Couture operations
          </p>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
          >
            View storefront ↗
          </a>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
