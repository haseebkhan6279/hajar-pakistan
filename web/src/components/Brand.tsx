import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/clsx";

/** Full square tile: mandala frame, gold roundel, wordmark, designer byline. */
export const LOGO_SRC = "/brand/hajar-logo.png";
/** Inner monogram only — the gold roundel cropped for headers, favicons, lockups. */
export const MARK_SRC = "/brand/hajar-mark.png";

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
        src={MARK_SRC}
        alt=""
        width={size}
        height={size}
        priority
        className="h-full w-full object-cover"
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
      alt="HAJAR by Nazish Ali"
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
      aria-label="HAJAR by Nazish Ali — home"
      className={cn("flex items-center gap-3", className)}
    >
      {showMark && <LogoMark size={38} />}
      <span className="leading-none">
        <span className="block font-display text-2xl font-semibold tracking-brand text-hj-ink">
          HAJAR
        </span>
        <span className="mt-1 block text-[9px] uppercase tracking-[0.22em] text-hj-gold-deep">
          by Nazish Ali
        </span>
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
