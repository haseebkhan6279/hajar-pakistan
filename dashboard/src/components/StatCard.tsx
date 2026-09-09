export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "gold" | "danger";
}) {
  const valueTone =
    tone === "gold"
      ? "text-hj-gold-deep"
      : tone === "danger"
        ? "text-hj-danger"
        : "text-hj-ink";

  return (
    <div className="rounded-sm border border-hj-border bg-white p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
        {label}
      </p>
      <p className={`mt-3 font-display text-4xl leading-none ${valueTone}`}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-hj-muted">{hint}</p>}
    </div>
  );
}
