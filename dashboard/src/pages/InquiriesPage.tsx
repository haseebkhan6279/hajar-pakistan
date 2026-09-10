import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  INQUIRY_STATUSES,
  formatDate,
  whatsappHref,
  type AdminInquiry,
  type InquiryStatus,
} from "../lib/data";
import { Toast } from "../components/Toast";
import { DeleteModal } from "../components/DeleteModal";

const STATUS_TONE: Record<InquiryStatus, string> = {
  new: "bg-hj-gold-wash text-hj-gold-deep",
  read: "bg-hj-sand text-hj-ink-soft",
  replied: "bg-hj-success/10 text-hj-success",
  closed: "bg-hj-sand-2 text-hj-muted",
};

export function InquiriesPage() {
  const [rows, setRows] = useState<AdminInquiry[]>([]);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<AdminInquiry | null>(null);
  const [note, setNote] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<AdminInquiry[]>("/inquiries", {
        params: { status: status || undefined },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setRows(data);
        setSelected((prev) =>
          prev ? (data.find((i) => i.id === prev.id) ?? null) : null
        );
      })
      .catch(() => {
        if (!cancelled) setToast("Failed to load enquiries");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  /**
   * Opening an unanswered enquiry marks it read, so the "new" count means
   * "nobody has looked at this yet" rather than "nobody has replied".
   */
  function open(row: AdminInquiry) {
    setSelected(row);
    setNote(row.adminNote);
    if (row.status === "new") void updateStatus(row.id, "read", true);
  }

  async function updateStatus(id: string, next: string, quiet = false) {
    try {
      const { data } = await api.patch<AdminInquiry>(
        `/inquiries/${id}/status`,
        { status: next }
      );
      setRows((r) => r.map((i) => (i.id === id ? data : i)));
      setSelected((prev) => (prev?.id === id ? data : prev));
      if (!quiet) setToast(`Marked as ${next}`);
    } catch {
      setToast("Status update failed");
    }
  }

  async function saveNote() {
    if (!selected) return;
    try {
      const { data } = await api.patch<AdminInquiry>(
        `/inquiries/${selected.id}/note`,
        { adminNote: note }
      );
      setRows((r) => r.map((i) => (i.id === data.id ? data : i)));
      setSelected(data);
      setToast("Note saved");
    } catch {
      setToast("Could not save the note");
    }
  }

  async function remove() {
    if (!deleteId) return;
    try {
      await api.delete(`/inquiries/${deleteId}`);
      setRows((r) => r.filter((i) => i.id !== deleteId));
      setSelected((prev) => (prev?.id === deleteId ? null : prev));
      setToast("Enquiry deleted");
    } catch {
      setToast("Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  const unanswered = rows.filter((i) => i.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-hj-muted">
            Front of house
          </p>
          <h1 className="mt-2 font-display text-4xl text-hj-ink">Enquiries</h1>
          <div className="rule-gold mt-3 h-px w-20" />
          <p className="mt-3 text-sm text-hj-muted">
            {loading
              ? "Loading…"
              : `${rows.length} in this view${
                  unanswered ? ` · ${unanswered} not yet opened` : ""
                }`}
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
        >
          <option value="">All status</option>
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="overflow-x-auto rounded-sm border border-hj-border bg-white">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-hj-border bg-hj-cream text-[10px] uppercase tracking-[0.14em] text-hj-muted">
              <tr>
                <th className="px-4 py-3.5 font-medium">From</th>
                <th className="px-4 py-3.5 font-medium">Subject</th>
                <th className="px-4 py-3.5 font-medium">Received</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hj-border">
              {rows.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => open(i)}
                  className={`cursor-pointer transition-colors ${
                    selected?.id === i.id
                      ? "bg-hj-gold-wash"
                      : "hover:bg-hj-cream/60"
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <p
                      className={`text-hj-ink ${
                        i.status === "new" ? "font-medium" : ""
                      }`}
                    >
                      {i.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-hj-muted">
                      {i.phone || i.email || "no contact given"}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-hj-ink">{i.subject || "—"}</p>
                    <p className="mt-0.5 max-w-[26ch] truncate text-[11px] text-hj-muted">
                      {i.message}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-hj-muted">
                    {formatDate(i.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${STATUS_TONE[i.status]}`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-16 text-center text-sm text-hj-muted"
                  >
                    No enquiries in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <aside className="h-fit rounded-sm border border-hj-border bg-white p-5">
          {!selected ? (
            <div className="py-10 text-center">
              <p className="font-display text-xl text-hj-ink">
                Enquiry details
              </p>
              <p className="mt-2 text-sm text-hj-muted">
                Select a row to read the message and reply on WhatsApp or by
                email.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  {selected.subject || "Enquiry"}
                </p>
                <p className="mt-1.5 font-display text-xl text-hj-ink">
                  {selected.name}
                </p>
                <p className="mt-1 text-xs text-hj-muted">
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Message
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-hj-ink">
                  {selected.message}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Reply
                </p>
                <div className="mt-2.5 space-y-2 text-sm">
                  {selected.phone && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <a
                        href={`tel:${selected.phone}`}
                        className="tap-target text-hj-ink hover:text-hj-gold-deep"
                      >
                        {selected.phone}
                      </a>
                      <a
                        href={whatsappHref(
                          selected.phone,
                          `Hello ${selected.name}, thank you for writing to HAJAR.`
                        )}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-gold-deep hover:underline"
                      >
                        WhatsApp →
                      </a>
                    </div>
                  )}
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent(
                        `Re: ${selected.subject || "Your enquiry"} — HAJAR`
                      )}`}
                      className="tap-target block break-all text-hj-ink hover:text-hj-gold-deep"
                    >
                      {selected.email}
                    </a>
                  )}
                  {!selected.phone && !selected.email && (
                    <p className="text-hj-muted">
                      No contact details were given — they may have continued on
                      WhatsApp instead.
                    </p>
                  )}
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Internal note
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Fitting booked for Thursday…"
                  className="mt-2 w-full rounded-sm border border-hj-border bg-white px-3 py-2 text-sm focus:border-hj-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void saveNote()}
                  disabled={note === selected.adminNote}
                  className="tap-target mt-2 text-[11px] uppercase tracking-[0.12em] text-hj-gold-deep hover:underline disabled:opacity-40 disabled:hover:no-underline"
                >
                  Save note
                </button>
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                  Update status
                </span>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    void updateStatus(selected.id, e.target.value)
                  }
                  className="mt-2 h-11 w-full rounded-sm border border-hj-border bg-white px-3 text-sm focus:border-hj-gold focus:outline-none"
                >
                  {INQUIRY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => setDeleteId(selected.id)}
                className="tap-target text-[11px] uppercase tracking-[0.12em] text-hj-muted hover:text-hj-danger"
              >
                Delete enquiry
              </button>
            </div>
          )}
        </aside>
      </div>

      <DeleteModal
        open={deleteId !== null}
        title="Delete this enquiry?"
        description="The message and any note on it are removed for good."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
