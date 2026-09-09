import type { ReactNode } from "react";
import { cn } from "@/lib/clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-6",
        centered ? "flex-col text-center" : "justify-between"
      )}
    >
      <div className={cn(centered && "flex flex-col items-center")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 font-display text-4xl leading-[1.05] text-hj-ink md:text-5xl">
          {title}
        </h2>
        <div className={cn("rule-gold mt-4 h-px w-20", centered && "mx-auto")} />
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-hj-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
