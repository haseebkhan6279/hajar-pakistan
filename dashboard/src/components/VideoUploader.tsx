import { useState } from "react";
import { api, uploadErrorMessage } from "../lib/api";

/** Mirrors MAX_VIDEO_BYTES in api/src/uploads/uploads.controller.ts. */
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

/**
 * A single reel for an Instagram tile.
 *
 * Unlike ImageUploader this holds one value, not a list: a tile is one square,
 * and a reel either plays there or it does not. An empty string means the tile
 * is a still.
 *
 * Uploads go to the same `/uploads` endpoint, which routes anything with a
 * video mime type to Cloudinary as `resource_type: 'video'`.
 */
export function VideoUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(files: FileList | File[]) {
    const file = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (!file) {
      setError("That is not a video file");
      return;
    }
    // Checked here as well as on the server so the reel is not pushed all the
    // way up before being turned away.
    if (file.size > MAX_VIDEO_BYTES) {
      setError("Videos must be 40 MB or smaller");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post<{ url: string }>("/uploads", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (err) {
      setError(uploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div>
        <div className="overflow-hidden rounded-sm border border-hj-border bg-white">
          <video
            key={value}
            src={value}
            controls
            muted
            playsInline
            preload="metadata"
            className="aspect-[3/4] w-full bg-hj-sand object-cover"
          />
          <div className="flex items-center justify-between gap-2 border-t border-hj-border px-2 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.14em] text-hj-muted">
              Reel
            </span>
            <button
              type="button"
              className="text-[11px] text-hj-muted hover:text-hj-danger"
              onClick={() => {
                onChange("");
                setError("");
              }}
            >
              Remove
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-hj-danger">{error}</p>}
      </div>
    );
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
          if (e.dataTransfer.files?.length) void uploadFile(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="video/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFile(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="font-display text-lg text-hj-ink">
          {uploading ? "Uploading…" : "Drop a reel or click to upload"}
        </span>
        <span className="mt-1.5 text-xs text-hj-muted">
          MP4 up to 40 MB · optional — leave empty for a still tile
        </span>
      </label>

      {error && <p className="mt-2 text-xs text-hj-danger">{error}</p>}
    </div>
  );
}
