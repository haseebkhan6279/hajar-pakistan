import { useState } from "react";
import { api } from "../lib/api";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function move(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post<{ url: string }>("/uploads", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError("Upload failed — check the Cloudinary keys in api/.env");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed px-4 py-12 text-center transition-colors ${
          dragging
            ? "border-hj-gold bg-hj-gold-wash"
            : "border-hj-border-strong bg-hj-cream hover:bg-hj-gold-wash"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="font-display text-lg text-hj-ink">
          {uploading ? "Uploading…" : "Drop images or click to upload"}
        </span>
        <span className="mt-1.5 text-xs text-hj-muted">
          JPG or PNG up to 8 MB · first image becomes the cover
        </span>
      </label>

      {error && <p className="mt-2 text-xs text-hj-danger">{error}</p>}

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="overflow-hidden rounded-sm border border-hj-border bg-white"
            >
              <div className="relative">
                <img
                  src={src}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 bg-hj-ink px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-hj-gold-soft">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-hj-border px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Move left"
                  className="px-1 text-xs text-hj-muted hover:text-hj-ink"
                  onClick={() => move(i, i - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="text-[11px] text-hj-muted hover:text-hj-danger"
                  onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
                <button
                  type="button"
                  aria-label="Move right"
                  className="px-1 text-xs text-hj-muted hover:text-hj-ink"
                  onClick={() => move(i, i + 1)}
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
