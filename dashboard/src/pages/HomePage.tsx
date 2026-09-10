import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  formatDate,
  formatPrice,
  type AdminCategory,
  type AdminInquiry,
  type AdminOrder,
  type AdminProduct,
} from "../lib/data";
import { StatCard } from "../components/StatCard";

const SHORTCUTS = [
  {
    to: "/products/new",
    title: "Add a piece",
    desc: "Upload imagery, set sizing and publish to the storefront.",
  },
  {
    to: "/orders",
    title: "Orders",
    desc: "Cash-on-delivery bookings with full customer details.",
  },
  {
    to: "/inquiries",
    title: "Enquiries",
    desc: "Appointment requests and questions from the contact form.",
  },
  {
    to: "/categories",
    title: "Collections",
    desc: "ZOUQ 1 · ZOUQ 2 · BY NAZISH ALI",
  },
];

export function HomePage() {
  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get<AdminProduct[]>("/products")).data,
  });
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await api.get<AdminOrder[]>("/orders")).data,
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get<AdminCategory[]>("/categories")).data,
  });
  const inquiries = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => (await api.get<AdminInquiry[]>("/inquiries")).data,
  });

  const rows = products.data ?? [];
  const orderRows = orders.data ?? [];

  const published = rows.filter((p) => p.status === "published").length;
  const drafts = rows.filter((p) => p.status === "draft").length;
  const lowStock = rows.filter((p) => p.stock > 0 && p.stock <= 3);
  const outOfStock = rows.filter((p) => p.stock === 0).length;

  const openOrders = orderRows.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  );
  const revenue = orderRows
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const inquiryRows = inquiries.data ?? [];
  const newInquiries = inquiryRows.filter((i) => i.status === "new").length;

  const loading = products.isLoading || orders.isLoading;

  return (
    <div>
      <header>
        <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
          Overview
        </p>
        <h1 className="mt-2 font-display text-4xl text-hj-ink">
          Good to see you.
        </h1>
        <div className="rule-gold mt-3 h-px w-20" />
        <p className="mt-3 text-sm text-hj-muted">
          {loading
            ? "Loading the atelier…"
            : `${rows.length} pieces across ${categories.data?.length ?? 0} collections · ${orderRows.length} orders to date`}
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Published"
          value={String(published)}
          hint={`${drafts} in draft`}
        />
        <StatCard
          label="Open orders"
          value={String(openOrders.length)}
          hint="Pending or confirmed"
          tone="gold"
        />
        <StatCard
          label="Booked value"
          value={formatPrice(revenue)}
          hint="Excludes cancelled"
        />
        <StatCard
          label="New enquiries"
          value={String(newInquiries)}
          hint={`${inquiryRows.length} in the inbox`}
          tone={newInquiries > 0 ? "gold" : "default"}
        />
        <StatCard
          label="Needs restock"
          value={String(lowStock.length + outOfStock)}
          hint={`${outOfStock} out of stock`}
          tone={lowStock.length + outOfStock > 0 ? "danger" : "default"}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group rounded-sm border border-hj-border bg-white p-5 transition-colors hover:border-hj-gold"
          >
            <p className="font-display text-xl text-hj-ink">{s.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-hj-muted">
              {s.desc}
            </p>
            <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep opacity-0 transition-opacity group-hover:opacity-100">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-hj-border bg-white">
          <div className="flex items-center justify-between border-b border-hj-border px-5 py-4">
            <h2 className="font-display text-xl text-hj-ink">Latest orders</h2>
            <Link
              to="/orders"
              className="tap-target text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
            >
              All orders
            </Link>
          </div>
          <ul className="divide-y divide-hj-border">
            {orderRows.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-hj-ink">
                    {o.customer.fullName}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-hj-muted">
                    {o.orderNumber} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm text-hj-ink">{formatPrice(o.total)}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-hj-muted">
                    {o.status}
                  </p>
                </div>
              </li>
            ))}
            {!orders.isLoading && orderRows.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-hj-muted">
                No orders yet — they land here the moment one is placed.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-sm border border-hj-border bg-white">
          <div className="flex items-center justify-between border-b border-hj-border px-5 py-4">
            <h2 className="font-display text-xl text-hj-ink">Low stock</h2>
            <Link
              to="/products"
              className="tap-target text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
            >
              All products
            </Link>
          </div>
          <ul className="divide-y divide-hj-border">
            {lowStock.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                {p.thumb ? (
                  <img
                    src={p.thumb}
                    alt=""
                    className="h-12 w-10 rounded-sm object-cover"
                  />
                ) : (
                  <div className="h-12 w-10 rounded-sm bg-hj-sand" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-hj-ink">{p.name}</p>
                  <p className="text-[11px] text-hj-muted">{p.category}</p>
                </div>
                <span className="shrink-0 text-sm text-hj-danger">
                  {p.stock} left
                </span>
              </li>
            ))}
            {!products.isLoading && lowStock.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-hj-muted">
                Every piece is comfortably in stock.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
