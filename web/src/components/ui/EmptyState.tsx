import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-hj-border bg-hj-cream px-6 py-20 text-center">
      <p className="font-display text-3xl text-hj-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-hj-muted">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
