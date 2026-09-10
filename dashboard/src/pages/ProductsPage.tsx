import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  formatPrice,
  type AdminCategory,
  type AdminProduct,
} from "../lib/data";
import { DeleteModal } from "../components/DeleteModal";
import { Toast } from "../components/Toast";

export function ProductsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [rows, setRows] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api
      .get<AdminCategory[]>("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get<AdminProduct[]>("/products", {
          params: { q: q || undefined, status: status || undefined },
        });
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) setToast("Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, status]);

  const visible = category
    ? rows.filter((p) => p.category === category)
    : rows;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
            Catalogue
          </p>
          <h1 className="mt-2 font-display text-4xl text-hj-ink">Products</h1>
          <div className="rule-gold mt-3 h-px w-20" />
          <p className="mt-3 text-sm text-hj-muted">
            {loading ? "Loading…" : `${visible.length} pieces`}
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex h-11 items-center rounded-sm bg-hj-ink px-5 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
        >
          New product
        </Link>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or slug"
          className="h-11 min-w-[220px] flex-1 rounded-sm border border-hj-border bg-white px-3.5 text-sm transition-colors focus:border-hj-gold focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-sm border border-hj-border bg-white px-3 text-sm transition-colors focus:border-hj-gold focus:outline-none"
        >
          <option value="">All collections</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-sm border border-hj-border bg-white px-3 text-sm transition-colors focus:border-hj-gold focus:outline-none"
        >
          <option value="">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-sm border border-hj-border bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-hj-border bg-hj-cream text-[10px] uppercase tracking-[0.14em] text-hj-muted">
            <tr>
              <th className="px-4 py-3.5 font-medium">Piece</th>
              <th className="px-4 py-3.5 font-medium">Collection</th>
              <th className="px-4 py-3.5 font-medium">Price</th>
              <th className="px-4 py-3.5 font-medium">Sizes</th>
              <th className="px-4 py-3.5 font-medium">Stock</th>
              <th className="px-4 py-3.5 font-medium">Status</th>
              <th className="px-4 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hj-border">
            {visible.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-hj-cream/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.thumb ? (
                      <img
                        src={p.thumb}
                        alt=""
                        className="h-14 w-11 rounded-sm object-cover"
                      />
                    ) : (
                      <div className="h-14 w-11 rounded-sm bg-hj-sand" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-hj-ink">{p.name}</p>
                      <p className="truncate font-mono text-[11px] text-hj-muted">
                        {p.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-hj-muted">{p.category}</td>
                <td className="px-4 py-3">
                  <span className="text-hj-ink">{formatPrice(p.price)}</span>
                  {p.compareAtPrice ? (
                    <span className="ml-2 text-[11px] text-hj-muted line-through">
                      {formatPrice(p.compareAtPrice)}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[11px] text-hj-muted">
                  {p.sizes?.length ? p.sizes.join(" · ") : "—"}
                </td>
                <td
                  className={`px-4 py-3 ${p.stock <= 3 ? "text-hj-danger" : "text-hj-ink"}`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] ${
                      p.status === "published"
                        ? "text-hj-success"
                        : "text-hj-muted"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        p.status === "published"
                          ? "bg-hj-success"
                          : "bg-hj-border-strong"
                      }`}
                    />
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link
                      to={`/products/${p.id}/edit`}
                      className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-gold-deep"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-danger"
                      onClick={() => setDeleteId(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && visible.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-16 text-center text-sm text-hj-muted"
                >
                  Nothing here yet.{" "}
                  <Link
                    to="/products/new"
                    className="text-hj-gold-deep hover:underline"
                  >
                    Add your first piece
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        open={!!deleteId}
        title="Delete this piece?"
        description="It will be removed from the catalogue and the storefront immediately. This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            await api.delete(`/products/${deleteId}`);
            setRows((r) => r.filter((p) => p.id !== deleteId));
            setToast("Product deleted");
          } catch {
            setToast("Delete failed");
          } finally {
            setDeleteId(null);
          }
        }}
      />
      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
