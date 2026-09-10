import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import type { AdminInstagramPost } from "../lib/data";
import { ImageUploader } from "../components/ImageUploader";
import { VideoUploader } from "../components/VideoUploader";
import { DeleteModal } from "../components/DeleteModal";
import { Toast } from "../components/Toast";

type ImportedPost = {
  image: string;
  caption: string;
  postUrl: string;
  mirrored: boolean;
  warning?: string;
};

/**
 * The storefront Instagram grid, curated by hand.
 *
 * Paste the link to a post and the image and caption are pulled in from it;
 * uploading is only needed when Instagram will not hand the post over.
 */
export function InstagramPage() {
  const [rows, setRows] = useState<AdminInstagramPost[]>([]);
  const [editing, setEditing] = useState<AdminInstagramPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [image, setImage] = useState<string[]>([]);
  const [video, setVideo] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importWarning, setImportWarning] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<AdminInstagramPost[]>("/instagram");
      setRows(data);
    } catch {
      setToast("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setImage([]);
    setVideo("");
    setPostUrl("");
    setCaption("");
    setImportError("");
    setImportWarning("");
  }

  function openNew() {
    setCreating(true);
    setEditing(null);
    resetForm();
  }

  function openEdit(row: AdminInstagramPost) {
    setEditing(row);
    setCreating(false);
    resetForm();
    setImage(row.image ? [row.image] : []);
    setVideo(row.video ?? "");
    setPostUrl(row.postUrl);
    setCaption(row.caption);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    resetForm();
  }

  /** Pull the image and caption off the pasted link. */
  async function importFromLink() {
    if (!postUrl.trim()) {
      setImportError("Paste the link to the post first");
      return;
    }
    setImporting(true);
    setImportError("");
    setImportWarning("");
    try {
      const { data } = await api.post<ImportedPost>("/instagram/import", {
        url: postUrl,
      });
      setImage([data.image]);
      setPostUrl(data.postUrl);
      // Never overwrite a caption that has already been written by hand
      setCaption((current) => current || data.caption);
      if (!data.mirrored && data.warning) setImportWarning(data.warning);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ??
        "Could not reach Instagram — upload the image instead.";
      setImportError(message);
    } finally {
      setImporting(false);
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // The uploader holds a list; a tile only ever uses the first image
    if (!image[0]) {
      setToast("Fetch the post or upload an image first");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payload = {
      image: image[0],
      video,
      caption,
      postUrl,
      published: fd.get("published") === "on",
    };

    try {
      if (editing) {
        const { data } = await api.patch<AdminInstagramPost>(
          `/instagram/${editing.id}`,
          payload
        );
        setRows((r) => r.map((p) => (p.id === editing.id ? data : p)));
        setToast("Post updated");
      } else {
        const { data } = await api.post<AdminInstagramPost>(
          "/instagram",
          payload
        );
        setRows((r) => [...r, data]);
        setToast("Post added");
      }
      closeForm();
    } catch {
      setToast("Save failed");
    }
  }

  /** Swap a tile with its neighbour and persist the whole order. */
  async function move(index: number, direction: 1 | -1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    try {
      const { data } = await api.patch<AdminInstagramPost[]>(
        "/instagram/reorder",
        { ids: next.map((p) => p.id) }
      );
      setRows(data);
    } catch {
      setToast("Reorder failed");
      void load();
    }
  }

  async function togglePublished(row: AdminInstagramPost) {
    try {
      const { data } = await api.patch<AdminInstagramPost>(
        `/instagram/${row.id}`,
        { published: !row.published }
      );
      setRows((r) => r.map((p) => (p.id === row.id ? data : p)));
    } catch {
      setToast("Update failed");
    }
  }

  const formOpen = creating || !!editing;
  const liveCount = rows.filter((r) => r.published).length;
  const field =
    "mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none";
  const label = "text-[10px] uppercase tracking-[0.16em] text-hj-muted";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
            Storefront
          </p>
          <h1 className="mt-2 font-display text-4xl text-hj-ink">Instagram</h1>
          <div className="rule-gold mt-3 h-px w-20" />
          <p className="mt-3 text-sm text-hj-muted">
            {loading
              ? "Loading…"
              : `${rows.length} posts · ${liveCount} showing on the home page`}
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="h-11 rounded-sm bg-hj-ink px-5 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
        >
          Add post
        </button>
      </div>

      {formOpen && (
        <form
          key={editing?.id ?? "new"}
          onSubmit={save}
          className="mt-7 rounded-sm border border-hj-border bg-white p-5"
        >
          <h2 className="font-display text-xl text-hj-ink">
            {editing ? "Edit post" : "New post"}
          </h2>

          {/* Step 1 — the link does the work */}
          <div className="mt-5 rounded-sm border border-hj-border bg-hj-cream p-4">
            <span className={label}>Link to the post</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/…"
                className="h-11 min-w-[260px] flex-1 rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void importFromLink()}
                disabled={importing}
                className="h-11 shrink-0 rounded-sm border border-hj-ink bg-white px-5 text-[11px] uppercase tracking-[0.16em] text-hj-ink transition-colors hover:bg-hj-ink hover:text-hj-gold-soft disabled:opacity-50"
              >
                {importing ? "Fetching…" : "Fetch post"}
              </button>
            </div>
            <span className="mt-2 block text-[11px] text-hj-muted">
              Pulls the picture and caption straight off the post. Leave the
              link empty to link the tile to your profile instead.
            </span>
            {importError && (
              <p className="mt-2 text-[11px] text-hj-danger">{importError}</p>
            )}
            {importWarning && (
              <p className="mt-2 text-[11px] text-hj-gold-deep">
                {importWarning}
              </p>
            )}
          </div>

          {/* Step 2 — what came back, still editable */}
          <div className="mt-5">
            <span className={label}>
              {image.length ? "Image" : "Image — or upload one yourself"}
            </span>
            <div className="mt-2">
              <ImageUploader
                images={image}
                // Only the first upload is kept — a tile is one square
                onChange={(next) => setImage(next.slice(0, 1))}
              />
            </div>
          </div>

          {/* Optional reel. The image above is still required: it is the
              poster frame, and what the grid falls back to. */}
          <div className="mt-5">
            <span className={label}>Reel — optional</span>
            <div className="mt-2">
              <VideoUploader value={video} onChange={setVideo} />
            </div>
          </div>

          <label className="mt-5 block">
            <span className={label}>Caption</span>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Hand-set pearl on the ZOUQ 2 kalidar."
              className={field}
            />
            <span className="mt-1.5 block text-[11px] text-hj-muted">
              Shown on hover, and read out as the image description.
            </span>
          </label>

          <label className="mt-5 flex items-center gap-2.5">
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing ? editing.published : true}
              className="h-4 w-4 accent-hj-gold"
            />
            <span className="text-sm text-hj-ink-soft">
              Show on the storefront
            </span>
          </label>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="h-11 rounded-sm bg-hj-ink px-6 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="h-11 rounded-sm border border-hj-border px-5 text-[11px] uppercase tracking-[0.16em] text-hj-ink-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* The grid mirrors the storefront order, so this page reads as a preview */}
      {rows.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((row, i) => (
            <li
              key={row.id}
              className="overflow-hidden rounded-sm border border-hj-border bg-white"
            >
              <div className="relative">
                <img
                  src={row.image}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                {!row.published && (
                  <span className="absolute left-2 top-2 bg-hj-ink px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-hj-gold-soft">
                    Hidden
                  </span>
                )}
                <span className="absolute right-2 top-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[10px] text-hj-muted">
                  {i + 1}
                </span>
              </div>

              <div className="border-t border-hj-border p-3">
                <p className="line-clamp-2 min-h-[2.5rem] text-[12px] leading-relaxed text-hj-ink-soft">
                  {row.caption || (
                    <span className="text-hj-muted">No caption</span>
                  )}
                </p>
                {row.postUrl && (
                  <a
                    href={row.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target mt-1 block truncate py-1.5 text-[11px] text-hj-gold-deep hover:underline"
                  >
                    View on Instagram
                  </a>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-hj-border pt-2.5">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Move earlier"
                      disabled={i === 0}
                      onClick={() => void move(i, -1)}
                      className="tap-target px-2.5 py-1.5 text-xs text-hj-muted hover:text-hj-ink disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Move later"
                      disabled={i === rows.length - 1}
                      onClick={() => void move(i, 1)}
                      className="tap-target px-2.5 py-1.5 text-xs text-hj-muted hover:text-hj-ink disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => void togglePublished(row)}
                      className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-gold-deep"
                    >
                      {row.published ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-gold-deep"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(row.id)}
                      className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && rows.length === 0 && (
        <div className="mt-6 rounded-sm border border-dashed border-hj-border-strong bg-white px-6 py-16 text-center">
          <p className="font-display text-xl text-hj-ink">No posts yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-hj-muted">
            Paste the link to a post and the picture and caption come across on
            their own. The grid stays hidden on the home page until the first
            one is added.
          </p>
          <button
            type="button"
            onClick={openNew}
            className="mt-6 h-11 rounded-sm bg-hj-ink px-6 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
          >
            Add the first post
          </button>
        </div>
      )}

      <DeleteModal
        open={!!deleteId}
        title="Delete this post?"
        description="The tile is removed from the home page. The image stays in Cloudinary."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            await api.delete(`/instagram/${deleteId}`);
            setRows((r) => r.filter((p) => p.id !== deleteId));
            setToast("Post deleted");
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
