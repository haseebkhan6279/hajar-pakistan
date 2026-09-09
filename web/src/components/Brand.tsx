import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/clsx";

export const LOGO_SRC = "/brand/hajar-logo.jpg";

/**
 * The supplied logo is a square tile: an outer mandala frame, a gold roundel
 * carrying the هجر calligraphy, and the HAJAR wordmark beneath.
 *
 * For a small header mark we want the roundel alone, so the image is scaled up
 * inside a clipped circle and offset to centre on it. Measured off the asset:
 * the roundel spans roughly 33–67% horizontally and 29–62% vertically.
 */
export function LogoMark({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-hj-ink",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={size * 3}
        height={size * 3}
        priority
        className="max-w-none"
        style={{
          position: "absolute",
          width: size * 2.9,
          height: size * 2.9,
          left: -size * 0.95,
          top: -size * 0.82,
        }}
      />
    </span>
  );
}

/** The full logo tile — used where a brand block has room to breathe. */
export function LogoTile({
  size = 180,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="HAJAR"
      width={size}
      height={size}
      className={cn("h-auto", className)}
      style={{ width: size }}
    />
  );
}

export function Wordmark({
  className,
  href = "/",
  showMark = true,
}: {
  className?: string;
  href?: string;
  showMark?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="HAJAR — home"
      className={cn("flex items-center gap-3", className)}
    >
      {showMark && <LogoMark size={38} />}
      <span className="font-display text-2xl font-semibold tracking-brand text-hj-ink">
        HAJAR
      </span>
    </Link>
  );
}

/** Repeating geometric border lifted from the logo's mandala frame. */
export function GoldFret({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-2 w-full", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--hj-gold) 0 1px, transparent 1px 8px)",
        opacity: 0.5,
      }}
    />
  );
}
