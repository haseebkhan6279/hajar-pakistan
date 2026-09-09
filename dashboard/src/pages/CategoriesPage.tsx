import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { slugify, type AdminCategory } from "../lib/data";
import { DeleteModal } from "../components/DeleteModal";
import { Toast } from "../components/Toast";

export function CategoriesPage() {
  const [rows, setRows] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<AdminCategory[]>("/categories");
      setRows(data);
    } catch {
      setToast("Failed to load collections");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name"));
    const payload = {
      name,
      slug: slugify(String(fd.get("slug") || name)),
      tagline: String(fd.get("tagline") ?? ""),
      image: String(fd.get("image") ?? ""),
      sortOrder: Number(fd.get("sortOrder") ?? 0),
      parentSlug: String(fd.get("parentSlug") ?? ""),
    };

    try {
      if (editing) {
        const { data } = await api.patch<AdminCategory>(
          `/categories/${editing.id}`,
          payload
        );
        setRows((r) => r.map((c) => (c.id === editing.id ? data : c)));
        setEditing(null);
        setToast("Collection updated");
      } else {
        const { data } = await api.post<AdminCategory>("/categories", payload);
        setRows((r) => [...r, data]);
        setCreating(false);
        setToast("Collection created");
      }
    } catch {
      setToast("Save failed — is the slug already taken?");
    }
  }

  const formOpen = creating || !!editing;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
            Catalogue
          </p>
          <h1 className="mt-2 font-display text-4xl text-hj-ink">
            Collections
          </h1>
          <div className="rule-gold mt-3 h-px w-20" />
          <p className="mt-3 text-sm text-hj-muted">
            {loading ? "Loading…" : `${rows.length} collections`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="h-11 rounded-sm bg-hj-ink px-5 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
        >
          New collection
        </button>
      </div>

      {formOpen && (
        <form
          key={editing?.id ?? "new"}
          onSubmit={save}
          className="mt-7 rounded-sm border border-hj-border bg-white p-5"
        >
          <h2 className="font-display text-xl text-hj-ink">
            {editing ? `Edit ${editing.name}` : "New collection"}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Name
              </span>
              <input
                name="name"
                required
                placeholder="ZOUQ 3"
                defaultValue={editing?.name}
                className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Slug
              </span>
              <input
                name="slug"
                placeholder="zouq-3"
                defaultValue={editing?.slug}
                className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 font-mono text-sm focus:border-hj-gold focus:outline-none"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Tagline
              </span>
              <input
                name="tagline"
                placeholder="Signature hand-embellished formals."
                defaultValue={editing?.tagline}
                className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Cover image URL
              </span>
              <input
                name="image"
                placeholder="https://res.cloudinary.com/…"
                defaultValue={editing?.image}
                className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Sort order
              </span>
              <input
                name="sortOrder"
                type="number"
                defaultValue={editing?.sortOrder ?? rows.length + 1}
                className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Sits under
              </span>
              <select
                name="parentSlug"
                defaultValue={editing?.parentSlug ?? ""}
                className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
              >
                <option value="">Top level — its own house</option>
                {rows
                  .filter((r) => !r.parentSlug && r.id !== editing?.id)
                  .map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
              </select>
              <span className="mt-1.5 block text-[11px] text-hj-muted">
                Products are filed against the edit they belong to, never the
                house. A house shows the total of its edits.
              </span>
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="h-11 rounded-sm bg-hj-ink px-6 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
            >
              Save
            </button>
            <button
              type="button"
              className="h-11 rounded-sm border border-hj-border px-5 text-[11px] uppercase tracking-[0.16em] text-hj-ink-soft"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-x-auto rounded-sm border border-hj-border bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-hj-border bg-hj-cream text-[10px] uppercase tracking-[0.14em] text-hj-muted">
            <tr>
              <th className="px-4 py-3.5 font-medium">Collection</th>
              <th className="px-4 py-3.5 font-medium">Slug</th>
              <th className="px-4 py-3.5 font-medium">Order</th>
              <th className="px-4 py-3.5 font-medium">Published pieces</th>
              <th className="px-4 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hj-border">
            {rows.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-hj-cream/60">
                <td className="px-4 py-3.5">
                  <div
                    className={`flex items-center gap-3 ${c.parentSlug ? "pl-6" : ""}`}
                  >
                    {c.image ? (
                      <img
                        src={c.image}
                        alt=""
                        className="h-12 w-10 rounded-sm object-cover"
                      />
                    ) : (
                      <div className="h-12 w-10 rounded-sm bg-hj-sand" />
                    )}
                    <div>
                      <p className="text-hj-ink">
                        {c.parentSlug && (
                          <span className="mr-1.5 text-hj-border-strong">└</span>
                        )}
                        {c.name}
                      </p>
                      {c.tagline && (
                        <p className="mt-0.5 text-[11px] text-hj-muted">
                          {c.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-[11px] text-hj-muted">
                  {c.slug}
                </td>
                <td className="px-4 py-3.5 text-hj-muted">{c.sortOrder}</td>
                <td className="px-4 py-3.5">{c.productCount}</td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-gold-deep"
                      onClick={() => {
                        setEditing(c);
                        setCreating(false);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-danger"
                      onClick={() => setDeleteId(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-16 text-center text-sm text-hj-muted"
                >
                  No collections yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        open={!!deleteId}
        title="Delete this collection?"
        description="Products filed under it stay in the catalogue but will need reassigning before they show on the storefront."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            await api.delete(`/categories/${deleteId}`);
            setRows((r) => r.filter((c) => c.id !== deleteId));
            setToast("Collection deleted");
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
