export function DeleteModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-hj-ink/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-sm border border-hj-border bg-white p-6 shadow-[0_24px_60px_rgb(18_16_12/0.18)]">
        <h2 className="font-display text-2xl text-hj-ink">{title}</h2>
        <div className="rule-gold mt-3 h-px w-16" />
        <p className="mt-3 text-sm leading-relaxed text-hj-muted">
          {description}
        </p>
        <div className="mt-7 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-sm border border-hj-border px-4 text-sm text-hj-ink-soft transition-colors hover:border-hj-border-strong"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-sm bg-hj-danger px-4 text-sm text-white transition-opacity hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
