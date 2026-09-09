import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import {
  PIECE_PRESET,
  SIZE_PRESET,
  formatPrice,
  slugify,
  type AdminCategory,
  type AdminProduct,
  type ProductColor,
  type ProductStatus,
} from "../lib/data";
import { ImageUploader } from "../components/ImageUploader";
import { Toast } from "../components/Toast";
import {
  ListField,
  SectionCard,
  SelectField,
  TextAreaField,
  TextField,
} from "../components/Field";

type FormState = {
  name: string;
  slug: string;
  category: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  status: ProductStatus;
  fabric: string;
  pieces: string;
  description: string;
  tags: string[];
  highlights: string[];
  sizes: string[];
  colors: ProductColor[];
  specifications: { key: string; value: string }[];
  images: string[];
  seoTitle: string;
  seoDescription: string;
};

const EMPTY: FormState = {
  name: "",
  slug: "",
  category: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  status: "draft",
  fabric: "",
  pieces: "",
  description: "",
  tags: [],
  highlights: [],
  sizes: [],
  colors: [],
  specifications: [],
  images: [],
  seoTitle: "",
  seoDescription: "",
};

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    api
      .get<AdminCategory[]>("/categories")
      .then(({ data }) => {
        setCategories(data);
        setForm((f) => (f.category || !data[0] ? f : { ...f, category: data[0].name }));
      })
      .catch(() => setError("Could not load collections"));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<AdminProduct>(`/products/${id}`)
      .then(({ data }) => {
        setSlugTouched(true);
        setForm({
          name: data.name,
          slug: data.slug,
          category: data.category,
          price: String(data.price),
          compareAtPrice: data.compareAtPrice ? String(data.compareAtPrice) : "",
          stock: String(data.stock),
          status: data.status,
          fabric: data.fabric ?? "",
          pieces: data.pieces ?? "",
          description: data.description ?? "",
          tags: data.tags ?? [],
          highlights: data.highlights ?? [],
          sizes: data.sizes ?? [],
          colors: data.colors ?? [],
          specifications: data.specifications ?? [],
          images: data.images ?? [],
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
        });
      })
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      category: form.category,
      price: Number(form.price || 0),
      compareAtPrice: form.compareAtPrice
        ? Number(form.compareAtPrice)
        : undefined,
      stock: Number(form.stock || 0),
      status: form.status,
      fabric: form.fabric.trim(),
      pieces: form.pieces,
      description: form.description.trim(),
      tags: form.tags,
      highlights: form.highlights,
      sizes: form.sizes,
      colors: form.colors.filter((c) => c.name.trim()),
      specifications: form.specifications.filter((s) => s.key.trim()),
      images: form.images,
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
    };

    try {
      if (isEdit) {
        await api.patch(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/products");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          .response?.data?.message ?? "Save failed";
      setError(Array.isArray(message) ? message.join(", ") : String(message));
      setToast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-hj-muted">Loading product…</p>;
  }

  const margin =
    form.compareAtPrice && Number(form.compareAtPrice) > Number(form.price)
      ? Math.round(
          ((Number(form.compareAtPrice) - Number(form.price)) /
            Number(form.compareAtPrice)) *
            100
        )
      : null;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/products"
            className="text-[11px] uppercase tracking-[0.14em] text-hj-muted hover:text-hj-ink"
          >
            ← Products
          </Link>
          <h1 className="mt-3 font-display text-4xl text-hj-ink">
            {isEdit ? "Edit piece" : "New piece"}
          </h1>
          <div className="rule-gold mt-3 h-px w-20" />
        </div>
        <div className="flex gap-2">
          <Link
            to="/products"
            className="inline-flex h-11 items-center rounded-sm border border-hj-border px-5 text-[11px] uppercase tracking-[0.16em] text-hj-ink-soft transition-colors hover:border-hj-border-strong"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center rounded-sm bg-hj-ink px-6 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-sm border border-hj-danger/30 bg-hj-danger/5 px-4 py-3 text-sm text-hj-danger">
          {error}
        </p>
      )}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <SectionCard title="The piece">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Name"
                required
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                placeholder="Pearl Halter Kameez"
              />
              <TextField
                label="Slug"
                hint="storefront URL"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                onBlur={(e) => set("slug", slugify(e.target.value))}
                placeholder="pearl-halter-kameez"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Collection"
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Select a collection</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Pieces"
                value={form.pieces}
                onChange={(e) => set("pieces", e.target.value)}
              >
                <option value="">Not specified</option>
                {PIECE_PRESET.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectField>
            </div>

            <TextField
              label="Fabric"
              hint="shown above the spec table"
              value={form.fabric}
              onChange={(e) => set("fabric", e.target.value)}
              placeholder="Net over raw silk, fully lined"
            />

            <TextAreaField
              label="Description"
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="How the piece is cut, worked and finished…"
            />

            <ListField
              label="Highlights"
              value={form.highlights}
              onChange={(v) => set("highlights", v)}
              placeholder="Hand-embellished pearl work, Halter neckline"
            />
            <ListField
              label="Tags"
              hint="new · limited · bridal"
              value={form.tags}
              onChange={(v) => set("tags", v)}
              placeholder="new, formal"
            />
          </SectionCard>

          <SectionCard
            title="Sizing & colourways"
            description="Sizes appear as selectable chips on the product page; colours render as swatches."
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Sizes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SIZE_PRESET.map((s) => {
                  const on = form.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        set(
                          "sizes",
                          on
                            ? form.sizes.filter((x) => x !== s)
                            : [...form.sizes, s]
                        )
                      }
                      className={`h-10 min-w-[52px] rounded-sm border px-3 text-sm transition-colors ${
                        on
                          ? "border-hj-gold bg-hj-gold-wash text-hj-ink"
                          : "border-hj-border text-hj-muted hover:border-hj-border-strong"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <ListField
                className="mt-4"
                label="Custom sizes"
                hint="adds to the list above"
                value={form.sizes.filter((s) => !SIZE_PRESET.includes(s))}
                onChange={(custom) =>
                  set("sizes", [
                    ...form.sizes.filter((s) => SIZE_PRESET.includes(s)),
                    ...custom,
                  ])
                }
                placeholder="Unstitched, Made to measure"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Colourways
                </p>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.12em] text-hj-gold-deep hover:underline"
                  onClick={() =>
                    set("colors", [
                      ...form.colors,
                      { name: "", hex: "#C6982C" },
                    ])
                  }
                >
                  + Add colour
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {form.colors.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <input
                      value={c.name}
                      placeholder="Ivory Pearl"
                      onChange={(e) =>
                        set(
                          "colors",
                          form.colors.map((x, idx) =>
                            idx === i ? { ...x, name: e.target.value } : x
                          )
                        )
                      }
                      className="h-11 flex-1 rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
                    />
                    <input
                      type="color"
                      value={c.hex}
                      aria-label="Colour swatch"
                      onChange={(e) =>
                        set(
                          "colors",
                          form.colors.map((x, idx) =>
                            idx === i ? { ...x, hex: e.target.value } : x
                          )
                        )
                      }
                      className="h-11 w-14 cursor-pointer rounded-sm border border-hj-border bg-white p-1"
                    />
                    <button
                      type="button"
                      className="px-2 text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-danger"
                      onClick={() =>
                        set(
                          "colors",
                          form.colors.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {form.colors.length === 0 && (
                  <li className="text-xs text-hj-muted">
                    No colourways yet — the storefront falls back to a single
                    default swatch.
                  </li>
                )}
              </ul>
            </div>
          </SectionCard>

          <SectionCard
            title="Specifications"
            description="Rendered as the detail table on the product page."
          >
            <ul className="space-y-2">
              {form.specifications.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <input
                    value={s.key}
                    placeholder="Fabric"
                    onChange={(e) =>
                      set(
                        "specifications",
                        form.specifications.map((x, idx) =>
                          idx === i ? { ...x, key: e.target.value } : x
                        )
                      )
                    }
                    className="h-11 w-1/3 rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
                  />
                  <input
                    value={s.value}
                    placeholder="Net over raw silk"
                    onChange={(e) =>
                      set(
                        "specifications",
                        form.specifications.map((x, idx) =>
                          idx === i ? { ...x, value: e.target.value } : x
                        )
                      )
                    }
                    className="h-11 flex-1 rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    className="px-2 text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-danger"
                    onClick={() =>
                      set(
                        "specifications",
                        form.specifications.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.12em] text-hj-gold-deep hover:underline"
              onClick={() =>
                set("specifications", [
                  ...form.specifications,
                  { key: "", value: "" },
                ])
              }
            >
              + Add specification
            </button>
          </SectionCard>

          <SectionCard
            title="Search listing"
            description="Leave blank to fall back to the product name and description."
          >
            <TextField
              label="SEO title"
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              placeholder="Pearl Halter Kameez — ZOUQ 1 | HAJAR"
            />
            <TextAreaField
              label="SEO description"
              rows={3}
              value={form.seoDescription}
              onChange={(e) => set("seoDescription", e.target.value)}
            />
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SectionCard title="Availability">
            <SelectField
              label="Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as ProductStatus)}
            >
              <option value="draft">Draft — hidden from the storefront</option>
              <option value="published">Published — live</option>
            </SelectField>
            <TextField
              label="Stock"
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </SectionCard>

          <SectionCard title="Pricing">
            <TextField
              label="Price (PKR)"
              type="number"
              min={0}
              required
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
            <TextField
              label="Compare at"
              hint="optional"
              type="number"
              min={0}
              value={form.compareAtPrice}
              onChange={(e) => set("compareAtPrice", e.target.value)}
            />
            {form.price && (
              <p className="text-xs text-hj-muted">
                Shows as{" "}
                <span className="text-hj-ink">
                  {formatPrice(Number(form.price))}
                </span>
                {margin !== null && (
                  <span className="text-hj-danger"> · save {margin}%</span>
                )}
              </p>
            )}
          </SectionCard>

          <SectionCard
            title="Imagery"
            description="Portrait shots work best — 3:4 or taller."
          >
            <ImageUploader
              images={form.images}
              onChange={(next) => set("images", next)}
            />
          </SectionCard>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </form>
  );
}
