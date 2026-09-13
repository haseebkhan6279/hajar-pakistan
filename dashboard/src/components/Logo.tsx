const MARK_SRC = "/brand/hajar-mark.png";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full bg-hj-ink"
      style={{ width: size, height: size }}
      role="img"
      aria-label="HAJAR by Nazish Ali"
    >
      <img
        src={MARK_SRC}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function Wordmark({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
      <div className="leading-none">
        <p className="font-display text-xl font-semibold tracking-brand text-hj-ink">
          HAJAR
        </p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-hj-gold-deep">
          by Nazish Ali
        </p>
        {subtitle && (
          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-hj-muted">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
