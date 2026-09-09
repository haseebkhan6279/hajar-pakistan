import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const CONTROL =
  "w-full rounded-sm border border-hj-border bg-white px-3 text-sm text-hj-ink placeholder:text-hj-muted/70 transition-colors focus:border-hj-gold focus:outline-none";

export function Label({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <span className="flex items-baseline justify-between gap-2">
      <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
        {children}
      </span>
      {hint && <span className="text-[10px] text-hj-muted/80">{hint}</span>}
    </span>
  );
}

export function TextField({
  label,
  hint,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <Label hint={hint}>{label}</Label>
      <input {...props} className={`${CONTROL} mt-2 h-11`} />
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  className = "",
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <Label hint={hint}>{label}</Label>
      <textarea {...props} rows={rows} className={`${CONTROL} mt-2 py-2.5`} />
    </label>
  );
}

export function SelectField({
  label,
  hint,
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <Label hint={hint}>{label}</Label>
      <select {...props} className={`${CONTROL} mt-2 h-11`}>
        {children}
      </select>
    </label>
  );
}

/** Comma / newline separated list editor used for tags, highlights, sizes. */
export function ListField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <Label hint={hint ?? "comma separated"}>{label}</Label>
      <input
        value={value.join(", ")}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        className={`${CONTROL} mt-2 h-11`}
      />
    </label>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-sm border border-hj-border bg-white p-5 md:p-6">
      <h2 className="font-display text-xl text-hj-ink">{title}</h2>
      <div className="rule-gold mt-2 h-px w-12" />
      {description && (
        <p className="mt-2 text-xs text-hj-muted">{description}</p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}
