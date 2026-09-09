import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/clsx";

type Variant = "solid" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

/**
 * All four are drawn for a light ground — the storefront has no dark sections.
 * `cn` does no class merging, so overriding these colours through `className`
 * leaves both sets in the markup and lets CSS order decide: add a variant here
 * instead.
 */
const VARIANTS: Record<Variant, string> = {
  solid:
    "bg-hj-ink text-hj-gold-soft hover:bg-hj-gold hover:text-hj-ink border border-hj-ink hover:border-hj-gold",
  gold: "bg-hj-gold text-hj-ink hover:bg-hj-ink hover:text-hj-gold-soft border border-hj-gold hover:border-hj-ink",
  outline:
    "border border-hj-ink text-hj-ink hover:bg-hj-ink hover:text-hj-gold-soft",
  ghost:
    "border border-hj-border text-hj-ink-soft hover:border-hj-gold-deep hover:text-hj-gold-deep",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-[10px]",
  md: "h-12 px-7 text-[11px]",
  lg: "h-14 px-9 text-xs",
};

const BASE =
  "inline-flex items-center justify-center uppercase tracking-[0.18em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45";

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      {...props}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
    >
      {children}
    </Link>
  );
}
